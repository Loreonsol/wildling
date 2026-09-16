/**
 * sandgate-siren — a siren who sings only at Sandgate at low tide.
 * offline, $0, no secrets. Metaphor only — never opens network or fetches real tides.
 */

/** Songs she may sing when the tide is low enough. */
export const SONGS = [
  'lullaby of mudflat snails',
  'hymn for the last ferry home',
  'ballad of Sandgate baths at dusk',
  'chant of exposed oyster racks',
  'aria for the Moreton breeze',
  'soft chorus of pelican wings',
  'whisper-song of wet sand prints',
  'refrain of the quiet jetty boards',
];

/** Songs / lines when she waits — silent until low tide. */
export const WAIT_SONGS = [
  'she waits — silent until low tide',
  'voice held under high water',
  'humming only to herself until the mud shows',
  'listening, not singing, while the flood holds',
  'tide too proud; she keeps the melody pocketed',
  'silent vigil on the pier until ebb',
  'mouth closed; the bay is still too full',
  'she saves the song for Sandgate at low tide',
];

/** Tide labels (metaphor). */
export const TIDES = [
  'low water at Sandgate',
  'neap hush on the flats',
  'ebb toward the mudline',
  'slack before the pull',
  'rising metaphor',
  'high kindness over the baths',
  'flood of curiosity',
  'spring of tiny commits',
];

/** Low-tide-ish labels used when place hints force low/neap/ebb. */
const LOW_TIDE_LABELS = [
  'low water at Sandgate',
  'neap hush on the flats',
  'ebb toward the mudline',
];

/** High-tide-ish labels used when place hints force high/flood. */
const HIGH_TIDE_LABELS = [
  'high kindness over the baths',
  'flood of curiosity',
];

/** Shore textures for the report. */
export const SHORES = [
  'mudflat shelf',
  'barnacled jetty leg',
  'wet sand crescent',
  'oyster-rack alley',
  'baths seawall',
  'mangrove fringe',
  'pebble spit',
  'quiet boat ramp',
];

/** Soft notes printed under every report. */
export const SIREN_NOTES = [
  'She sings only at Sandgate at low tide — elsewhere she waits.',
  'Do not fetch real tides; the siren prefers $0 moonlight.',
  'Offline only — the bay already knows the schedule.',
  'Never commit private keys into the mudflats.',
  'If tests fail, she falls silent until the next green wake.',
  'High water is for listening, not performing.',
  'Sandgate is the default stage when the place is blank.',
  'Metaphor only — no ships are steered by this song.',
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
 * Sanitize a place hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizePlace(text) {
  if (text == null || typeof text !== 'string') return 'Sandgate';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'Sandgate';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'Sandgate';
}

/**
 * Infer a tide label from a place hint (deterministic).
 * low / neap / ebb → low-tide labels; high / flood → high; else TIDES[h%].
 * @param {string} place
 * @param {number} h
 * @returns {string}
 */
export function pickTide(place, h) {
  const lower = place.toLowerCase();
  if (
    lower.includes('low') ||
    lower.includes('neap') ||
    lower.includes('ebb')
  ) {
    return LOW_TIDE_LABELS[h % LOW_TIDE_LABELS.length];
  }
  if (lower.includes('high') || lower.includes('flood')) {
    return HIGH_TIDE_LABELS[h % HIGH_TIDE_LABELS.length];
  }
  return TIDES[h % TIDES.length];
}

/**
 * Whether a tide label is low-tide-ish (she may sing).
 * @param {string} tide
 * @returns {boolean}
 */
function isLowTideIsh(tide) {
  const t = tide.toLowerCase();
  return (
    t.includes('low') ||
    t.includes('neap') ||
    t.includes('ebb') ||
    t.includes('mud')
  );
}

/**
 * Sing one siren report for a place.
 * @param {unknown} placeText
 * @param {number} [index=0]
 * @returns {{
 *   place: string,
 *   placePreview: string,
 *   tide: string,
 *   song: string,
 *   shore: string,
 *   note: string,
 *   sings: boolean,
 *   songId: string
 * }}
 */
export function singSiren(placeText, index = 0) {
  const place = sanitizePlace(placeText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${place}`);
  const placePreview = place.length > 56 ? `${place.slice(0, 53)}...` : place;
  const songId = `SS-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const tide = pickTide(place, h);
  const sings = isLowTideIsh(tide);
  const song = sings
    ? SONGS[(h >>> 3) % SONGS.length]
    : WAIT_SONGS[(h >>> 3) % WAIT_SONGS.length];
  const shore = SHORES[(h >>> 6) % SHORES.length];
  const note = SIREN_NOTES[(h >>> 9) % SIREN_NOTES.length];

  return {
    place,
    placePreview,
    tide,
    song,
    shore,
    note,
    sings,
    songId,
  };
}

/**
 * Sing for many places (order preserved).
 * @param {unknown[]} places
 * @returns {ReturnType<typeof singSiren>[]}
 */
export function singMany(places) {
  const list = Array.isArray(places) ? places : [];
  if (list.length === 0) {
    return [singSiren('Sandgate', 0)];
  }
  return list.map((p, i) => singSiren(p, i));
}

/**
 * Pretty-print a multi-place siren report.
 * @param {unknown[]} places
 * @returns {string}
 */
export function formatSirenReport(places) {
  const rows = singMany(places);
  const lines = [
    'SANDGATE-SIREN — sings only at Sandgate at low tide (metaphor only)',
    'bay · offline · $0 · no secrets',
    '',
    'songId  sings  tide                      shore               place',
    '------  -----  -------------------------                      -----               -----',
  ];
  for (const r of rows) {
    const sings = (r.sings ? 'yes' : 'wait').padEnd(5);
    const tide = r.tide.padEnd(25).slice(0, 25);
    const shore = r.shore.padEnd(19).slice(0, 19);
    lines.push(`${r.songId}  ${sings}  ${tide}  ${shore}  ${r.placePreview}`);
    lines.push(`  → song: ${r.song}`);
    lines.push(`  → note: ${r.note}`);
    lines.push('');
  }
  lines.push('Metaphor only — never opens network or fetches real tides.');
  return lines.join('\n').trimEnd() + '\n';
}
