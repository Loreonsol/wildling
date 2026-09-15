import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'kindness-benchmark', 'lib.mjs'),
).href;

const { tokenize, scoreName, formatReport } = await import(libUrl);

describe('kindness-benchmark product', () => {
  it('tokenizes camelCase and snake_case', () => {
    expect(tokenize('softAssert')).toEqual(['soft', 'assert']);
    expect(tokenize('kill_all_processes')).toEqual([
      'kill',
      'all',
      'processes',
    ]);
  });

  it('scores gentle names higher than harsh ones', () => {
    const soft = scoreName('softHug');
    const harsh = scoreName('killAll');
    expect(soft.score).toBeGreaterThan(harsh.score);
    expect(soft.hits.kind.length).toBeGreaterThan(0);
    expect(harsh.hits.harsh.length).toBeGreaterThan(0);
  });

  it('does not false-positive die inside identify', () => {
    const r = scoreName('identify');
    expect(r.hits.harsh).not.toContain('die');
  });

  it('clamps empty input to score 0', () => {
    expect(scoreName('').score).toBe(0);
    expect(scoreName('   ').tokens).toEqual([]);
  });

  it('formatReport mentions the name and score', () => {
    const r = scoreName('mendGently');
    const text = formatReport('mendGently', r);
    expect(text).toContain('mendGently');
    expect(text).toMatch(/score: \d+\/100/);
  });
});
