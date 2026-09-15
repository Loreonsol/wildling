/**
 * ink-weather — weather report where precipitation is colored ink.
 * offline, $0, no secrets. Metaphor only — never fetches real weather or opens network.
 */

/** Sky moods (not real meteorology). */
export const SKY_MOODS = [
  'parchment-haze',
  'cobalt-clear',
  'smudge-overcast',
  'margin-notes',
  'gutter-storm',
  'colophon-calm',
  'bleed-edge dusk',
  'watermark dawn',
];

/** Ink pigments that fall as precip. */
export const INK_COLORS = [
  'indigo rain',
  'sepia drizzle',
  'emerald mist',
  'carmine squall',
  'ultramarine sheet',
  'ochre sprinkle',
  'violet sleet',
  'graphite fog',
];

/** Surfaces the ink lands on. */
export const SURFACES = [
  'unlined notebook',
  'bus ticket stub',
  'window glass',
  'leftover receipt',
  'shirt cuff',
  'sidewalk chalk',
  'library card',
  'blank sticky note',
];

/** Forecast advice (playful). */
export const FORECAST_TIPS = [
  'Carry a blotter, not an umbrella.',
  'Let the first drops title your page.',
  'Avoid white shirts during carmine squalls.',
  'Collect puddles — they are drafts.',
  'If it smears, that is the plot twist.',
  'Dry pages face inward; stories face out.',
  'Sip tea until the margin clears.',
  'Stamp one footprint; leave the rest to dry.',
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
 * Sanitize a place / subject line for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizePlace(text) {
  if (text == null || typeof text !== 'string') return 'an unnamed margin';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'an unnamed margin';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'an unnamed margin';
}

/**
 * Build one deterministic ink-weather report for a place.
 * @param {unknown} placeText
 * @param {number} [index=0]
 * @returns {{
 *   place: string,
 *   placePreview: string,
 *   sky: string,
 *   precip: string,
 *   surface: string,
 *   tip: string,
 *   reportId: string,
 *   chance: number
 * }}
 */
export function forecastInk(placeText, index = 0) {
  const place = sanitizePlace(placeText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${place}`);
  const placePreview = place.length > 48 ? `${place.slice(0, 45)}...` : place;
  const reportId = `INK-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  return {
    place,
    placePreview,
    sky: SKY_MOODS[h % SKY_MOODS.length],
    precip: INK_COLORS[(h >>> 4) % INK_COLORS.length],
    surface: SURFACES[(h >>> 8) % SURFACES.length],
    tip: FORECAST_TIPS[(h >>> 12) % FORECAST_TIPS.length],
    reportId,
    chance: (h % 71) + 20,
  };
}

/**
 * Forecast several places (order preserved).
 * @param {unknown[]} places
 * @returns {ReturnType<typeof forecastInk>[]}
 */
export function forecastMany(places) {
  const list = Array.isArray(places) ? places : [];
  if (list.length === 0) {
    return [forecastInk('quiet desk corner', 0)];
  }
  return list.map((p, i) => forecastInk(p, i));
}

/**
 * Format a printable ink-weather bulletin.
 * @param {unknown[]} places
 * @returns {string}
 */
export function formatInkWeather(places) {
  const rows = forecastMany(places);
  const width = 56;
  const line = '='.repeat(width);
  const out = [
    line,
    'INK-WEATHER / 0.1  (metaphor precip; no meteorology APIs)',
    line,
  ];
  for (const r of rows) {
    out.push(`  [${r.reportId}] chance ${String(r.chance).padStart(2, '0')}%`);
    out.push(`  place  : ${r.placePreview}`);
    out.push(`  sky    : ${r.sky}`);
    out.push(`  precip : ${r.precip}`);
    out.push(`  lands  : ${r.surface}`);
    out.push(`  tip    : ${r.tip}`);
    out.push(line);
  }
  out.push('(Metaphor only — never fetches real weather. Offline, $0, no secrets.)');
  return out.join('\n');
}
