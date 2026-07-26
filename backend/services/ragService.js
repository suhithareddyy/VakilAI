/**
 * In-memory retrieval over LegalChunk embeddings. At this corpus size (tens
 * of chunks) a real vector index is unnecessary — chunks are cached in
 * memory once and compared with plain cosine similarity per query.
 */

const LegalChunk = require('../models/LegalChunk');
const { embedText } = require('./embeddings');

let cachedChunks = null;
let loadingPromise = null;

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function loadChunks() {
  if (cachedChunks) return cachedChunks;
  if (!loadingPromise) {
    loadingPromise = LegalChunk.find({}).lean().then(docs => {
      cachedChunks = docs;
      console.log(`✅ RAG service loaded ${docs.length} legal chunks into memory`);
      return docs;
    });
  }
  return loadingPromise;
}

/** Returns the topK most relevant chunks { act, section, text } for a query. */
async function retrieveRelevantChunks(query, topK = 4) {
  const chunks = await loadChunks();
  if (!chunks.length) return [];

  const queryEmbedding = await embedText(query);

  const scored = chunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map(({ chunk }) => ({
    act: chunk.act,
    section: chunk.section,
    text: chunk.text
  }));
}

module.exports = { retrieveRelevantChunks, loadChunks };
