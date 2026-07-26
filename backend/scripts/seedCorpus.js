/**
 * One-time (re-runnable) script that embeds every chunk in data/legalCorpus.js
 * and upserts it into the LegalChunk collection for RAG retrieval.
 * Run: node scripts/seedCorpus.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const legalCorpus = require('../data/legalCorpus');
const LegalChunk = require('../models/LegalChunk');
const { embedText } = require('../services/embeddings');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/law_advisor';

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected');

  console.log(`Embedding ${legalCorpus.length} legal chunks (first run downloads the ~90MB model — may take a minute)...`);

  let count = 0;
  for (const chunk of legalCorpus) {
    const embedding = await embedText(`${chunk.act} ${chunk.section}: ${chunk.text}`);

    await LegalChunk.findOneAndUpdate(
      { chunkId: chunk.id },
      {
        chunkId: chunk.id,
        category: chunk.category,
        act: chunk.act,
        section: chunk.section,
        text: chunk.text,
        embedding
      },
      { upsert: true, new: true }
    );

    count++;
    console.log(`  [${count}/${legalCorpus.length}] ${chunk.act} — ${chunk.section}`);
  }

  console.log(`✅ Seeded ${count} legal chunks with embeddings.`);
  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
