
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const authMiddleware = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const { generateLegalResponse, detectLegalCategory } = require('../services/aiService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const ALLOWED_CATEGORIES = [
  'consumer_rights',
  'property_law',
  'labor_law',
  'cyber_law',
  'constitutional_rights',
  'criminal_law',
  'family_law',
  'tax_law',
  'corporate_law',
  'general'
];

// Shared pipeline: load/create conversation, get AI response, persist, return result.
// Used by both the plain chat route and the document-analysis route.
async function processMessage(userId, conversationId, messageText, titleSource) {
  let conversation;

  if (conversationId) {
    conversation = await Conversation.findOne({ _id: conversationId, user: userId });
    if (!conversation) {
      const err = new Error('Conversation not found.');
      err.status = 404;
      throw err;
    }
  } else {
    conversation = new Conversation({ user: userId, messages: [] });
  }

  const conversationHistory = conversation.messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  const aiResult = await generateLegalResponse(messageText, conversationHistory, userId);

  const category = detectLegalCategory(messageText);
  conversation.legalCategory = ALLOWED_CATEGORIES.includes(category) ? category : 'general';

  conversation.messages.push({
    role: 'user',
    content: messageText,
    timestamp: new Date(),
    legalTopics: [category]
  });

  conversation.messages.push({
    role: 'assistant',
    content: aiResult.content,
    timestamp: new Date(),
    legalTopics: [aiResult.category]
  });

  if (conversation.messages.length <= 2) {
    const source = titleSource || messageText;
    conversation.title = source.substring(0, 60) + (source.length > 60 ? '...' : '');
  }

  await conversation.save();

  return {
    conversationId: conversation._id,
    message: {
      role: 'assistant',
      content: aiResult.content,
      timestamp: new Date(),
      legalCategory: aiResult.category
    },
    conversationTitle: conversation.title
  };
}

// POST /api/chat - Send a message
router.post('/', authMiddleware, async (req, res) => {
  try {

    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.'
      });
    }

    const result = await processMessage(req.user._id, conversationId, message.trim());

    res.json({ success: true, ...result });

  } catch (error) {

    console.error('Chat error:', error);

    res.status(error.status || 500).json({
      success: false,
      message: error.status === 404 ? error.message : 'Failed to process your query. Please try again.'
    });

  }
});

// POST /api/chat/analyze-document - Upload a PDF/text file for AI analysis
router.post('/analyze-document', authMiddleware, upload.single('file'), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'A file is required.'
      });
    }

    const { message = '', conversationId } = req.body;
    const filename = req.file.originalname;
    const isPdf = req.file.mimetype === 'application/pdf' || /\.pdf$/i.test(filename);
    const isText = req.file.mimetype === 'text/plain' || /\.txt$/i.test(filename);

    if (!isPdf && !isText) {
      return res.status(400).json({
        success: false,
        message: 'Only PDF and .txt files are supported.'
      });
    }

    let extractedText;
    if (isPdf) {
      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      await parser.destroy();
      extractedText = result.text;
    } else {
      extractedText = req.file.buffer.toString('utf8');
    }

    extractedText = (extractedText || '').slice(0, 8000).trim();

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract any text from this file.'
      });
    }

    const question = message.trim() || 'Please review this document and point out anything important I should know.';
    const combinedMessage = `📎 Uploaded document: ${filename}\n\n${extractedText}\n\nQuestion: ${question}`;

    const result = await processMessage(req.user._id, conversationId, combinedMessage, `📎 ${filename} — ${question}`);

    res.json({ success: true, ...result });

  } catch (error) {

    console.error('Document analysis error:', error);

    res.status(error.status || 500).json({
      success: false,
      message: error.status === 404 ? error.message : 'Failed to analyze the document. Please try again.'
    });

  }
});



// GET /api/chat/stats - Aggregated stats for the logged-in user's own conversations
router.get('/stats', authMiddleware, async (req, res) => {

  try {

    const userId = req.user._id;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

    const [total, thisWeek, categoryBreakdown, weeklyActivity] = await Promise.all([
      Conversation.countDocuments({ user: userId, isActive: true }),

      Conversation.countDocuments({ user: userId, isActive: true, createdAt: { $gte: weekAgo } }),

      Conversation.aggregate([
        { $match: { user: userId, isActive: true } },
        { $group: { _id: '$legalCategory', count: { $sum: 1 } } },
        { $project: { _id: 0, category: '$_id', count: 1 } },
        { $sort: { count: -1 } }
      ]),

      Conversation.aggregate([
        { $match: { user: userId, isActive: true, createdAt: { $gte: sixWeeksAgo } } },
        {
          $group: {
            _id: {
              $dateTrunc: { date: '$createdAt', unit: 'week', startOfWeek: 'monday' }
            },
            count: { $sum: 1 }
          }
        },
        { $project: { _id: 0, weekStart: '$_id', count: 1 } },
        { $sort: { weekStart: 1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        total,
        thisWeek,
        categoryBreakdown,
        weeklyActivity
      }
    });

  } catch (error) {

    console.error('Stats error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats.'
    });

  }

});



// GET /api/chat/conversations
router.get('/conversations', authMiddleware, async (req, res) => {

  try {

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      user: req.user._id,
      isActive: true
    })
      .select('title legalCategory createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const conversationsWithCount = conversations.map(conv => ({
      _id: conv._id,
      title: conv.title,
      legalCategory: conv.legalCategory,
      messageCount: conv.messages.length,
      lastMessage:
        conv.messages.length > 0
          ? conv.messages[conv.messages.length - 1]
          : null,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }));

    const total = await Conversation.countDocuments({
      user: req.user._id,
      isActive: true
    });

    res.json({
      success: true,
      conversations: conversationsWithCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations.'
    });

  }

});



// GET conversation history
router.get('/history/:conversationId', authMiddleware, async (req, res) => {

  try {

    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      user: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.'
      });
    }

    res.json({
      success: true,
      conversation
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation.'
    });

  }

});



// GET all history for user
router.get('/history/user/:user_id', authMiddleware, async (req, res) => {

  try {

    if (req.user._id.toString() !== req.params.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const conversations = await Conversation.find({
      user: req.params.user_id,
      isActive: true
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Failed to fetch history.'
    });

  }

});



// DELETE conversation
router.delete('/conversations/:id', authMiddleware, async (req, res) => {

  try {

    await Conversation.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      {
        isActive: false
      }
    );

    res.json({
      success: true,
      message: 'Conversation deleted.'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation.'
    });

  }

});



// Start new conversation
router.post('/new', authMiddleware, async (req, res) => {

  try {

    const conversation = new Conversation({
      user: req.user._id,
      messages: [],
      title: 'New Legal Consultation'
    });

    await conversation.save();

    res.json({
      success: true,
      conversationId: conversation._id
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Failed to create conversation.'
    });

  }

});


module.exports = router;

