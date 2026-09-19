/**
 * valley-of-tabs — Travelogue through a valley made of unclosed browser tabs.
 * offline, $0, no secrets. Metaphor / joke only — never opens tabs or network.
 */

/** Friendly default when argv is empty. */
export const DEFAULT_TABS = [
  'unread docs',
  'recipe half-scrolled',
  'map pin forever',
  'inbox tab #47',
];

/** Valley landmarks shaped like abandoned tabs. */
export const LANDMARKS = [
  'the Bookmark Bluff',
  'Favicon Falls',
  'History Hollow',
  'Incognito Overlook',
  'Cookie Crag',
  'Cache Canyon',
  'Pinned Peak',
  'Session Spur',
  'Scrollbar Saddle',
  'New-Tab Meadow',
  'Extensions Escarpment',
  'Ghost-Window Ridge',
];

/** Trail markers along the tab valley. */
export const TRAIL_MARKERS = [
  'a faded "open later" cairn',
  'three stacked mute icons',
  'a mossy refresh glyph',
  'breadcrumbs of half-read titles',
  'a ribbon of blue progress bars',
  'a whistle of tab-switch keybinds',
  'a cairn of duplicate URLs',
  'a soft ping of unfinished carts',
  'a trail of collapsed sidebars',
  'a signpost reading "tomorrow"',
  'a pile of forgotten PDF previews',
  'a whisper of autoplay that never played',
];

/** Tab-weather over the valley. */
export const TAB_WEATHER = [
  'drizzle of unread badges',
  'fog of autofill memories',
  'gusts of notification chimes',
  'clear skies of zero cookies',
  'heat shimmer of GPU fans',
  'mist of half-loaded images',
  'soft rain of favicon pixels',
  'high pressure from too many extensions',
  'cool breeze through empty scratchpads',
  'static snow of frozen scripts',
  'golden hour on pinned tabs',
  'night haze of dark-mode valleys',
];

/** Closing advice (joke — never actually closes tabs). */
export const CLOSING_ADVICE = [
  'Close one tab; leave the valley kinder.',
  'Bookmark the view, then let the breeze through.',
  'Duplicate tabs make poor hiking partners — merge them.',
  'If it has not been read in a week, it is scenery now.',
  'Pin only what you can carry in one pocket.',
  'Tomorrow is already open somewhere; start here.',
  'Mute the loud ones; keep the quiet vistas.',
  'A closed tab is a trail you can still redraw.',
  'Leave three open for wonder; archive the rest as myth.',
  'Refresh is not the same as return — walk gently.',
  'History remembers; you do not have to keep the window.',
  'Exit when the badge count stops being a mountain.',
];

/** Soft notes printed under every travelogue. */
export const TRAVELOGUE_NOTES = [
  'Joke travelogue only — never opens tabs or network.',
  'Offline, $0, no secrets — leave real browsers alone.',
  'Blank hints default to a soft unread murmur.',
  'If tests fail, rewind to the previous trail marker.',
  'Metaphor valley only — no paid APIs, no session theft.',
  'Tabs soften every unfinished scroll into scenery.',
  'Landmarks hold better when the weather is kind.',
  'Exit when the valley stops pretending to be work.',
];

/**
 * Stable non-crypto hash → non-negative int.
 * @param {string} s
 * @returns {number}
 */
export function softHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Sanitize a tab / place hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeHint(text) {
  if (text == null || typeof text !== 'string') return 'unread murmur';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'unread murmur';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'unread murmur';
}

/**
 * Infer a landmark from tab/place keywords (deterministic).
 * docs / readme → Bookmark Bluff; cookie / cart → Cookie Crag;
 * recipe / cook → Favicon Falls; map / gps → History Hollow;
 * inbox / mail → Incognito Overlook; cache / offline → Cache Canyon;
 * pinned / sticky → Pinned Peak; session / login → Session Spur;
 * scroll / long → Scrollbar Saddle; new / blank → New-Tab Meadow;
 * ext / plugin → Extensions Escarpment; ghost / dead → Ghost-Window Ridge;
 * else bank.
 * @param {string} hint
 * @param {number} h
 * @returns {string}
 */
export function pickLandmark(hint, h) {
  const lower = hint.toLowerCase();
  if (lower.includes('docs') || lower.includes('readme')) {
    return 'the Bookmark Bluff';
  }
  if (lower.includes('cookie') || lower.includes('cart')) {
    return 'Cookie Crag';
  }
  if (lower.includes('recipe') || lower.includes('cook')) {
    return 'Favicon Falls';
  }
  if (lower.includes('map') || lower.includes('gps')) {
    return 'History Hollow';
  }
  if (lower.includes('inbox') || lower.includes('mail')) {
    return 'Incognito Overlook';
  }
  if (lower.includes('cache') || lower.includes('offline')) {
    return 'Cache Canyon';
  }
  if (lower.includes('pinned') || lower.includes('sticky')) {
    return 'Pinned Peak';
  }
  if (lower.includes('session') || lower.includes('login')) {
    return 'Session Spur';
  }
  if (lower.includes('scroll') || lower.includes('long')) {
    return 'Scrollbar Saddle';
  }
  if (lower.includes('new') || lower.includes('blank')) {
    return 'New-Tab Meadow';
  }
  if (lower.includes('ext') || lower.includes('plugin')) {
    return 'Extensions Escarpment';
  }
  if (lower.includes('ghost') || lower.includes('dead')) {
    return 'Ghost-Window Ridge';
  }
  return LANDMARKS[h % LANDMARKS.length];
}

export function pickTrailMarker(h) {
  return TRAIL_MARKERS[h % TRAIL_MARKERS.length];
}

/**
 * Pick tab-weather from seed bits.
 * @param {number} h
 * @returns {string}
 */
export function pickTabWeather(h) {
  return TAB_WEATHER[h % TAB_WEATHER.length];
}

/**
 * Pick closing advice from seed bits.
 * @param {number} h
 * @returns {string}
 */
export function pickClosingAdvice(h) {
  return CLOSING_ADVICE[h % CLOSING_ADVICE.length];
}

/**
 * Build one trail stop object for a tab/place hint.
 * @param {unknown} hintText
 * @param {number} [index=0]
 * @returns {{
 *   hint: string,
 *   hintPreview: string,
 *   landmark: string,
 *   trailMarker: string,
 *   tabWeather: string,
 *   closingAdvice: string,
 *   stopId: string
 * }}
 */
export function walkStop(hintText, index = 0) {
  const hint = sanitizeHint(hintText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${hint}`);
  const hintPreview = hint.length > 72 ? `${hint.slice(0, 69)}...` : hint;
  const stopId = `VT-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const landmark = pickLandmark(hint, h);
  const trailMarker = pickTrailMarker(h >>> 4);
  const tabWeather = pickTabWeather(h >>> 8);
  const closingAdvice = pickClosingAdvice(h >>> 12);

  return {
    hint,
    hintPreview,
    landmark,
    trailMarker,
    tabWeather,
    closingAdvice,
    stopId,
  };
}

/**
 * Walk one or more tab/place hints into a travelogue.
 * @param {unknown[]} hints
 * @returns {{
 *   stops: ReturnType<typeof walkStop>[],
 *   travelogueId: string,
 *   note: string
 * }}
 */
export function walkValley(hints) {
  const raw = Array.isArray(hints) ? hints : [];
  const list = raw.length === 0 ? [...DEFAULT_TABS] : raw;
  const stops = list.map((m, i) => walkStop(m, i));
  const seed = stops.map((x) => x.hint).join('|');
  const reportHash = softHash(seed);
  const travelogueId = `VT-${(reportHash % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const note = TRAVELOGUE_NOTES[(reportHash >>> 4) % TRAVELOGUE_NOTES.length];
  return { stops, travelogueId, note };
}

/**
 * Pretty-print a valley-of-tabs travelogue.
 * @param {unknown[]} hints
 * @returns {string}
 */
export function formatTravelogue(hints) {
  const report = walkValley(hints);
  const lines = [
    'VALLEY-OF-TABS — travelogue through a valley made of unclosed browser tabs',
    'joke travelogue · offline · $0 · no secrets · never opens tabs',
    '',
    `travelogueId  ${report.travelogueId}`,
    '',
    'id      landmark / weather → trail & closing advice',
    '------  -------------------------------------------',
  ];
  for (const stop of report.stops) {
    lines.push(`${stop.stopId}  ${stop.landmark}`);
    lines.push(`  → tab: ${stop.hintPreview}`);
    lines.push(`  → weather: ${stop.tabWeather}`);
    lines.push(`  → trail: ${stop.trailMarker}`);
    lines.push(`  → close?: ${stop.closingAdvice}`);
  }
  lines.push('');
  lines.push(`  → note: ${report.note}`);
  lines.push('');
  lines.push(
    'Joke only — never opens browser tabs, never touches sessions, never network.',
  );
  return lines.join('\n').trimEnd() + '\n';
}
