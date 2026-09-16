import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'sandgate-siren', 'lib.mjs')).href;

const {
  sanitizePlace,
  pickTide,
  singSiren,
  singMany,
  formatSirenReport,
  SONGS,
  WAIT_SONGS,
  TIDES,
  SHORES,
  SIREN_NOTES,
} = await import(libUrl);

describe('sandgate-siren product', () => {
  it('sanitizePlace defaults empty / non-string to Sandgate', () => {
    expect(sanitizePlace('')).toBe('Sandgate');
    expect(sanitizePlace('   ')).toBe('Sandgate');
    expect(sanitizePlace(null as unknown as string)).toBe('Sandgate');
    expect(sanitizePlace(42 as unknown as string)).toBe('Sandgate');
  });

  it('sanitizePlace normalizes whitespace and strips non-printable', () => {
    expect(sanitizePlace('  Sandgate   pier  ')).toBe('Sandgate pier');
    expect(sanitizePlace('Sandgate\x00bay')).toBe('Sandgatebay');
  });

  it('pickTide honors low / neap / ebb and high / flood hints', () => {
    expect(pickTide('Sandgate low tide', 0).toLowerCase()).toMatch(/low|neap|ebb|mud/);
    expect(pickTide('neap hush', 1).toLowerCase()).toMatch(/low|neap|ebb|mud/);
    expect(pickTide('ebb flats', 2).toLowerCase()).toMatch(/low|neap|ebb|mud/);
    expect(pickTide('high flood bay', 3).toLowerCase()).toMatch(/high|flood/);
    expect(TIDES).toContain(pickTide('generic pier', 4));
  });

  it('singSiren is stable for same place + index', () => {
    const a = singSiren('Sandgate low tide', 0);
    const b = singSiren('Sandgate low tide', 0);
    expect(a).toEqual(b);
    expect(a.sings).toBe(true);
    expect(SONGS).toContain(a.song);
    expect(SHORES).toContain(a.shore);
    expect(SIREN_NOTES).toContain(a.note);
    expect(a.songId).toMatch(/^SS-[0-9A-F]{4}$/);
  });

  it('singSiren sings true on low-tide place hints', () => {
    const low = singSiren('Sandgate low tide', 0);
    expect(low.sings).toBe(true);
    const neap = singSiren('neap at Sandgate', 1);
    expect(neap.sings).toBe(true);
  });

  it('singSiren waits when tide is high / flood', () => {
    const high = singSiren('high flood bay', 0);
    expect(high.sings).toBe(false);
    expect(WAIT_SONGS).toContain(high.song);
    expect(high.song.toLowerCase()).toMatch(/wait|silent|held|listening|closed|saves|vigil|pocketed/);
  });

  it('singSiren differs across distinct inputs', () => {
    const a = singSiren('alpha pier', 0);
    const b = singSiren('beta jetty', 1);
    expect(
      a.tide !== b.tide ||
        a.songId !== b.songId ||
        a.song !== b.song ||
        a.shore !== b.shore ||
        a.note !== b.note ||
        a.sings !== b.sings,
    ).toBe(true);
  });

  it('singMany defaults empty list to Sandgate', () => {
    const rows = singMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.place).toBe('Sandgate');
  });

  it('singMany preserves order for multiple places', () => {
    const rows = singMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.place)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatSirenReport includes key markers and metaphor footer', () => {
    const out = formatSirenReport(['Sandgate low tide', 'high flood bay']);
    expect(out).toContain('SANDGATE-SIREN');
    expect(out).toContain('SS-');
    expect(out).toContain('→ song:');
    expect(out).toContain('→ note:');
    expect(out).toMatch(/Metaphor only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(SONGS.length).toBeGreaterThan(0);
    expect(WAIT_SONGS.length).toBeGreaterThan(0);
    expect(TIDES.length).toBeGreaterThan(0);
    expect(SHORES.length).toBeGreaterThan(0);
    expect(SIREN_NOTES.length).toBeGreaterThan(0);
  });
});
