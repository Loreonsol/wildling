import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'regex-familiar', 'lib.mjs'),
).href;

const {
  sanitizeIntent,
  summonFamiliar,
  formatFamiliar,
  FAMILIAR_NAMES,
  PATTERN_SHAPES,
  DISPOSITIONS,
  BINDINGS,
  PROPHECIES,
} = await import(libUrl);

describe('regex-familiar product', () => {
  it('sanitizeIntent defaults empty / non-string', () => {
    expect(sanitizeIntent('')).toBe('a pattern of kindness');
    expect(sanitizeIntent('   ')).toBe('a pattern of kindness');
    expect(sanitizeIntent(null as unknown as string)).toBe(
      'a pattern of kindness',
    );
    expect(sanitizeIntent(42 as unknown as string)).toBe(
      'a pattern of kindness',
    );
  });

  it('sanitizeIntent trims and collapses spaces', () => {
    expect(sanitizeIntent('  emails   of  kindness  ')).toBe(
      'emails of kindness',
    );
  });

  it('summonFamiliar is stable for same intent', () => {
    const a = summonFamiliar('emails of kindness');
    const b = summonFamiliar('emails of kindness');
    expect(a).toEqual(b);
    expect(FAMILIAR_NAMES).toContain(a.name);
    expect(PATTERN_SHAPES).toContain(a.pattern);
    expect(DISPOSITIONS).toContain(a.disposition);
    expect(BINDINGS).toContain(a.binding);
    expect(PROPHECIES).toContain(a.prophecy);
    expect(a.sigil).toMatch(/^RF-[0-9A-F]{4}$/);
  });

  it('summonFamiliar differs across distinct intents', () => {
    const a = summonFamiliar('emails of kindness');
    const b = summonFamiliar('trailing spaces please');
    expect(
      a.name !== b.name ||
        a.pattern !== b.pattern ||
        a.disposition !== b.disposition ||
        a.binding !== b.binding ||
        a.prophecy !== b.prophecy ||
        a.sigil !== b.sigil,
    ).toBe(true);
    expect(a.preview).not.toBe(b.preview);
  });

  it('formatFamiliar includes key markers and metaphor footer', () => {
    const card = formatFamiliar('emails of kindness');
    expect(card).toContain('REGEX FAMILIAR');
    expect(card).toContain('INTENT:');
    expect(card).toContain('NAME:');
    expect(card).toContain('SIGIL:');
    expect(card).toContain('PATTERN:');
    expect(card).toContain('MOOD:');
    expect(card).toContain('BINDING:');
    expect(card).toContain('ORACLE:');
    expect(card).toMatch(/Metaphor only/);
    expect(card).toMatch(/never matches/i);
  });
});
