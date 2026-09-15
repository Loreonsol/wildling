import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'patchwork-passport', 'lib.mjs')).href;

const {
  sanitizeFolder,
  stampFolder,
  stampMany,
  formatPassport,
  INKS,
  VISAS,
  STATIONS,
  ADVICE,
} = await import(libUrl);

describe('patchwork-passport product', () => {
  it('sanitizeFolder defaults empty / non-string', () => {
    expect(sanitizeFolder('')).toBe('untitled/folder');
    expect(sanitizeFolder('   ')).toBe('untitled/folder');
    expect(sanitizeFolder(null as unknown as string)).toBe('untitled/folder');
    expect(sanitizeFolder(42 as unknown as string)).toBe('untitled/folder');
  });

  it('sanitizeFolder normalizes whitespace', () => {
    expect(sanitizeFolder('  packages/core  ')).toBe('packages/core');
  });

  it('stampFolder is stable for same folder + index', () => {
    const a = stampFolder('packages/core', 0);
    const b = stampFolder('packages/core', 0);
    expect(a).toEqual(b);
    expect(INKS).toContain(a.ink);
    expect(VISAS).toContain(a.visa);
    expect(STATIONS).toContain(a.station);
    expect(ADVICE).toContain(a.advice);
    expect(a.stampId).toMatch(/^PP-[0-9A-F]{4}$/);
    expect(a.pages).toBeGreaterThanOrEqual(3);
    expect(a.pages).toBeLessThanOrEqual(31);
  });

  it('stampFolder differs across distinct inputs', () => {
    const a = stampFolder('packages/core', 0);
    const b = stampFolder('apps/web', 1);
    expect(
      a.ink !== b.ink ||
        a.visa !== b.visa ||
        a.station !== b.station ||
        a.advice !== b.advice ||
        a.stampId !== b.stampId,
    ).toBe(true);
    expect(a.folder).not.toBe(b.folder);
  });

  it('stampMany defaults empty list to packages/unnamed', () => {
    const rows = stampMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.folder).toBe('packages/unnamed');
  });

  it('stampMany preserves order for multiple folders', () => {
    const rows = stampMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.folder)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatPassport includes key markers and metaphor footer', () => {
    const out = formatPassport(['packages/core', 'apps/web']);
    expect(out).toContain('PATCHWORK-PASSPORT');
    expect(out).toContain('packages/core');
    expect(out).toContain('apps/web');
    expect(out).toContain('ink:');
    expect(out).toContain('visa:');
    expect(out).toContain('PP-');
    expect(out).toMatch(/Metaphor only/);
    expect(out).toMatch(/never opens network/i);
  });
});
