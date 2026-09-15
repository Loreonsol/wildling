import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'dream-diff', 'lib.mjs'),
).href;

const { tokenize, findSharedSymbols, formatDreamDiff } = await import(libUrl);

describe('dream-diff product', () => {
  it('tokenizes into lowercase meaningful symbols and drops stopwords', () => {
    expect(tokenize('I flew Over a Moonlit Ocean!')).toEqual([
      'flew',
      'moonlit',
      'ocean',
    ]);
  });

  it('returns empty array for empty / non-string input', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('   ')).toEqual([]);
    expect(tokenize(null as unknown as string)).toEqual([]);
  });

  it('dedupes repeated symbols within one dream', () => {
    expect(tokenize('door after door after door')).toEqual(['door']);
  });

  it('finds shared symbols and only-A / only-B', () => {
    const r = findSharedSymbols(
      'I flew over a moonlit ocean',
      'A whale swam under the moon near the ocean',
    );
    expect(r.shared).toContain('ocean');
    expect(r.onlyA).toContain('flew');
    expect(r.onlyB).toContain('whale');
    expect(r.symbolsA.length).toBeGreaterThan(0);
    expect(r.symbolsB.length).toBeGreaterThan(0);
  });

  it('formatDreamDiff includes shared and only sections', () => {
    const report = formatDreamDiff(
      'cats chasing stars',
      'dogs chasing the moon',
    );
    expect(report).toMatch(/Shared/i);
    expect(report).toMatch(/Only in A/i);
    expect(report).toMatch(/Only in B/i);
    expect(report).toContain('chasing');
    expect(report).toContain('cats');
    expect(report).toContain('dogs');
  });
});
