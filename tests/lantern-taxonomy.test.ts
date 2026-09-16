import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'lantern-taxonomy', 'lib.mjs')).href;

const {
  sanitizeIdea,
  classifyLantern,
  classifyMany,
  formatTaxonomy,
  SPECIES,
  FUELS,
  HABITATS,
  FIELD_NOTES,
} = await import(libUrl);

describe('lantern-taxonomy product', () => {
  it('sanitizeIdea defaults empty / non-string', () => {
    expect(sanitizeIdea('')).toBe('untitled idea');
    expect(sanitizeIdea('   ')).toBe('untitled idea');
    expect(sanitizeIdea(null as unknown as string)).toBe('untitled idea');
    expect(sanitizeIdea(42 as unknown as string)).toBe('untitled idea');
  });

  it('sanitizeIdea normalizes whitespace', () => {
    expect(sanitizeIdea('  quiet maybe  ')).toBe('quiet maybe');
  });

  it('classifyLantern is stable for same idea + index', () => {
    const a = classifyLantern('quiet maybe', 0);
    const b = classifyLantern('quiet maybe', 0);
    expect(a).toEqual(b);
    expect(SPECIES).toContain(a.species);
    expect(FUELS).toContain(a.fuel);
    expect(HABITATS).toContain(a.habitat);
    expect(FIELD_NOTES).toContain(a.note);
    expect(a.specimenId).toMatch(/^LT-[0-9A-F]{4}$/);
    expect(a.lumen).toBeGreaterThanOrEqual(1);
    expect(a.lumen).toBeLessThanOrEqual(99);
  });

  it('classifyLantern differs across distinct inputs', () => {
    const a = classifyLantern('quiet maybe', 0);
    const b = classifyLantern('soft assert', 1);
    expect(
      a.species !== b.species ||
        a.fuel !== b.fuel ||
        a.habitat !== b.habitat ||
        a.note !== b.note ||
        a.specimenId !== b.specimenId,
    ).toBe(true);
    expect(a.idea).not.toBe(b.idea);
  });

  it('classifyMany defaults empty list to a quiet maybe', () => {
    const rows = classifyMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.idea).toBe('a quiet maybe');
  });

  it('classifyMany preserves order for multiple ideas', () => {
    const rows = classifyMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.idea)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatTaxonomy includes key markers and metaphor footer', () => {
    const out = formatTaxonomy(['quiet maybe', 'soft assert']);
    expect(out).toContain('LANTERN-TAXONOMY');
    expect(out).toContain('quiet maybe');
    expect(out).toContain('soft assert');
    expect(out).toContain('species:');
    expect(out).toContain('fuel:');
    expect(out).toContain('LT-');
    expect(out).toMatch(/Metaphor only/);
    expect(out).toMatch(/never opens network/i);
  });
});
