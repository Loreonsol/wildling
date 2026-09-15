/**
 * postage-spell — ritual for mailing a letter that arrives before it was written.
 * offline, $0, no secrets. Pure local string helpers (never mails anything).
 */

/** Fictional stamp faces. */
export const STAMPS = [
  'Tide-Wax Seal',
  'Moss Crest',
  'Lantern Postmark',
  'Bin Chicken Air Mail',
  'Quiet Quill',
  'Fig-Leaf Frank',
  'Harbour Whisper',
  'Sandgate Low-Tide',
];

/** Imaginary routes the letter "takes". */
export const ROUTES = [
  'porch → yesterday → pocket',
  'inkwell → tidepool → before-coffee',
  'sticky-note labyrinth → Null Island',
  'drawer of drafts → Port of Lost Socks',
  'coat pocket → constellation → porch',
  'valley of tabs → Sandgate jetty',
  'unclosed parentheses → morning light',
  'soft parcel depot → almost',
];

/** Carrier muses (never real postal services). */
export const CARRIER_MUSES = [
  'SoftParcel Muse',
  'MossFreight Spirit',
  'TideCourier Shade',
  'LanternPost Wisp',
  'QuietExpress Owl',
  'FigTree Logistics Dryad',
  'Harbour Whisper Co',
  'Bin Chicken Air',
];

/** Short ritual lines / incantations. */
export const INCANTATIONS = [
  'Seal the ink; unwrite the clock.',
  'Arrive first; write second; smile third.',
  'Fold once for yesterday, twice for kindness.',
  'The stamp drinks tomorrow so the letter can rest.',
  'Post into the tide; collect from the porch of almost.',
  'Whisper the address backwards; the muse will reverse time.',
  'A soft hash is enough postage for metaphor.',
  'Leave the envelope open so the past can slip in.',
  'Green tests are a kind of postmark.',
  'Never mail; only imagine the knock that came early.',
  'The letter that arrives early forgives the one still unwritten.',
  'Wax cools; the future already read it.',
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
 * Sanitize letter text into a short display string.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeLetter(text) {
  if (text == null || typeof text !== 'string') return 'a letter to tomorrow';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'a letter to tomorrow';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 160) || 'a letter to tomorrow';
}

/**
 * Format a deterministic ISO-ish timestamp from hash + offset hours.
 * Epoch base chosen so values look like mid-2026 ritual dates.
 * @param {number} h
 * @param {number} hourOffset
 * @returns {string}
 */
function ritualTimestamp(h, hourOffset) {
  // Fixed epoch: 2026-06-15T12:00:00.000Z = 1781524800000
  const base = 1781524800000;
  const dayMs = ((h % 40) - 20) * 86400000;
  const minuteMs = ((h >>> 8) % 1440) * 60000;
  const ms = base + dayMs + minuteMs + hourOffset * 3600000;
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Compose ritual fields from letter text (deterministic).
 * Arrival is always before posted — the joke of the spell.
 * @param {unknown} letter
 * @returns {{
 *   letter: string,
 *   preview: string,
 *   stamp: string,
 *   route: string,
 *   carrier: string,
 *   incantation: string,
 *   posted: string,
 *   arrival: string
 * }}
 */
export function composeSpell(letter) {
  const sanitized = sanitizeLetter(letter);
  const h = softHash(sanitized);
  const posted = ritualTimestamp(h, 0);
  // Arrive 3–27 hours earlier than posted (always before)
  const hoursBefore = 3 + (h % 25);
  const arrival = ritualTimestamp(h, -hoursBefore);
  const preview =
    sanitized.length > 72 ? `${sanitized.slice(0, 69)}...` : sanitized;
  return {
    letter: sanitized,
    preview,
    stamp: STAMPS[h % STAMPS.length],
    route: ROUTES[(h >>> 4) % ROUTES.length],
    carrier: CARRIER_MUSES[(h >>> 8) % CARRIER_MUSES.length],
    incantation: INCANTATIONS[(h >>> 12) % INCANTATIONS.length],
    posted,
    arrival,
  };
}

/**
 * Format a printable postage-spell ritual slip.
 * @param {unknown} letter
 * @returns {string}
 */
export function formatPostageSpell(letter) {
  const spell = composeSpell(letter);
  const width = 48;
  const line = '-'.repeat(width);
  const box = (s) => {
    const t = String(s).slice(0, width - 4);
    return `| ${t}${' '.repeat(Math.max(0, width - 4 - t.length))} |`;
  };
  return [
    `+${line}+`,
    box('POSTAGE SPELL'),
    box('Ritual: letter arrives before it was written'),
    box(''),
    box(`LETTER: ${spell.preview}`),
    box(`STAMP:  ${spell.stamp}`),
    box(`ROUTE:  ${spell.route}`),
    box(`MUSE:   ${spell.carrier}`),
    box(''),
    box(`ARRIVAL: ${spell.arrival}`),
    box(`POSTED:  ${spell.posted}`),
    box('(arrival is before posted — as designed)'),
    box(''),
    box(`INCANTATION: ${spell.incantation}`),
    `+${line}+`,
    '(Metaphor only — never mails anything. Offline, $0, no secrets.)',
  ].join('\n');
}
