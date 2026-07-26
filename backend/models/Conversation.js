const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  legalTopics: [{
    type: String
  }],
  lawReferences: [{
    type: String
  }]
});

const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Legal Consultation'
  },
  messages: [messageSchema],
  legalCategory: {
    type: String,
    enum: [
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
    ],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    enum: ['english', 'hindi'],
    default: 'english'
  }
}, {
  timestamps: true
});

// Auto-generate title from first message
conversationSchema.methods.generateTitle = function() {
  if (this.messages.length > 0) {
    const firstUserMsg = this.messages.find(m => m.role === 'user');
    if (firstUserMsg) {
      this.title = firstUserMsg.content.substring(0, 60) + (firstUserMsg.content.length > 60 ? '...' : '');
    }
  }
};

// Virtual for message count
conversationSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

module.exports = mongoose.model('Conversation', conversationSchema);
