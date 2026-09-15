import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'lullaby-compiler', 'lib.mjs'),
).href;

const {
  tokenizeSource,
  toLullabySyllables,
  compileToLullaby,
  formatLullabyReport,
  LULLABY_MAP,
} = await import(libUrl);

describe('lullaby-compiler product', () => {
  it('tokenizes alphanumeric identifiers/keywords and drops empties', () => {
    expect(tokenizeSource('const soft = true;')).toEqual([
      'const',
      'soft',
      'true',
    ]);
    expect(tokenizeSource('foo_bar42 + baz')).toEqual(['foo_bar42', 'baz']);
  });

  it('returns empty array for empty / non-string input', () => {
    expect(tokenizeSource('')).toEqual([]);
    expect(tokenizeSource('   ')).toEqual([]);
    expect(tokenizeSource(';;;')).toEqual([]);
    expect(tokenizeSource(null as unknown as string)).toEqual([]);
    expect(tokenizeSource(42 as unknown as string)).toEqual([]);
  });

  it('maps known tokens via fixed lullaby map', () => {
    const syllables = toLullabySyllables(['const', 'return', 'throw']);
    expect(syllables[0]).toBe(LULLABY_MAP.const);
    expect(syllables[1]).toBe(LULLABY_MAP.return);
    expect(syllables[2]).toBe(LULLABY_MAP.throw);
  });

  it('uses soft fallback for unknown tokens (stable)', () => {
    const a = toLullabySyllables(['zzzzUniqueToken']);
    const b = toLullabySyllables(['zzzzUniqueToken']);
    expect(a).toEqual(b);
    expect(a[0]).toBeTruthy();
    expect(typeof a[0]).toBe('string');
  });

  it('compileToLullaby returns multi-line lullaby from source', () => {
    const song = compileToLullaby(
      'function sleep() { const soft = true; return soft; }',
    );
    expect(song).toMatch(/softly|quietly|rest|yes-dear|cradle|gentle|moon|la/i);
    expect(song.split('\n').length).toBeGreaterThanOrEqual(1);
    expect(compileToLullaby('')).toMatch(/quiet/i);
  });

  it('formatLullabyReport includes title and lullaby body', () => {
    const report = formatLullabyReport('const dream = null');
    expect(report).toMatch(/lullaby-compiler/i);
    expect(report).toMatch(/Lullaby/i);
    expect(report).toMatch(/Tokens hummed/i);
    expect(report).toContain(LULLABY_MAP.const);
  });

  it('does not execute code — throw/eval stay lullaby text', () => {
    const evil = 'throw new Error("boom"); eval("process.exit(1)")';
    const report = formatLullabyReport(evil);
    expect(report).toMatch(/lullaby-compiler/i);
    expect(report).toContain(LULLABY_MAP.throw);
    // If code had executed, this test process would have exited / thrown.
    expect(report.length).toBeGreaterThan(20);
  });
});
