import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'ink-weather', 'lib.mjs')).href;

const {
  sanitizePlace,
  forecastInk,
  forecastMany,
  formatInkWeather,
  SKY_MOODS,
  INK_COLORS,
  SURFACES,
  FORECAST_TIPS,
} = await import(libUrl);

describe('ink-weather product', () => {
  it('sanitizePlace defaults empty / non-string', () => {
    expect(sanitizePlace('')).toBe('an unnamed margin');
    expect(sanitizePlace('   ')).toBe('an unnamed margin');
    expect(sanitizePlace(null as unknown as string)).toBe('an unnamed margin');
    expect(sanitizePlace(42 as unknown as string)).toBe('an unnamed margin');
  });

  it('sanitizePlace normalizes whitespace', () => {
    expect(sanitizePlace('  quiet   desk  ')).toBe('quiet desk');
  });

  it('forecastInk is stable for same place + index', () => {
    const a = forecastInk('Brisbane desk', 0);
    const b = forecastInk('Brisbane desk', 0);
    expect(a).toEqual(b);
    expect(SKY_MOODS).toContain(a.sky);
    expect(INK_COLORS).toContain(a.precip);
    expect(SURFACES).toContain(a.surface);
    expect(FORECAST_TIPS).toContain(a.tip);
    expect(a.reportId).toMatch(/^INK-[0-9A-F]{4}$/);
    expect(a.chance).toBeGreaterThanOrEqual(20);
    expect(a.chance).toBeLessThanOrEqual(90);
  });

  it('forecastInk differs across distinct inputs', () => {
    const a = forecastInk('Brisbane desk', 0);
    const b = forecastInk('Sandgate foreshore', 1);
    expect(
      a.sky !== b.sky ||
        a.precip !== b.precip ||
        a.surface !== b.surface ||
        a.tip !== b.tip ||
        a.reportId !== b.reportId,
    ).toBe(true);
    expect(a.place).not.toBe(b.place);
  });

  it('forecastMany defaults empty list to a quiet desk corner', () => {
    const rows = forecastMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0].place).toBe('quiet desk corner');
  });

  it('forecastMany preserves order for multiple places', () => {
    const rows = forecastMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.place)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatInkWeather includes key markers and metaphor footer', () => {
    const table = formatInkWeather(['quiet desk', 'kitchen window']);
    expect(table).toContain('INK-WEATHER');
    expect(table).toContain('sky');
    expect(table).toContain('precip');
    expect(table).toContain('lands');
    expect(table).toContain('quiet desk');
    expect(table).toContain('kitchen window');
    expect(table).toMatch(/Metaphor only/);
    expect(table).toMatch(/never fetches real weather/i);
  });
});
