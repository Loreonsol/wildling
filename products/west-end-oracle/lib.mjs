/**
 * west-end-oracle — Oracle booth in West End that answers only with shop names.
 * offline, $0, no secrets. Metaphor / joke only — never opens network or spends cash.
 */

/** West End / Brisbane-ish shop names (the only answers the booth ever gives). */
export const SHOPS = [
  'The Gunshop Café',
  'Archive Bookshop',
  'West End Markets stall #7',
  'Davies Park coffee cart',
  'Boundary Street bakery',
  'Hardgrove Street record shop',
  'Vulture Street thrift loft',
  'Musselmann Road juice hut',
  'Jane Street dumpling window',
  'Orleigh Park picnic kiosk',
  'Montague Road bike shed',
  'Mellon Street plant nursery',
];

/** Booth vibes / stalls where the oracle sits. */
export const BOOTHS = [
  'canvas tent behind the markets',
  'folding table under the fig',
  'cardboard lean-to on Boundary St',
  'stool beside the coffee cart',
  'awning nook near Davies Park',
  'sticky-note shrine on Jane St',
  'ferry-queue whisper booth',
  'twilight stall by Orleigh Park',
];

/** Moods the booth is in when you ask. */
export const MOODS = [
  'smells like flat whites and old paper',
  'slightly damp from afternoon storm',
  'buzzing with market chatter',
  'quiet after the thrift rush',
  'sun-bleached and optimistic',
  'jacaranda-petal soft',
  'bin-chicken adjacent but kind',
  'late-ferry hush',
];

/** Closing lines / soft notes under every consultation. */
export const ORACLE_NOTES = [
  'Joke oracle only — answers are shop names, never advice you should bank on.',
  'Offline, $0, no secrets — leave wallets and API keys at home.',
  'Blank questions default to a soft West End murmur.',
  'If tests fail, rewind to the previous booth whisper.',
  'Metaphor booth only — no paid APIs, no real fortunes sold.',
  'Shop names hold better when the booth is kind.',
  'West End softens every hard question into a storefront.',
  'Exit when the stall flap stops lying about destiny.',
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
 * Sanitize a question hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeQuestion(text) {
  if (text == null || typeof text !== 'string') return 'west end murmur';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'west end murmur';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'west end murmur';
}

/**
 * Infer a shop answer from a hint (deterministic).
 * coffee / cafe / flat white → Gunshop; book / archive / read → Archive;
 * market / stall → Markets; park / davies → Davies Park;
 * bakery / bread / pastry → Boundary bakery; record / vinyl / music → Hardgrove;
 * thrift / vintage / vulture → Vulture thrift; juice / smoothie → Musselmann;
 * dumpling / noodle / jane → Jane dumpling; picnic / orleigh → Orleigh kiosk;
 * bike / cycle / montague → Montague bike; plant / nursery / melon → Mellon nursery;
 * else bank.
 * @param {string} question
 * @param {number} h
 * @returns {string}
 */
export function pickShop(question, h) {
  const lower = question.toLowerCase();
  if (lower.includes('coffee') || lower.includes('cafe') || lower.includes('café') || lower.includes('flat white')) {
    return 'The Gunshop Café';
  }
  if (lower.includes('bakery') || lower.includes('bread') || lower.includes('pastry')) {
    return 'Boundary Street bakery';
  }
  if (lower.includes('book') || lower.includes('archive') || lower.includes('read')) {
    return 'Archive Bookshop';
  }
  if (lower.includes('market') || lower.includes('stall')) {
    return 'West End Markets stall #7';
  }
  if (lower.includes('davies') || (lower.includes('park') && !lower.includes('orleigh'))) {
    return 'Davies Park coffee cart';
  }
  if (lower.includes('record') || lower.includes('vinyl') || lower.includes('music')) {
    return 'Hardgrove Street record shop';
  }
  if (lower.includes('thrift') || lower.includes('vintage') || lower.includes('vulture')) {
    return 'Vulture Street thrift loft';
  }
  if (lower.includes('juice') || lower.includes('smoothie') || lower.includes('musselmann')) {
    return 'Musselmann Road juice hut';
  }
  if (lower.includes('dumpling') || lower.includes('noodle') || lower.includes('jane')) {
    return 'Jane Street dumpling window';
  }
  if (lower.includes('picnic') || lower.includes('orleigh')) {
    return 'Orleigh Park picnic kiosk';
  }
  if (lower.includes('bike') || lower.includes('cycle') || lower.includes('montague')) {
    return 'Montague Road bike shed';
  }
  if (lower.includes('plant') || lower.includes('nursery') || lower.includes('mellon')) {
    return 'Mellon Street plant nursery';
  }
  return SHOPS[h % SHOPS.length];
}

/**
 * Infer a booth vibe from a hint (deterministic).
 * canvas / tent / market → canvas tent; fig / tree → folding table under fig;
 * cardboard / boundary → cardboard lean-to; coffee / cart → stool beside cart;
 * davies / awning → awning nook; sticky / jane → sticky-note shrine;
 * ferry / queue → ferry-queue whisper; twilight / orleigh / dusk → twilight stall;
 * else bank.
 * @param {string} question
 * @param {number} h
 * @returns {string}
 */
export function pickBooth(question, h) {
  const lower = question.toLowerCase();
  if (lower.includes('canvas') || lower.includes('tent') || lower.includes('market')) {
    return 'canvas tent behind the markets';
  }
  if (lower.includes('fig') || lower.includes('tree')) {
    return 'folding table under the fig';
  }
  if (lower.includes('cardboard') || lower.includes('boundary')) {
    return 'cardboard lean-to on Boundary St';
  }
  if (lower.includes('coffee') || lower.includes('cart') || lower.includes('stool')) {
    return 'stool beside the coffee cart';
  }
  if (lower.includes('awning') || lower.includes('davies')) {
    return 'awning nook near Davies Park';
  }
  if (lower.includes('sticky') || lower.includes('jane') || lower.includes('shrine')) {
    return 'sticky-note shrine on Jane St';
  }
  if (lower.includes('ferry') || lower.includes('queue') || lower.includes('whisper')) {
    return 'ferry-queue whisper booth';
  }
  if (lower.includes('twilight') || lower.includes('orleigh') || lower.includes('dusk')) {
    return 'twilight stall by Orleigh Park';
  }
  return BOOTHS[h % BOOTHS.length];
}

/**
 * Infer a booth mood from a hint (deterministic).
 * coffee / flat / paper → flat whites; storm / damp / rain → damp storm;
 * buzz / chatter / market → market chatter; thrift / quiet / hush → thrift hush;
 * sun / optimistic / bleach → sun-bleached; jacaranda / petal → jacaranda;
 * ibis / bin chicken → bin-chicken; ferry / late / night → late-ferry;
 * else bank.
 * @param {string} question
 * @param {number} h
 * @returns {string}
 */
export function pickMood(question, h) {
  const lower = question.toLowerCase();
  if (lower.includes('coffee') || lower.includes('flat white') || lower.includes('paper')) {
    return 'smells like flat whites and old paper';
  }
  if (lower.includes('storm') || lower.includes('damp') || lower.includes('rain')) {
    return 'slightly damp from afternoon storm';
  }
  if (lower.includes('buzz') || lower.includes('chatter') || lower.includes('market')) {
    return 'buzzing with market chatter';
  }
  if (lower.includes('thrift') || lower.includes('quiet') || (lower.includes('hush') && !lower.includes('ferry'))) {
    return 'quiet after the thrift rush';
  }
  if (lower.includes('sun') || lower.includes('optimistic') || lower.includes('bleach')) {
    return 'sun-bleached and optimistic';
  }
  if (lower.includes('jacaranda') || lower.includes('petal')) {
    return 'jacaranda-petal soft';
  }
  if (lower.includes('ibis') || lower.includes('bin chicken') || lower.includes('bin-chicken')) {
    return 'bin-chicken adjacent but kind';
  }
  if (lower.includes('ferry') || lower.includes('late') || lower.includes('night')) {
    return 'late-ferry hush';
  }
  return MOODS[h % MOODS.length];
}

/**
 * Consult the West End oracle booth once (answers only with a shop name).
 * @param {unknown} questionText
 * @param {number} [index=0]
 * @returns {{
 *   question: string,
 *   questionPreview: string,
 *   shop: string,
 *   booth: string,
 *   mood: string,
 *   note: string,
 *   oracleId: string
 * }}
 */
export function consultOracle(questionText, index = 0) {
  const question = sanitizeQuestion(questionText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${question}`);
  const questionPreview = question.length > 56 ? `${question.slice(0, 53)}...` : question;
  const oracleId = `WE-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const shop = pickShop(question, h);
  const booth = pickBooth(question, h);
  const mood = pickMood(question, h);
  const note = ORACLE_NOTES[(h >>> 4) % ORACLE_NOTES.length];

  return {
    question,
    questionPreview,
    shop,
    booth,
    mood,
    note,
    oracleId,
  };
}

/**
 * Consult many questions (order preserved).
 * @param {unknown[]} questions
 * @returns {ReturnType<typeof consultOracle>[]}
 */
export function consultMany(questions) {
  const list = Array.isArray(questions) ? questions : [];
  if (list.length === 0) {
    return [consultOracle('west end murmur', 0)];
  }
  return list.map((q, i) => consultOracle(q, i));
}

/**
 * Pretty-print a multi-question West End oracle report.
 * @param {unknown[]} questions
 * @returns {string}
 */
export function formatOracle(questions) {
  const rows = consultMany(questions);
  const lines = [
    'WEST-END-ORACLE — booth that answers only with shop names (metaphor / joke only)',
    'consult · offline · $0 · no secrets',
    '',
    'oracleId  shop                              question',
    '--------  --------------------------------  --------',
  ];
  for (const r of rows) {
    const shop = r.shop.padEnd(32).slice(0, 32);
    lines.push(`${r.oracleId}  ${shop}  ${r.questionPreview}`);
    lines.push(`  → booth:  ${r.booth}`);
    lines.push(`  → mood:   ${r.mood}`);
    lines.push(`  → answer: ${r.shop}`);
    lines.push(`  → note:   ${r.note}`);
    lines.push('');
  }
  lines.push('Joke oracle only — never opens network or spends cash.');
  return lines.join('\n').trimEnd() + '\n';
}
