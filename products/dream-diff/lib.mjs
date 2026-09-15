/**
 * dream-diff — diffs two dream texts and highlights shared symbols.
 * offline, $0, no secrets. Pure local string helpers (no network).
 */

/** Common filler words skipped when extracting symbols. */
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'were', 'be', 'been',
  'being', 'are', 'am', 'it', 'its', 'this', 'that', 'these', 'those',
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'they',
  'them', 'his', 'her', 'their', 'there', 'here', 'then', 'than',
  'so', 'if', 'when', 'while', 'into', 'over', 'under', 'about',
  'up', 'out', 'off', 'down', 'just', 'not', 'no', 'yes', 'do', 'did',
  'does', 'had', 'have', 'has', 'will', 'would', 'could', 'should',
  'can', 'may', 'might', 'must', 'very', 'too', 'also', 'all', 'any',
  'some', 'such', 'only', 'own', 'same', 'other', 'each', 'few',
  'more', 'most', 'what', 'which', 'who', 'whom', 'how', 'where',
  'why', 'because', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'both', 'either', 'neither', 'nor', 'once',
]);

/**
 * Tokenize dream text into meaningful lowercase symbols (words).
 * Keeps alphabetic tokens (incl. hyphen/apostrophe internals), drops stopwords & short noise.
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  if (text == null || typeof text !== 'string') return [];
  const raw = text
    .toLowerCase()
    .match(/[a-z][a-z'-]*[a-z]|[a-z]/g);
  if (!raw) return [];
  const seen = new Set();
  const out = [];
  for (const tok of raw) {
    const t = tok.replace(/^'+|'+$/g, '');
    if (t.length < 2) continue;
    if (STOPWORDS.has(t)) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

/**
 * Find shared vs unique symbols between two dream strings.
 * @param {string} dreamA
 * @param {string} dreamB
 * @returns {{ shared: string[], onlyA: string[], onlyB: string[], symbolsA: string[], symbolsB: string[] }}
 */
export function findSharedSymbols(dreamA, dreamB) {
  const symbolsA = tokenize(dreamA);
  const symbolsB = tokenize(dreamB);
  const setB = new Set(symbolsB);
  const setA = new Set(symbolsA);
  const shared = symbolsA.filter((s) => setB.has(s));
  const onlyA = symbolsA.filter((s) => !setB.has(s));
  const onlyB = symbolsB.filter((s) => !setA.has(s));
  return { shared, onlyA, onlyB, symbolsA, symbolsB };
}

/**
 * Format a human-readable dream-diff report.
 * @param {string} dreamA
 * @param {string} dreamB
 * @returns {string}
 */
export function formatDreamDiff(dreamA, dreamB) {
  const { shared, onlyA, onlyB, symbolsA, symbolsB } = findSharedSymbols(
    dreamA,
    dreamB,
  );
  const list = (arr) => (arr.length ? arr.join(', ') : '(none)');
  const lines = [
    'dream-diff — shared symbols between two dreams',
    '',
    `Dream A symbols (${symbolsA.length}): ${list(symbolsA)}`,
    `Dream B symbols (${symbolsB.length}): ${list(symbolsB)}`,
    '',
    `✦ Shared (${shared.length}): ${list(shared)}`,
    `→ Only in A (${onlyA.length}): ${list(onlyA)}`,
    `→ Only in B (${onlyB.length}): ${list(onlyB)}`,
  ];
  return lines.join('\n');
}

export { STOPWORDS };
