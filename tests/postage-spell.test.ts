import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'postage-spell', 'lib.mjs'),
).href;

const {
  sanitizeLetter,
  composeSpell,
  formatPostageSpell,
  STAMPS,
  ROUTES,
  CARRIER_MUSES,
  INCANTATIONS,
} = await import(libUrl);

describe('postage-spell product', () => {
  it('sanitizeLetter defaults empty / non-string', () => {
    expect(sanitizeLetter('')).toBe('a letter to tomorrow');
    expect(sanitizeLetter('   ')).toBe('a letter to tomorrow');
    expect(sanitizeLetter(null as unknown as string)).toBe(
      'a letter to tomorrow',
    );
    expect(sanitizeLetter(42 as unknown as string)).toBe(
      'a letter to tomorrow',
    );
  });

  it('sanitizeLetter trims and collapses spaces', () => {
    expect(sanitizeLetter('  dear   future,  ')).toBe('dear future,');
  });

  it('composeSpell is stable for same letter', () => {
    const a = composeSpell('dear yesterday,');
    const b = composeSpell('dear yesterday,');
    expect(a).toEqual(b);
    expect(STAMPS).toContain(a.stamp);
    expect(ROUTES).toContain(a.route);
    expect(CARRIER_MUSES).toContain(a.carrier);
    expect(INCANTATIONS).toContain(a.incantation);
  });

  it('arrival is before posted', () => {
    const spell = composeSpell('dear future,');
    expect(Date.parse(spell.arrival)).toBeLessThan(Date.parse(spell.posted));
  });

  it('composeSpell differs across distinct letters', () => {
    const a = composeSpell('dear yesterday,');
    const b = composeSpell('hello tomorrow!');
    expect(a.stamp !== b.stamp || a.route !== b.route || a.carrier !== b.carrier || a.incantation !== b.incantation || a.posted !== b.posted).toBe(
      true,
    );
    expect(a.preview).not.toBe(b.preview);
  });

  it('formatPostageSpell includes key markers and metaphor footer', () => {
    const slip = formatPostageSpell('dear future,');
    expect(slip).toContain('POSTAGE SPELL');
    expect(slip).toContain('LETTER:');
    expect(slip).toContain('STAMP:');
    expect(slip).toContain('ARRIVAL:');
    expect(slip).toContain('POSTED:');
    expect(slip).toContain('INCANTATION:');
    expect(slip).toMatch(/Metaphor only/);
    expect(slip).toMatch(/never mails/i);
  });
});
