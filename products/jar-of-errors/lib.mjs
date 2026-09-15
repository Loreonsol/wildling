/**
 * jar-of-errors — safely stores cute error messages in a metaphorical jar.
 * offline, $0, no secrets. Pure local string helpers (no network, no eval).
 */

/** Harsh → cute word swaps (case-insensitive whole-word-ish). */
const SOFTEN_MAP = {
  fatal: 'fussy',
  error: 'oopsie',
  fail: 'stumble',
  failed: 'stumbled',
  failure: 'soft stumble',
  crash: 'tumble',
  crashed: 'tumbled',
  panic: 'flutter',
  panicled: 'fluttered',
  exception: 'surprise',
  critical: 'extra-careful',
  severe: 'a bit loud',
  abort: 'pause kindly',
  aborted: 'paused kindly',
  kill: 'tuck in',
  killed: 'tucked in',
  die: 'rest',
  died: 'rested',
  dead: 'asleep',
  timeout: 'took a nap',
  timedout: 'took a nap',
  overflow: 'too-full hug',
  underflow: 'almost-empty hug',
  segfault: 'gentle bump',
  null: 'nothing-at-all',
  undefined: 'somewhere-far',
  invalid: 'a tad shy',
  illegal: 'not-quite-right',
  forbidden: 'ask-nicely',
  unauthorized: 'need-a-hello',
  corrupt: 'scrambled',
  broken: 'a little bent',
  bug: 'critter',
  bugs: 'critters',
};

/** Soft fallback adjectives for jar sealing. */
const SEAL_WORDS = [
  'velvet',
  'mossy',
  'lavender',
  'biscuit',
  'moonlit',
  'gentle',
  'quilted',
  'amber',
  'cotton',
  'pebble',
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
 * Soften a harsh error message into a cute one (string replace only).
 * @param {string} raw
 * @returns {string}
 */
export function softenMessage(raw) {
  if (raw == null || typeof raw !== 'string') return '(empty hush)';
  const trimmed = raw.trim();
  if (trimmed.length === 0) return '(empty hush)';

  return trimmed.replace(/[A-Za-z_][A-Za-z0-9_]*/g, (tok) => {
    const key = tok.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(SOFTEN_MAP, key)) {
      const cute = SOFTEN_MAP[key];
      // Preserve rough casing: ALLCAPS / Title / lower
      if (tok === tok.toUpperCase() && tok.length > 1) {
        return cute.toUpperCase();
      }
      if (tok[0] === tok[0].toUpperCase()) {
        return cute.charAt(0).toUpperCase() + cute.slice(1);
      }
      return cute;
    }
    return tok;
  });
}

/**
 * Build a sealed jar entry from a raw error string.
 * @param {string} raw
 * @param {{ now?: string }} [opts]
 * @returns {{ id: string, original: string, cute: string, sealedAt: string }}
 */
export function sealError(raw, opts = {}) {
  const original =
    raw == null || typeof raw !== 'string' ? '' : String(raw);
  const cute = softenMessage(original);
  const sealedAt =
    typeof opts.now === 'string' && opts.now.length > 0
      ? opts.now
      : new Date().toISOString();
  const seal = SEAL_WORDS[softHash(cute || 'empty') % SEAL_WORDS.length];
  const id = `jar-${seal}-${(softHash(original + cute) % 10000)
    .toString()
    .padStart(4, '0')}`;
  return { id, original, cute, sealedAt };
}

/**
 * Seal many messages into jar entries (order preserved).
 * @param {string[]} messages
 * @param {{ now?: string }} [opts]
 * @returns {ReturnType<typeof sealError>[]}
 */
export function sealMany(messages, opts = {}) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m != null && typeof m === 'string')
    .map((m) => sealError(m, opts));
}

/**
 * Static jar label + care instructions.
 * @returns {string}
 */
export function formatJarLabel() {
  return [
    '✦ JAR OF ERRORS ✦',
    'Keep lid on. Store in a cool, kind place.',
    'Contents: softened oopsies only — never rethrown.',
    'Care: shake gently; read aloud; forgive liberally.',
  ].join('\n');
}

/**
 * Full human-readable report: label + sealed cute messages.
 * @param {string[]} messages
 * @param {{ now?: string }} [opts]
 * @returns {string}
 */
export function formatJarReport(messages, opts = {}) {
  const entries = sealMany(messages, opts);
  const lines = [
    formatJarLabel(),
    '',
    `Sealed count: ${entries.length}`,
    '',
  ];
  if (entries.length === 0) {
    lines.push('(jar is empty — nothing to forgive today)');
  } else {
    lines.push('✦ Inside the jar');
    for (const e of entries) {
      lines.push(`  [${e.id}]`);
      lines.push(`    was: ${e.original || '(blank)'}`);
      lines.push(`    now: ${e.cute}`);
      lines.push(`    at:  ${e.sealedAt}`);
    }
  }
  lines.push('', '… lid sealed. Stay soft.');
  return lines.join('\n');
}

export { SOFTEN_MAP, SEAL_WORDS };
