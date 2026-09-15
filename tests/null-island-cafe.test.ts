import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'null-island-cafe', 'lib.mjs')).href;

const {
  sanitizeGuest,
  resolveCoords,
  brewOrder,
  brewMany,
  formatCafeMenu,
  BLENDS,
  PASTRIES,
  BARISTAS,
  RECEIPT_NOTES,
} = await import(libUrl);

describe('null-island-cafe product', () => {
  it('sanitizeGuest defaults empty / non-string', () => {
    expect(sanitizeGuest('')).toBe('anonymous sailor');
    expect(sanitizeGuest('   ')).toBe('anonymous sailor');
    expect(sanitizeGuest(null as unknown as string)).toBe('anonymous sailor');
    expect(sanitizeGuest(42 as unknown as string)).toBe('anonymous sailor');
  });

  it('sanitizeGuest normalizes whitespace', () => {
    expect(sanitizeGuest('  quiet   desk  ')).toBe('quiet desk');
  });

  it('resolveCoords parses lat,lon and clamps', () => {
    const a = resolveCoords('0,0');
    expect(a.lat).toBe(0);
    expect(a.lon).toBe(0);
    expect(a.invented).toBe(false);

    const b = resolveCoords('-27.47,153.03');
    expect(b.lat).toBe(-27.47);
    expect(b.lon).toBe(153.03);
    expect(b.invented).toBe(false);

    const c = resolveCoords('999,999');
    expect(c.lat).toBe(90);
    expect(c.lon).toBe(180);
    expect(c.invented).toBe(false);
  });

  it('resolveCoords invents coords for plain guests', () => {
    const a = resolveCoords('quiet desk');
    expect(a.invented).toBe(true);
    expect(a.lat).toBeGreaterThanOrEqual(-90);
    expect(a.lat).toBeLessThanOrEqual(90);
    expect(a.lon).toBeGreaterThanOrEqual(-180);
    expect(a.lon).toBeLessThanOrEqual(180);
  });

  it('brewOrder is stable for same guest + index', () => {
    const a = brewOrder('quiet desk', 0);
    const b = brewOrder('quiet desk', 0);
    expect(a).toEqual(b);
    expect(BLENDS).toContain(a.blend);
    expect(PASTRIES).toContain(a.pastry);
    expect(BARISTAS).toContain(a.barista);
    expect(RECEIPT_NOTES).toContain(a.note);
    expect(a.ticketId).toMatch(/^NIL-[0-9A-F]{4}$/);
    expect(a.steamPsi).toBeGreaterThanOrEqual(8);
    expect(a.steamPsi).toBeLessThanOrEqual(20);
  });

  it('brewOrder with lat,lon keeps plotted coords', () => {
    const a = brewOrder('0,0', 0);
    expect(a.invented).toBe(false);
    expect(a.lat).toBe(0);
    expect(a.lon).toBe(0);
  });

  it('brewOrder differs across distinct inputs', () => {
    const a = brewOrder('quiet desk', 0);
    const b = brewOrder('Sandgate foreshore', 1);
    expect(
      a.blend !== b.blend ||
        a.pastry !== b.pastry ||
        a.barista !== b.barista ||
        a.ticketId !== b.ticketId,
    ).toBe(true);
  });

  it('brewMany maps guests in order', () => {
    const many = brewMany(['alpha', 'beta']);
    expect(many).toHaveLength(2);
    expect(many[0]!.guest).toBe('alpha');
    expect(many[1]!.guest).toBe('beta');
  });

  it('formatCafeMenu includes markers', () => {
    const out = formatCafeMenu(['quiet desk']);
    expect(out).toContain('null-island-cafe');
    expect(out).toContain('quiet desk');
    expect(out).toContain('blend:');
    expect(out).toContain('NIL-');
    expect(out).toContain('0°N 0°E');
  });
});
