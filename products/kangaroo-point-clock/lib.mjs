/**
 * kangaroo-point-clock — cliff-face clock at Kangaroo Point that ticks in haiku.
 * offline, $0, no secrets. Metaphor / joke only — never opens network or moves rock.
 */

/** Cliff faces / dials overlooking the Brisbane River. */
export const CLIFF_FACES = [
  'Story Bridge overlook dial',
  'Kangaroo Point Cliffs sundial',
  'Riverwalk limestone face',
  'Holman Street ferry notch',
  'Wilson Outlook haiku ledge',
  'Captain Burke Park soft dial',
  'Dockside sandstone hour-mark',
  'CityCat wake reflection face',
];

/** Tick sounds the cliff makes instead of tock. */
export const TICK_SOUNDS = [
  'soft chalk on limestone',
  'ferry horn folded into 5-7-5',
  'ibis wingbeat counted twice',
  'tide lap against basalt',
  'cicada summer metronome',
  'skate-wheel hush on the boardwalk',
  'jacaranda petal drop',
  'story-bridge cable hum',
];

/** Hour moods for the cliff dial (0–23 mapped loosely). */
export const HOUR_MOODS = [
  'midnight cliff hush',
  'owl-hour hush',
  'pre-dawn cool stone',
  'first light on basalt',
  'commuter ferry blush',
  'early coffee steam',
  'golden hour rehearsal',
  'office towers wake',
  'mid-morning glare',
  'tourist camera click',
  'brunch shadow short',
  'high sun on chalk',
  'noon river flash',
  'post-lunch soft heat',
  'afternoon cliff nap',
  'school-bell ferry',
  'golden hour proper',
  'city lights rehearsal',
  'dusk Story Bridge glow',
  'dinner picnic hush',
  'night climb murmur',
  'late ferry lullaby',
  'almost-midnight hush',
  'last CityCat whisper',
];

/** Closing lines / soft notes under every tick. */
export const CLOCK_NOTES = [
  'Joke clock only — never opens network or moves rock.',
  'Offline, $0, no secrets — leave private keys on the riverbank.',
  'Blank moment defaults to a gentle cliff murmur.',
  'If tests fail, rewind to the previous haiku tick.',
  'Metaphor dial only — no paid APIs, no excavation.',
  'Haiku ticks hold better when the cliff is kind.',
  'Kangaroo Point softens every late minute into verse.',
  'Exit when the 5-7-5 stops lying about the hour.',
];

/** 5-syllable openers for the haiku tick. */
const HAIKU_5A = [
  'cliff face keeps time',
  'river below waits',
  'basalt holds the hour',
  'ferry horn softens',
  'chalk marks the minute',
  'Story Bridge listens',
  'limestone remembers',
  'dusk folds the dial',
];

/** 7-syllable middles. */
const HAIKU_7 = [
  'five seven five soft as chalk',
  'CityCat wakes count the beat',
  'ibis shadow ticks the ledge',
  'tide lap answers every tock',
  'jacaranda counts the hush',
  'skate wheels hush the boardwalk hour',
  'golden hour rehearses dusk',
  'night climb murmurs on the stone',
];

/** 5-syllable closers. */
const HAIKU_5B = [
  'hour becomes verse',
  'minute turns to mist',
  'second softens stone',
  'clock forgets hurry',
  'time leans on the cliff',
  'haiku holds the tick',
  'rock keeps the secret',
  'river takes the rest',
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
 * Sanitize a moment / place hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeMoment(text) {
  if (text == null || typeof text !== 'string') return 'cliff murmur';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'cliff murmur';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'cliff murmur';
}

/**
 * Normalize hour to 0–23 (finite numbers only; else null).
 * @param {unknown} hour
 * @returns {number | null}
 */
export function normalizeHour(hour) {
  if (hour == null || hour === '') return null;
  const n = typeof hour === 'number' ? hour : Number(hour);
  if (!Number.isFinite(n)) return null;
  const h = Math.floor(n) % 24;
  return h < 0 ? h + 24 : h;
}

/**
 * Infer a cliff face from a hint (deterministic).
 * bridge / story → Story Bridge; kangaroo / cliff → Kangaroo Cliffs;
 * riverwalk / limestone → Riverwalk; ferry / holman → Holman;
 * wilson / outlook → Wilson; burke / picnic → Captain Burke;
 * dock / sandstone → Dockside; citycat / wake → CityCat; else bank.
 * @param {string} moment
 * @param {number} h
 * @returns {string}
 */
export function pickCliffFace(moment, h) {
  const lower = moment.toLowerCase();
  if (lower.includes('bridge') || lower.includes('story')) {
    return 'Story Bridge overlook dial';
  }
  if (lower.includes('kangaroo') || lower.includes('cliff')) {
    return 'Kangaroo Point Cliffs sundial';
  }
  if (lower.includes('riverwalk') || lower.includes('limestone')) {
    return 'Riverwalk limestone face';
  }
  if (lower.includes('holman') || lower.includes('ferry')) {
    return 'Holman Street ferry notch';
  }
  if (lower.includes('wilson') || lower.includes('outlook')) {
    return 'Wilson Outlook haiku ledge';
  }
  if (lower.includes('burke') || lower.includes('picnic') || lower.includes('park')) {
    return 'Captain Burke Park soft dial';
  }
  if (lower.includes('dock') || lower.includes('sandstone')) {
    return 'Dockside sandstone hour-mark';
  }
  if (lower.includes('citycat') || lower.includes('wake')) {
    return 'CityCat wake reflection face';
  }
  return CLIFF_FACES[h % CLIFF_FACES.length];
}

/**
 * Infer a tick sound from a hint (deterministic).
 * chalk / limestone → chalk; horn / ferry → ferry horn;
 * ibis / wing → ibis; tide / basalt → tide; cicada → cicada;
 * skate / boardwalk → skate; jacaranda / petal → jacaranda;
 * cable / hum → cable; else bank.
 * @param {string} moment
 * @param {number} h
 * @returns {string}
 */
export function pickTickSound(moment, h) {
  const lower = moment.toLowerCase();
  if (lower.includes('chalk') || lower.includes('limestone')) {
    return 'soft chalk on limestone';
  }
  if (lower.includes('horn') || (lower.includes('ferry') && !lower.includes('holman'))) {
    return 'ferry horn folded into 5-7-5';
  }
  if (lower.includes('ibis') || lower.includes('wing') || lower.includes('bin chicken')) {
    return 'ibis wingbeat counted twice';
  }
  if (lower.includes('tide') || lower.includes('basalt')) {
    return 'tide lap against basalt';
  }
  if (lower.includes('cicada') || lower.includes('summer')) {
    return 'cicada summer metronome';
  }
  if (lower.includes('skate') || lower.includes('boardwalk')) {
    return 'skate-wheel hush on the boardwalk';
  }
  if (lower.includes('jacaranda') || lower.includes('petal')) {
    return 'jacaranda petal drop';
  }
  if (lower.includes('cable') || lower.includes('hum') || lower.includes('story')) {
    return 'story-bridge cable hum';
  }
  return TICK_SOUNDS[h % TICK_SOUNDS.length];
}

/**
 * Build a 5-7-5 haiku tick from hash bits.
 * @param {number} h
 * @returns {{ line1: string, line2: string, line3: string, text: string }}
 */
export function buildHaiku(h) {
  const line1 = HAIKU_5A[h % HAIKU_5A.length];
  const line2 = HAIKU_7[(h >>> 3) % HAIKU_7.length];
  const line3 = HAIKU_5B[(h >>> 6) % HAIKU_5B.length];
  return {
    line1,
    line2,
    line3,
    text: `${line1}\n${line2}\n${line3}`,
  };
}

/**
 * Tick one moment on the Kangaroo Point cliff-face clock.
 * @param {unknown} momentText
 * @param {number} [index=0]
 * @param {unknown} [hourHint]
 * @returns {{
 *   moment: string,
 *   momentPreview: string,
 *   face: string,
 *   tick: string,
 *   mood: string,
 *   hour: number,
 *   haiku: string,
 *   line1: string,
 *   line2: string,
 *   line3: string,
 *   note: string,
 *   tickId: string
 * }}
 */
export function tickClock(momentText, index = 0, hourHint) {
  const moment = sanitizeMoment(momentText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${moment}`);
  const momentPreview = moment.length > 56 ? `${moment.slice(0, 53)}...` : moment;
  const tickId = `KP-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const face = pickCliffFace(moment, h);
  const tick = pickTickSound(moment, h);
  const normalized = normalizeHour(hourHint);
  const hour = normalized != null ? normalized : (h >>> 8) % 24;
  const mood = HOUR_MOODS[hour % HOUR_MOODS.length];
  const haikuParts = buildHaiku(h);
  const note = CLOCK_NOTES[(h >>> 4) % CLOCK_NOTES.length];

  return {
    moment,
    momentPreview,
    face,
    tick,
    mood,
    hour,
    haiku: haikuParts.text,
    line1: haikuParts.line1,
    line2: haikuParts.line2,
    line3: haikuParts.line3,
    note,
    tickId,
  };
}

/**
 * Tick many moments (order preserved).
 * @param {unknown[]} moments
 * @param {unknown} [hourHint]
 * @returns {ReturnType<typeof tickClock>[]}
 */
export function tickMany(moments, hourHint) {
  const list = Array.isArray(moments) ? moments : [];
  if (list.length === 0) {
    return [tickClock('cliff murmur', 0, hourHint)];
  }
  return list.map((t, i) => tickClock(t, i, hourHint));
}

/**
 * Pretty-print a multi-moment cliff-face clock report.
 * @param {unknown[]} moments
 * @param {unknown} [hourHint]
 * @returns {string}
 */
export function formatClock(moments, hourHint) {
  const rows = tickMany(moments, hourHint);
  const lines = [
    'KANGAROO-POINT-CLOCK — cliff-face dial that ticks in haiku (metaphor / joke only)',
    'tick · offline · $0 · no secrets',
    '',
    'tickId  hour  face                               moment',
    '------  ----  ---------------------------------  ------',
  ];
  for (const r of rows) {
    const face = r.face.padEnd(33).slice(0, 33);
    const hh = String(r.hour).padStart(2, '0');
    lines.push(`${r.tickId}  ${hh}    ${face}  ${r.momentPreview}`);
    lines.push(`  → mood:   ${r.mood}`);
    lines.push(`  → tick:   ${r.tick}`);
    lines.push(`  → haiku:`);
    lines.push(`       ${r.line1}`);
    lines.push(`       ${r.line2}`);
    lines.push(`       ${r.line3}`);
    lines.push(`  → note:   ${r.note}`);
    lines.push('');
  }
  lines.push('Joke clock only — never opens network or moves rock.');
  return lines.join('\n').trimEnd() + '\n';
}
