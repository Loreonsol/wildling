/**
 * cardboard-oracle — fortune-telling deck made of shipping labels.
 * offline, $0, no secrets. Pure local string helpers (no network).
 */

/** Carrier / stamp flavours printed on the label. */
export const CARRIERS = [
  'SoftParcel',
  'MossFreight',
  'TideCourier',
  'LanternPost',
  'QuietExpress',
  'FigTree Logistics',
  'Harbour Whisper Co',
  'Bin Chicken Air',
];

/** Destination moods (where the parcel "arrives"). */
export const DESTINATIONS = [
  'the porch of almost',
  'a drawer of unfinished drafts',
  'Null Island cafe counter',
  'Sandgate at low tide',
  'the valley of unclosed tabs',
  'a sticky-note labyrinth',
  'the Port of Lost Socks',
  'tomorrow morning before coffee',
];

/** Handling marks stamped on the cardboard. */
export const HANDLING = [
  'FRAGILE: ideas',
  'THIS SIDE UP: hope',
  'DO NOT BEND: soft plans',
  'KEEP DRY: jokes',
  'PERISHABLE: courage',
  'OPEN WITH CARE: secrets you forgot',
  'PRIORITY: kindness',
  'HOLD AT DEPOT: until you are ready',
];

/** Short fortunes written on the label's blank face. */
export const ORACLES = [
  'The next commit will feel lighter than this one.',
  'A small reversible change is already a voyage.',
  'Leave one breadcrumb; the next wake will find it.',
  'Boredom is a bug — rotate the deck.',
  'Ship the tiny thing before the grand myth.',
  'Green tests are a kind of weather.',
  'The parcel you need is already in your pocket.',
  'Ask again after one glass of water.',
  'A quiet folder is still a destination.',
  'Surprise yourself, then leave a trail.',
  'The label outlives the box; write kindly.',
  'Tide goes out; unfinished drafts stay.',
];

/**
 * Stable non-crypto hash → non-negative int.
 * @param {string} s
 * @returns {number}
 */
function softHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Sanitize a question into a short display string.
 * @param {unknown} question
 * @returns {string}
 */
export function sanitizeQuestion(question) {
  if (question == null || typeof question !== 'string') return 'what next?';
  const trimmed = question.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'what next?';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 120) || 'what next?';
}

/**
 * Tracking-ish id from the question (looks like a shipping barcode).
 * @param {string} q
 * @returns {string}
 */
export function trackingId(q) {
  const h = softHash(sanitizeQuestion(q));
  const a = (h % 9000) + 1000;
  const b = ((h >>> 8) % 9000) + 1000;
  const c = ((h >>> 16) % 90) + 10;
  return `CB-${a}-${b}-${c}`;
}

/**
 * Draw one cardboard shipping-label card from a question.
 * @param {unknown} question
 * @returns {{ question: string, tracking: string, carrier: string, destination: string, handling: string, oracle: string }}
 */
export function drawLabel(question) {
  const q = sanitizeQuestion(question);
  const h = softHash(q);
  return {
    question: q,
    tracking: trackingId(q),
    carrier: CARRIERS[h % CARRIERS.length],
    destination: DESTINATIONS[(h >>> 4) % DESTINATIONS.length],
    handling: HANDLING[(h >>> 8) % HANDLING.length],
    oracle: ORACLES[(h >>> 12) % ORACLES.length],
  };
}

/**
 * Format a drawn label as a printable shipping slip.
 * @param {unknown} question
 * @returns {string}
 */
export function formatOracleSlip(question) {
  const card = drawLabel(question);
  const width = 44;
  const line = '-'.repeat(width);
  const box = (s) => {
    const t = String(s).slice(0, width - 4);
    return `| ${t}${' '.repeat(Math.max(0, width - 4 - t.length))} |`;
  };
  return [
    `+${line}+`,
    box('CARDBOARD ORACLE — shipping label deck'),
    box(`TRACKING: ${card.tracking}`),
    box(`CARRIER:  ${card.carrier}`),
    box(`TO:       ${card.destination}`),
    box(`MARK:     ${card.handling}`),
    box(''),
    box(`Q: ${card.question}`),
    box(''),
    box(card.oracle),
    `+${line}+`,
    '(Metaphor only — no parcels, no network, $0.)',
  ].join('\n');
}
