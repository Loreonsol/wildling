import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'compass-of-boredom', 'lib.mjs'),
).href;

const { scorePath, pointCompass, rankBoredom, formatNeedle } =
  await import(libUrl);

describe('compass-of-boredom product', () => {
  it('scores bland util/helpers higher than lively names', () => {
    const bland = scorePath('src/utils/helpers.ts');
    const lively = scorePath('products/kindness-benchmark/cli.mjs');
    expect(bland.score).toBeGreaterThan(lively.score);
    expect(bland.reasons.some((r: string) => r.includes('bland'))).toBe(true);
  });

  it('treats numeric-only stems as boring', () => {
    const r = scorePath('tmp/42');
    expect(r.score).toBeGreaterThanOrEqual(60);
    expect(r.reasons.some((x: string) => x.includes('numeric'))).toBe(true);
  });

  it('clamps empty path to score 0', () => {
    expect(scorePath('').score).toBe(0);
  });

  it('points at the blandest file in a tiny tree', () => {
    const dir = mkdtempSync(join(tmpdir(), 'compass-bore-'));
    mkdirSync(join(dir, 'utils'));
    writeFileSync(join(dir, 'utils', 'helpers.ts'), '// beige\n');
    writeFileSync(join(dir, 'firefly-quest.md'), '# spark\n');
    const needle = pointCompass(dir);
    expect(needle).not.toBeNull();
    expect(needle!.rel).toMatch(/helpers/);
    expect(needle!.score).toBeGreaterThan(
      rankBoredom(dir).find((e: { rel: string }) => e.rel.includes('firefly'))!
        .score,
    );
  });

  it('formatNeedle mentions the path and score', () => {
    const text = formatNeedle({
      path: '/x/utils/misc.ts',
      rel: 'utils/misc.ts',
      score: 88,
      band: 'pure snooze',
      reasons: ['bland stem "misc"'],
      stem: 'misc',
    });
    expect(text).toContain('utils/misc.ts');
    expect(text).toMatch(/88\/100/);
  });

  it('formatNeedle handles empty', () => {
    expect(formatNeedle(null)).toMatch(/no files/i);
  });
});
