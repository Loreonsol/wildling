import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'cursor-firefly', 'lib.mjs')).href;

const {
  sanitizeMoment,
  normalizeHour,
  resolveForm,
  summonFirefly,
  summonMany,
  formatFireflyReport,
  CURSOR_FORMS,
  FIREFLY_FORMS,
  HABITATS,
  WHISPERS,
} = await import(libUrl);

describe('cursor-firefly product', () => {
  it('sanitizeMoment defaults empty / non-string', () => {
    expect(sanitizeMoment('')).toBe('an unnamed hour');
    expect(sanitizeMoment('   ')).toBe('an unnamed hour');
    expect(sanitizeMoment(null as unknown as string)).toBe('an unnamed hour');
    expect(sanitizeMoment(42 as unknown as string)).toBe('an unnamed hour');
  });

  it('sanitizeMoment normalizes whitespace', () => {
    expect(sanitizeMoment('  quiet   buffer  ')).toBe('quiet buffer');
  });

  it('normalizeHour accepts 0–23 and rejects bad', () => {
    expect(normalizeHour(0)).toBe(0);
    expect(normalizeHour(23)).toBe(23);
    expect(normalizeHour('4')).toBe(4);
    expect(normalizeHour(24)).toBeNull();
    expect(normalizeHour(-1)).toBeNull();
    expect(normalizeHour('nope')).toBeNull();
    expect(normalizeHour(null)).toBeNull();
  });

  it('resolveForm uses day/night hours', () => {
    expect(resolveForm('x', 6)).toBe('cursor');
    expect(resolveForm('x', 17)).toBe('cursor');
    expect(resolveForm('x', 18)).toBe('firefly');
    expect(resolveForm('x', 4)).toBe('firefly');
    expect(resolveForm('x', 0)).toBe('firefly');
  });

  it('summonFirefly is stable for same moment + hour + index', () => {
    const a = summonFirefly('overnight wake', 4, 0);
    const b = summonFirefly('overnight wake', 4, 0);
    expect(a).toEqual(b);
    expect(a.form).toBe('firefly');
    expect(FIREFLY_FORMS).toContain(a.shape);
    expect(HABITATS).toContain(a.habitat);
    expect(WHISPERS).toContain(a.whisper);
    expect(a.sightingId).toMatch(/^FLY-[0-9A-F]{4}$/);
    expect(a.blinkRate).toBeGreaterThanOrEqual(40);
    expect(a.blinkRate).toBeLessThanOrEqual(100);
  });

  it('summonFirefly day hour yields cursor shapes', () => {
    const a = summonFirefly('afternoon refactor', 14, 0);
    expect(a.form).toBe('cursor');
    expect(CURSOR_FORMS).toContain(a.shape);
  });

  it('summonFirefly differs across distinct inputs', () => {
    const a = summonFirefly('overnight wake', 4, 0);
    const b = summonFirefly('empty commit line', 4, 1);
    expect(
      a.shape !== b.shape ||
        a.habitat !== b.habitat ||
        a.whisper !== b.whisper ||
        a.sightingId !== b.sightingId,
    ).toBe(true);
  });

  it('summonMany maps moments in order', () => {
    const many = summonMany(['alpha', 'beta'], 4);
    expect(many).toHaveLength(2);
    expect(many[0]!.moment).toBe('alpha');
    expect(many[1]!.moment).toBe('beta');
  });

  it('formatFireflyReport includes markers', () => {
    const out = formatFireflyReport(['quiet buffer'], 4);
    expect(out).toContain('cursor-firefly');
    expect(out).toContain('quiet buffer');
    expect(out).toContain('form:');
    expect(out).toContain('firefly');
    expect(out).toContain('FLY-');
  });
});
