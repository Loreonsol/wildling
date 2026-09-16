import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'kangaroo-point-clock', 'lib.mjs')).href;

const {
  sanitizeMoment,
  normalizeHour,
  pickCliffFace,
  pickTickSound,
  buildHaiku,
  tickClock,
  tickMany,
  formatClock,
  CLIFF_FACES,
  TICK_SOUNDS,
  HOUR_MOODS,
  CLOCK_NOTES,
} = await import(libUrl);

describe('kangaroo-point-clock product', () => {
  it('sanitizeMoment defaults empty / non-string to cliff murmur', () => {
    expect(sanitizeMoment('')).toBe('cliff murmur');
    expect(sanitizeMoment('   ')).toBe('cliff murmur');
    expect(sanitizeMoment(null as unknown as string)).toBe('cliff murmur');
    expect(sanitizeMoment(42 as unknown as string)).toBe('cliff murmur');
  });

  it('sanitizeMoment normalizes whitespace and strips non-printable', () => {
    expect(sanitizeMoment('  Story   Bridge  ')).toBe('Story Bridge');
    expect(sanitizeMoment('tick\x00rock')).toBe('tickrock');
  });

  it('normalizeHour clamps to 0–23 and rejects non-finite', () => {
    expect(normalizeHour(17)).toBe(17);
    expect(normalizeHour('6')).toBe(6);
    expect(normalizeHour(25)).toBe(1);
    expect(normalizeHour(-1)).toBe(23);
    expect(normalizeHour(undefined)).toBeNull();
    expect(normalizeHour('nope')).toBeNull();
  });

  it('pickCliffFace honors bridge / kangaroo / riverwalk / ferry / wilson / burke / dock / citycat', () => {
    expect(pickCliffFace('story bridge dusk', 0)).toBe('Story Bridge overlook dial');
    expect(pickCliffFace('kangaroo cliff climb', 1)).toBe('Kangaroo Point Cliffs sundial');
    expect(pickCliffFace('riverwalk limestone', 2)).toBe('Riverwalk limestone face');
    expect(pickCliffFace('holman ferry notch', 3)).toBe('Holman Street ferry notch');
    expect(pickCliffFace('wilson outlook ledge', 4)).toBe('Wilson Outlook haiku ledge');
    expect(pickCliffFace('burke picnic park', 5)).toBe('Captain Burke Park soft dial');
    expect(pickCliffFace('dockside sandstone', 6)).toBe('Dockside sandstone hour-mark');
    expect(pickCliffFace('citycat wake reflection', 7)).toBe('CityCat wake reflection face');
    expect(CLIFF_FACES).toContain(pickCliffFace('generic murmur', 8));
  });

  it('pickTickSound honors chalk / horn / ibis / tide / cicada / skate / jacaranda / cable', () => {
    expect(pickTickSound('chalk limestone tick', 0)).toBe('soft chalk on limestone');
    expect(pickTickSound('ferry horn soft', 1)).toBe('ferry horn folded into 5-7-5');
    expect(pickTickSound('ibis wingbeat', 2)).toBe('ibis wingbeat counted twice');
    expect(pickTickSound('tide basalt lap', 3)).toBe('tide lap against basalt');
    expect(pickTickSound('cicada summer', 4)).toBe('cicada summer metronome');
    expect(pickTickSound('skate boardwalk hush', 5)).toBe('skate-wheel hush on the boardwalk');
    expect(pickTickSound('jacaranda petal', 6)).toBe('jacaranda petal drop');
    expect(pickTickSound('cable hum story', 7)).toBe('story-bridge cable hum');
    expect(TICK_SOUNDS).toContain(pickTickSound('generic tick', 8));
  });

  it('buildHaiku returns three lines 5-7-5 shaped', () => {
    const h = buildHaiku(42);
    expect(h.line1.length).toBeGreaterThan(0);
    expect(h.line2.length).toBeGreaterThan(0);
    expect(h.line3.length).toBeGreaterThan(0);
    expect(h.text).toBe(`${h.line1}\n${h.line2}\n${h.line3}`);
  });

  it('tickClock is stable for same moment + index + hour', () => {
    const a = tickClock('Story Bridge dusk', 0, 17);
    const b = tickClock('Story Bridge dusk', 0, 17);
    expect(a).toEqual(b);
    expect(a.face).toBe('Story Bridge overlook dial');
    expect(a.hour).toBe(17);
    expect(a.mood).toBe(HOUR_MOODS[17]);
    expect(TICK_SOUNDS).toContain(a.tick);
    expect(CLOCK_NOTES).toContain(a.note);
    expect(a.haiku).toContain('\n');
    expect(a.tickId).toMatch(/^KP-[0-9A-F]{4}$/);
  });

  it('tickClock differs across distinct inputs', () => {
    const a = tickClock('alpha story bridge', 0, 6);
    const b = tickClock('beta ibis wing', 1, 18);
    expect(
      a.face !== b.face ||
        a.tickId !== b.tickId ||
        a.tick !== b.tick ||
        a.mood !== b.mood ||
        a.haiku !== b.haiku ||
        a.note !== b.note ||
        a.hour !== b.hour,
    ).toBe(true);
  });

  it('tickMany defaults empty list to cliff murmur', () => {
    const rows = tickMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.moment).toBe('cliff murmur');
  });

  it('tickMany preserves order for multiple moments', () => {
    const rows = tickMany(['alpha', 'beta', 'gamma'], 12);
    expect(rows.map((r) => r.moment)).toEqual(['alpha', 'beta', 'gamma']);
    expect(rows.every((r) => r.hour === 12)).toBe(true);
  });

  it('formatClock includes key markers and joke footer', () => {
    const out = formatClock(['Story Bridge dusk', 'ibis wingbeat'], 17);
    expect(out).toContain('KANGAROO-POINT-CLOCK');
    expect(out).toContain('KP-');
    expect(out).toContain('→ mood:');
    expect(out).toContain('→ tick:');
    expect(out).toContain('→ haiku:');
    expect(out).toContain('→ note:');
    expect(out).toMatch(/Joke clock only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(CLIFF_FACES.length).toBeGreaterThan(0);
    expect(TICK_SOUNDS.length).toBeGreaterThan(0);
    expect(HOUR_MOODS.length).toBe(24);
    expect(CLOCK_NOTES.length).toBeGreaterThan(0);
  });
});
