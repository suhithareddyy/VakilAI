const mongoose = require('mongoose');

const legalChunkSchema = new mongoose.Schema({
  chunkId: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  act: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LegalChunk', legalChunkSchema);
