/**
 * regex-familiar — familiar spirit that takes the form of a friendly regular expression.
 * offline, $0, no secrets. Pure local string helpers (never executes regex against real data).
 */

/** Familiar names (spirits of pattern). */
export const FAMILIAR_NAMES = [
  'Caret Whisper',
  'Dot-Star Moth',
  'Lookahead Lynx',
  'Capture Fox',
  'Anchor Otter',
  'Quantifier Quokka',
  'Escape Hatch Wren',
  'Non-Capturing Newt',
];

/** Soft, decorative pattern shapes (metaphor only — not for production matching). */
export const PATTERN_SHAPES = [
  '/^kind(ness)?$/i',
  '/\\bsoft[_-]?assert\\b/',
  '/(?<=\\s)courage(?=\\s|$)/',
  '/^[A-Z][a-z]+(?:\\s[A-Z][a-z]+)*$/',
  '/(?:todo|fixme|later)(?!:)/i',
  '/^[^\\n]{0,72}$/m',
  '/(?<!\\w)green[_-]?test(?!\\w)/i',
  '/\\A(?:hello|hi)\\s+world\\z/i',
];

/** Dispositions / moods of the familiar. */
export const DISPOSITIONS = [
  'patient with messy whitespace',
  'allergic to catastrophic backtracking',
  'fond of named capture groups',
  'quietly refuses to match malice',
  'hums when anchors align',
  'naps between reluctant quantifiers',
  'cheers for green tests only',
  'gentle with Unicode and humans alike',
];

/** Binding tips / ritual lines. */
export const BINDINGS = [
  'Offer a failing test; the familiar learns the boundary.',
  'Name your groups; unnamed spirits wander.',
  'Prefer \\b over hope when word edges matter.',
  'Escape the literal; let the muse handle the magic.',
  'Start with ^ and end with $ when the whole line must answer.',
  'Non-greedy first; greed is a trap for moths.',
  'Comment the intent; the pattern is only the costume.',
  'Never feed secrets to a familiar — metaphors only.',
];

/** Short prophecies about what will "match". */
export const PROPHECIES = [
  'It will match courage disguised as a commit message.',
  'It will find the soft edge between draft and done.',
  'It will refuse spam and accept sincerity.',
  'It will catch trailing spaces before they bite.',
  'It will recognize kindness even when misspelled once.',
  'It will skip the sawtooth charts of bots.',
  'It will light up when the lantern of intent is clear.',
  'It will leave the porch plants and packages alone.',
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
 * Sanitize intent / wish into a short display string.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeIntent(text) {
  if (text == null || typeof text !== 'string') return 'a pattern of kindness';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'a pattern of kindness';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 160) || 'a pattern of kindness';
}

/**
 * Summon a deterministic familiar from intent text.
 * @param {unknown} intent
 * @returns {{
 *   intent: string,
 *   preview: string,
 *   name: string,
 *   pattern: string,
 *   disposition: string,
 *   binding: string,
 *   prophecy: string,
 *   sigil: string
 * }}
 */
export function summonFamiliar(intent) {
  const sanitized = sanitizeIntent(intent);
  const h = softHash(sanitized);
  const preview =
    sanitized.length > 72 ? `${sanitized.slice(0, 69)}...` : sanitized;
  const sigil = `RF-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  return {
    intent: sanitized,
    preview,
    name: FAMILIAR_NAMES[h % FAMILIAR_NAMES.length],
    pattern: PATTERN_SHAPES[(h >>> 4) % PATTERN_SHAPES.length],
    disposition: DISPOSITIONS[(h >>> 8) % DISPOSITIONS.length],
    binding: BINDINGS[(h >>> 12) % BINDINGS.length],
    prophecy: PROPHECIES[(h >>> 16) % PROPHECIES.length],
    sigil,
  };
}

/**
 * Format a printable familiar summoning card.
 * @param {unknown} intent
 * @returns {string}
 */
export function formatFamiliar(intent) {
  const f = summonFamiliar(intent);
  const width = 52;
  const line = '-'.repeat(width);
  const box = (s) => {
    const t = String(s).slice(0, width - 4);
    return `| ${t}${' '.repeat(Math.max(0, width - 4 - t.length))} |`;
  };
  return [
    `+${line}+`,
    box('REGEX FAMILIAR'),
    box('Spirit that wears a friendly regular expression'),
    box(''),
    box(`INTENT:  ${f.preview}`),
    box(`NAME:    ${f.name}`),
    box(`SIGIL:   ${f.sigil}`),
    box(`PATTERN: ${f.pattern}`),
    box(`MOOD:    ${f.disposition}`),
    box(''),
    box(`BINDING: ${f.binding}`),
    box(`ORACLE:  ${f.prophecy}`),
    `+${line}+`,
    '(Metaphor only — never matches real data. Offline, $0, no secrets.)',
  ].join('\n');
}
