const express = require('express');
const router = express.Router();
const LegalTopic = require('../models/LegalTopic');
const authMiddleware = require('../middleware/auth');

// Seed data for Indian legal topics
const SEED_TOPICS = [
  {
    topic: 'Consumer Protection Rights',
    category: 'consumer_rights',
    description: 'Rights of consumers under Consumer Protection Act, 2019',
    lawReference: 'Consumer Protection Act, 2019',
    keyPoints: ['Right to Safety', 'Right to Information', 'Right to Redressal', 'District/State/National Consumer Forums'],
    keywords: ['consumer', 'refund', 'defective product', 'misleading advertisement', 'unfair trade practice']
  },
  {
    topic: 'Property Registration & Transfer',
    category: 'property_law',
    description: 'Laws governing property sale, purchase and transfer in India',
    lawReference: 'Transfer of Property Act 1882, Registration Act 1908',
    keyPoints: ['Mandatory registration', 'Stamp duty', 'Sale deed', 'Title verification'],
    keywords: ['property', 'sale deed', 'registry', 'stamp duty', 'title']
  },
  {
    topic: 'RERA – Real Estate Regulations',
    category: 'property_law',
    description: 'Protection for homebuyers under Real Estate Regulation Act',
    lawReference: 'Real Estate (Regulation and Development) Act, 2016',
    keyPoints: ['Builder registration', 'Delay compensation', 'Quality standards', 'Dispute resolution'],
    keywords: ['builder', 'flat', 'apartment', 'rera', 'possession', 'delay', 'real estate']
  },
  {
    topic: 'Employee Provident Fund (EPF)',
    category: 'labor_law',
    description: 'Mandatory retirement savings for employees',
    lawReference: 'Employees Provident Fund Act, 1952',
    keyPoints: ['12% employer + 12% employee contribution', 'UAN number', 'Withdrawal rules', 'Grievance portal'],
    keywords: ['pf', 'provident fund', 'epf', 'uan', 'retirement', 'employer contribution']
  },
  {
    topic: 'Cyber Crime & IT Act',
    category: 'cyber_law',
    description: 'Digital offences and remedies under IT Act, 2000',
    lawReference: 'Information Technology Act, 2000 & Amendment 2008, DPDP Act 2023',
    keyPoints: ['Hacking penalty', 'Identity theft', 'Data protection', 'Report at cybercrime.gov.in'],
    keywords: ['hacking', 'cyber fraud', 'data breach', 'online scam', 'phishing', 'cybercrime']
  },
  {
    topic: 'Fundamental Rights',
    category: 'constitutional_rights',
    description: 'Basic rights guaranteed to all Indian citizens under Constitution',
    lawReference: 'Constitution of India, Part III (Articles 12-35)',
    keyPoints: ['Right to Equality', 'Right to Freedom', 'Right to Constitutional Remedies', 'Writs'],
    keywords: ['fundamental rights', 'equality', 'freedom', 'article 19', 'article 21', 'right to life']
  },
  {
    topic: 'FIR & Criminal Procedure',
    category: 'criminal_law',
    description: 'Rights and procedures under Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
    lawReference: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023',
    keyPoints: ['Zero FIR', 'Rights of accused', 'Bail provisions', '24-hour magistrate production'],
    keywords: ['fir', 'police', 'arrest', 'bail', 'crime', 'complaint', 'bnss']
  },
  {
    topic: 'Domestic Violence Protection',
    category: 'family_law',
    description: 'Protection for women against domestic abuse',
    lawReference: 'Protection of Women from Domestic Violence Act, 2005',
    keyPoints: ['Physical, emotional, economic abuse covered', 'Protection orders', 'Residence orders', 'Compensation'],
    keywords: ['domestic violence', 'abuse', 'protection order', 'husband', 'in-laws', 'wife']
  }
];

// GET /api/legal/topics - Get all legal topics
router.get('/topics', async (req, res) => {
  try {
    let topics = await LegalTopic.find({ isActive: true }).select('-__v');

    // Auto-seed if empty
    if (topics.length === 0) {
      await LegalTopic.insertMany(SEED_TOPICS);
      topics = await LegalTopic.find({ isActive: true });
    }

    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch topics.' });
  }
});

// GET /api/legal/topics/:category - Get topics by category
router.get('/topics/:category', async (req, res) => {
  try {
    const topics = await LegalTopic.find({
      category: req.params.category,
      isActive: true
    });
    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch topics.' });
  }
});

// GET /api/legal/faqs - Frequently asked questions
router.get('/faqs', async (req, res) => {
  const faqs = [
    {
      id: 1,
      question: 'What are my consumer rights if I receive a defective product?',
      category: 'consumer_rights',
      preview: 'Under Consumer Protection Act, 2019, you can file a complaint...'
    },
    {
      id: 2,
      question: 'How do I file an FIR if police refuse to register?',
      category: 'criminal_law',
      preview: 'You can file a complaint to SP/Commissioner or approach Magistrate...'
    },
    {
      id: 3,
      question: 'What is my employer required to pay me after termination?',
      category: 'labor_law',
      preview: 'Depending on service period, you are entitled to notice pay, gratuity...'
    },
    {
      id: 4,
      question: 'How do I complain against a builder who delayed possession?',
      category: 'property_law',
      preview: 'Under RERA 2016, you can file a complaint at your state RERA portal...'
    },
    {
      id: 5,
      question: 'What should I do if I am a victim of online fraud?',
      category: 'cyber_law',
      preview: 'Call Cyber Crime Helpline 1930 immediately and file at cybercrime.gov.in...'
    },
    {
      id: 6,
      question: 'Can I get a divorce without mutual consent?',
      category: 'family_law',
      preview: 'Yes, on grounds of cruelty, adultery, desertion etc. under Hindu Marriage Act...'
    }
  ];

  res.json({ success: true, faqs });
});

// GET /api/legal/search - Search legal topics
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query required.' });

    const topics = await LegalTopic.find({
      $text: { $search: q },
      isActive: true
    }).limit(10);

    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed.' });
  }
});

module.exports = router;
