/**
 * kindness-benchmark — score how kind a function/identifier name feels.
 * Offline, $0, no secrets. Pure string heuristics (not ML).
 */

const KIND = [
  'soft', 'gentle', 'help', 'care', 'hug', 'kind', 'mercy', 'peace', 'calm',
  'warm', 'welcome', 'thank', 'please', 'safe', 'heal', 'hold', 'gift',
  'friend', 'love', 'grace', 'ease', 'soothe', 'comfort', 'bless', 'hope',
  'quiet', 'tender', 'nurture', 'invite', 'share', 'listen', 'mend', 'spare',
];

const HARSH = [
  'kill', 'force', 'destroy', 'crash', 'panic', 'die', 'murder', 'nuke',
  'smash', 'hate', 'punish', 'slash', 'burn', 'crush', 'obliterate', 'wreck',
  'stomp', 'rage', 'abuse', 'brutal', 'violent', 'annihilate',
];

/** True when token equals word, or starts/ends with word (len≥4) as a stem. */
function tokenHits(token, word) {
  if (token === word) return true;
  if (word.length >= 4 && (token.startsWith(word) || token.endsWith(word))) {
    return true;
  }
  if (token.length >= 4 && word.startsWith(token)) return true;
  return false;
}

/** Split camelCase / snake_case / kebab-case into lowercase tokens. */
export function tokenize(name) {
  if (typeof name !== 'string' || !name.trim()) return [];
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-./]+/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Score an identifier for perceived kindness.
 * @returns {{ score: number, band: string, tokens: string[], hits: { kind: string[], harsh: string[] }, tip: string }}
 */
export function scoreName(name) {
  const tokens = tokenize(name);
  const hits = { kind: [], harsh: [] };

  for (const t of tokens) {
    for (const k of KIND) {
      if (tokenHits(t, k) && !hits.kind.includes(k)) hits.kind.push(k);
    }
    for (const h of HARSH) {
      if (tokenHits(t, h) && !hits.harsh.includes(h)) hits.harsh.push(h);
    }
  }

  // Base 50; +12 per kind hit, -15 per harsh; clamp 0–100
  let score = 50 + hits.kind.length * 12 - hits.harsh.length * 15;
  if (tokens.length === 0) score = 0;
  score = Math.max(0, Math.min(100, score));

  let band;
  if (score >= 80) band = 'warm hug';
  else if (score >= 60) band = 'kind enough';
  else if (score >= 40) band = 'neutral';
  else if (score >= 20) band = 'a bit sharp';
  else band = 'needs a soft rename';

  let tip;
  if (hits.harsh.length && !hits.kind.length) {
    tip = `Try swapping harsh bits (${hits.harsh.join(', ')}) for softer verbs like ease, mend, or spare.`;
  } else if (hits.kind.length && !hits.harsh.length) {
    tip = 'Already gentle — keep shipping kindness.';
  } else if (hits.kind.length && hits.harsh.length) {
    tip = 'Mixed signals — lead with the kind verb, bury the harsh noun.';
  } else {
    tip = 'No kindness markers yet — a soft/help/care token can lift the score.';
  }

  return { score, band, tokens, hits, tip };
}

export function formatReport(name, result) {
  const lines = [
    `kindness-benchmark: ${JSON.stringify(name)}`,
    `  score: ${result.score}/100 (${result.band})`,
    `  tokens: ${result.tokens.join(' · ') || '(none)'}`,
    `  kind hits: ${result.hits.kind.join(', ') || '—'}`,
    `  harsh hits: ${result.hits.harsh.join(', ') || '—'}`,
    `  tip: ${result.tip}`,
  ];
  return lines.join('\n');
}
