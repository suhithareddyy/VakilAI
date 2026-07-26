/**
 * Local, free text embeddings via @xenova/transformers (runs in Node via WASM,
 * no API key/cost). The package ships as ESM-only, so it's loaded with a
 * dynamic import() from this CommonJS module and cached after first load
 * (the ~90MB model downloads once and is cached on disk after that).
 */

let embedderPromise = null;

function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = (async () => {
      const { pipeline } = await import('@xenova/transformers');
      return pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    })();
  }
  return embedderPromise;
}

async function embedText(text) {
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

module.exports = { embedText };
