const mongoose = require('mongoose');

const legalTopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'consumer_rights',
      'property_law',
      'labor_law',
      'cyber_law',
      'constitutional_rights',
      'criminal_law',
      'family_law',
      'tax_law',
      'corporate_law'
    ]
  },
  description: {
    type: String,
    required: true
  },
  lawReference: {
    type: String,
    required: true
  },
  keyPoints: [{
    type: String
  }],
  relatedTopics: [{
    type: String
  }],
  keywords: [{
    type: String,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
legalTopicSchema.index({ keywords: 1, category: 1 });
legalTopicSchema.index({ topic: 'text', description: 'text', keywords: 'text' });

module.exports = mongoose.model('LegalTopic', legalTopicSchema);
