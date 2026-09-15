/**
 * lullaby-compiler — turns source code into lullabies without executing it.
 * offline, $0, no secrets. Pure local string helpers (no network, no eval).
 */

/** Fixed map from common code tokens → gentle syllables / phrases. */
const LULLABY_MAP = {
  function: 'softly',
  const: 'quietly',
  let: 'gently',
  var: 'hush',
  return: 'rest',
  if: 'if-you-please',
  else: 'elsewise',
  for: 'for-a-while',
  while: 'awhile',
  class: 'cradle',
  import: 'welcome',
  export: 'farewell',
  default: 'default-dream',
  async: 'drifting',
  await: 'waiting',
  true: 'yes-dear',
  false: 'not-tonight',
  null: 'nothing-at-all',
  undefined: 'somewhere-far',
  new: 'newborn',
  this: 'this-soft',
  try: 'try-to-sleep',
  catch: 'catch-a-star',
  throw: 'toss-a-pillow',
  error: 'a-soft-sigh',
  console: 'whisper',
  log: 'murmur',
  string: 'song',
  number: 'counting',
  boolean: 'yes-or-no',
  object: 'bundle',
  array: 'row-of-sheep',
  promise: 'someday',
  void: 'quiet-void',
  type: 'kind',
  interface: 'between-us',
  public: 'open-arms',
  private: 'secret-soft',
  static: 'still',
};

/** Soft fallback word list — hashed token picks one stably. */
const FALLBACK_WORDS = [
  'la',
  'loo',
  'mmm',
  'doo',
  'hum',
  'soft',
  'moon',
  'star',
  'cloud',
  'sheep',
  'pillow',
  'blanket',
  'whisper',
  'cradle',
  'dream',
  'night',
  'lull',
  'breeze',
  'ember',
  'petal',
  'ripple',
  'shadow',
  'velvet',
  'silver',
  'quiet',
  'sleepy',
  'drowsy',
  'gentle',
  'tender',
  'hushaby',
];

/**
 * Stable non-crypto hash of a string → non-negative int.
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
 * Extract identifiers/keywords roughly (alphanumeric tokens, drop empties).
 * Never executes code — string scan only.
 * @param {string} code
 * @returns {string[]}
 */
export function tokenizeSource(code) {
  if (code == null || typeof code !== 'string') return [];
  const raw = code.match(/[A-Za-z_][A-Za-z0-9_]*/g);
  if (!raw) return [];
  return raw.filter((t) => t.length > 0);
}

/**
 * Map tokens to gentle syllables/phrases via fixed map + soft hash fallback.
 * @param {string[]} tokens
 * @returns {string[]}
 */
export function toLullabySyllables(tokens) {
  if (!Array.isArray(tokens)) return [];
  return tokens.map((tok) => {
    if (tok == null || typeof tok !== 'string' || tok.length === 0) {
      return 'mmm';
    }
    const key = tok.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(LULLABY_MAP, key)) {
      return LULLABY_MAP[key];
    }
    const idx = softHash(key) % FALLBACK_WORDS.length;
    return FALLBACK_WORDS[idx];
  });
}

/**
 * Compile source text into a multi-line lullaby string (no execution).
 * @param {string} code
 * @returns {string}
 */
export function compileToLullaby(code) {
  const tokens = tokenizeSource(code);
  if (tokens.length === 0) {
    return 'mmm… nothing but quiet tonight.';
  }
  const syllables = toLullabySyllables(tokens);
  const lines = [];
  const chunk = 4;
  for (let i = 0; i < syllables.length; i += chunk) {
    const slice = syllables.slice(i, i + chunk);
    lines.push(slice.join(' · '));
  }
  return lines.join('\n');
}

/**
 * Human-readable report with title + lullaby body.
 * @param {string} code
 * @returns {string}
 */
export function formatLullabyReport(code) {
  const body = compileToLullaby(code);
  const tokenCount =
    code == null || typeof code !== 'string'
      ? 0
      : tokenizeSource(code).length;
  const lines = [
    'lullaby-compiler — source into song (never executed)',
    '',
    `Tokens hummed: ${tokenCount}`,
    '',
    '✦ Lullaby',
    body,
    '',
    '… sleep well, little program.',
  ];
  return lines.join('\n');
}

export { LULLABY_MAP, FALLBACK_WORDS };
