/**
 * cursor-firefly — creature that is a text cursor by day and a firefly by night.
 * offline, $0, no secrets. Metaphor only — never opens network or touches real cursors.
 */

/** Day forms (blinking caret personalities). */
export const CURSOR_FORMS = [
  'block caret',
  'thin pipe',
  'underscore blink',
  'soft I-beam',
  'hollow box',
  'double-width glyph',
  'faint mid-line dash',
  'serif wedge',
];

/** Night forms (firefly glow styles). */
export const FIREFLY_FORMS = [
  'amber pulse',
  'cool-green wink',
  'gold Morse drip',
  'lantern-dot swarm',
  'moonlit comma',
  'violet spark trail',
  'warm orchard blink',
  'quiet phosphor bead',
];

/** Roosts / habitats. */
export const HABITATS = [
  'margin of an open buffer',
  'empty commit message line',
  'terminal prompt after midnight',
  'unfinished README heading',
  'diff hunk left unresolved',
  'comment that almost became code',
  'statusbar corner nobody watches',
  'notebook page turned face-down',
];

/** Soft advice from the creature. */
export const WHISPERS = [
  'Blink once; save twice.',
  'If the glow drifts left, follow the unfinished thought.',
  'Day mode types; night mode remembers why you typed.',
  'Do not chase every spark — some are just commas resting.',
  'When the caret thickens, you are overthinking the next word.',
  'A quiet pulse means the tests are dreaming green.',
  'Leave one blank line for the firefly to land.',
  'At dawn it becomes a cursor again — keep the poem in the comment.',
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
 * Sanitize a moment / scene string for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeMoment(text) {
  if (text == null || typeof text !== 'string') return 'an unnamed hour';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'an unnamed hour';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'an unnamed hour';
}

/**
 * Normalize hour to 0–23 integer, or null if absent/invalid.
 * @param {unknown} hour
 * @returns {number | null}
 */
export function normalizeHour(hour) {
  if (hour == null || hour === '') return null;
  const n = typeof hour === 'number' ? hour : Number(String(hour).trim());
  if (!Number.isFinite(n)) return null;
  const h = Math.trunc(n);
  if (h < 0 || h > 23) return null;
  return h;
}

/**
 * Day = 6..17 inclusive; otherwise night (firefly).
 * When hour is null, derive from soft-hash of moment (odd → night).
 * @param {string} moment
 * @param {number | null} hour
 * @returns {'cursor' | 'firefly'}
 */
export function resolveForm(moment, hour = null) {
  const h = normalizeHour(hour);
  if (h != null) {
    return h >= 6 && h <= 17 ? 'cursor' : 'firefly';
  }
  return softHash(sanitizeMoment(moment)) % 2 === 0 ? 'cursor' : 'firefly';
}

/**
 * Summon one deterministic creature sighting.
 * @param {unknown} momentText
 * @param {unknown} [hour]
 * @param {number} [index]
 * @returns {{ moment: string, form: 'cursor' | 'firefly', shape: string, habitat: string, whisper: string, blinkRate: number, sightingId: string, hour: number | null }}
 */
export function summonFirefly(momentText, hour = null, index = 0) {
  const moment = sanitizeMoment(momentText);
  const h = normalizeHour(hour);
  const form = resolveForm(moment, h);
  const seed = softHash(`${moment}|${h ?? 'x'}|${index}|${form}`);
  const shapes = form === 'cursor' ? CURSOR_FORMS : FIREFLY_FORMS;
  const shape = shapes[seed % shapes.length];
  const habitat = HABITATS[(seed >>> 3) % HABITATS.length];
  const whisper = WHISPERS[(seed >>> 6) % WHISPERS.length];
  const blinkRate = 40 + (seed % 61); // 40–100 bpm metaphor
  const sightingId = `FLY-${(seed % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  return {
    moment,
    form,
    shape,
    habitat,
    whisper,
    blinkRate,
    sightingId,
    hour: h,
  };
}

/**
 * Summon many sightings (one per moment string).
 * @param {unknown[]} moments
 * @param {unknown} [hour]
 * @returns {ReturnType<typeof summonFirefly>[]}
 */
export function summonMany(moments, hour = null) {
  const list = Array.isArray(moments) ? moments : [];
  if (list.length === 0) return [summonFirefly('', hour, 0)];
  return list.map((m, i) => summonFirefly(m, hour, i));
}

/**
 * Pretty-print one or more sightings.
 * @param {unknown[]} moments
 * @param {unknown} [hour]
 * @returns {string}
 */
export function formatFireflyReport(moments, hour = null) {
  const sightings = summonMany(moments, hour);
  const lines = ['cursor-firefly — day caret / night glow (metaphor only)', ''];
  for (const s of sightings) {
    const when =
      s.hour != null ? `hour ${String(s.hour).padStart(2, '0')}:00` : 'hour inferred';
    lines.push(`## ${s.moment}`);
    lines.push(`form:     ${s.form}`);
    lines.push(`shape:    ${s.shape}`);
    lines.push(`habitat:  ${s.habitat}`);
    lines.push(`blink:    ${s.blinkRate} bpm`);
    lines.push(`when:     ${when}`);
    lines.push(`id:       ${s.sightingId}`);
    lines.push(`whisper:  ${s.whisper}`);
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}
