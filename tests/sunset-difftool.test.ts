import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'sunset-difftool', 'lib.mjs'),
).href;

const {
  softHash,
  sanitizeText,
  sanitizeLine,
  splitLines,
  buildLcsTable,
  lineDiff,
  wordDiff,
  colorLine,
  pickHorizonNote,
  sunsetDiff,
  formatSunsetDiff,
  DEFAULT_LEFT,
  DEFAULT_RIGHT,
  SUNSET_PALETTE,
  HORIZON_NOTES,
  ANSI_RESET,
} = await import(libUrl);

describe('sunset-difftool product', () => {
  it('sanitizeText defaults empty / non-string to fallback', () => {
    expect(sanitizeText('', 'bay')).toBe('bay');
    expect(sanitizeText('   ', 'bay')).toBe('bay');
    expect(sanitizeText(null as unknown as string, 'bay')).toBe('bay');
    expect(sanitizeText(42 as unknown as string, 'bay')).toBe('bay');
  });

  it('sanitizeText preserves newlines and strips non-printable', () => {
    expect(sanitizeText('a\nb')).toBe('a\nb');
    expect(sanitizeText('hi\x00there')).toBe('hithere');
    expect(sanitizeText('  gold  ')).toBe('  gold  ');
  });

  it('sanitizeLine strips newlines and non-printable', () => {
    expect(sanitizeLine('a\nb')).toBe('a b');
    expect(sanitizeLine('x\x00y')).toBe('xy');
    expect(sanitizeLine(null as unknown as string)).toBe('');
  });

  it('splitLines drops trailing empty from final newline', () => {
    expect(splitLines('a\nb\n')).toEqual(['a', 'b']);
    expect(splitLines('a\nb')).toEqual(['a', 'b']);
    expect(splitLines('')).toEqual([]);
  });

  it('softHash is stable and non-negative', () => {
    expect(softHash('Moreton Bay')).toBe(softHash('Moreton Bay'));
    expect(softHash('a')).toBeGreaterThanOrEqual(0);
    expect(softHash('a')).not.toBe(softHash('b'));
  });

  it('buildLcsTable / lineDiff detect equal removed added', () => {
    const left = ['a', 'b', 'c'];
    const right = ['a', 'x', 'c'];
    const dp = buildLcsTable(left, right);
    expect(dp[3][3]).toBe(2);
    const ops = lineDiff(left, right);
    expect(ops).toEqual([
      { type: 'equal', text: 'a' },
      { type: 'removed', text: 'b' },
      { type: 'added', text: 'x' },
      { type: 'equal', text: 'c' },
    ]);
  });

  it('lineDiff handles empty sides', () => {
    expect(lineDiff([], ['only'])).toEqual([{ type: 'added', text: 'only' }]);
    expect(lineDiff(['only'], [])).toEqual([
      { type: 'removed', text: 'only' },
    ]);
    expect(lineDiff([], [])).toEqual([]);
  });

  it('wordDiff glints changed tokens', () => {
    const ops = wordDiff('pelicans on the sandbank', 'pelicans leave the sandbank');
    const types = ops.map((o: { type: string }) => o.type);
    expect(types).toContain('removed');
    expect(types).toContain('added');
    expect(types).toContain('equal');
  });

  it('colorLine applies palette markers and optional ANSI', () => {
    const plain = colorLine('removed', 'gone', { color: false });
    expect(plain).toBe('- gone');
    const colored = colorLine('added', 'new', { color: true });
    expect(colored).toContain('+ new');
    expect(colored).toContain(SUNSET_PALETTE.added.ansi);
    expect(colored.endsWith(ANSI_RESET)).toBe(true);
  });

  it('pickHorizonNote returns bank entries', () => {
    expect(HORIZON_NOTES).toContain(pickHorizonNote(0));
    expect(HORIZON_NOTES).toContain(pickHorizonNote(99));
  });

  it('sunsetDiff is stable and defaults blanks to bay haikus', () => {
    const a = sunsetDiff('', '');
    const b = sunsetDiff('', '');
    expect(a).toEqual(b);
    expect(a.left).toBe(DEFAULT_LEFT);
    expect(a.right).toBe(DEFAULT_RIGHT);
    expect(a.diffId).toMatch(/^SD-[0-9A-F]{4}$/);
    expect(HORIZON_NOTES).toContain(a.note);
    expect(a.stats.equal + a.stats.removed + a.stats.added).toBe(a.ops.length);
  });

  it('sunsetDiff differs across distinct inputs', () => {
    const a = sunsetDiff('one\ntwo', 'one\nthree');
    const b = sunsetDiff('alpha', 'beta');
    expect(
      a.diffId !== b.diffId ||
        a.stats.removed !== b.stats.removed ||
        a.ops.length !== b.ops.length,
    ).toBe(true);
    expect(a.stats.removed).toBeGreaterThanOrEqual(1);
    expect(a.stats.added).toBeGreaterThanOrEqual(1);
  });

  it('formatSunsetDiff includes palette markers and bay note', () => {
    const out = formatSunsetDiff('hello\nworld', 'hello\nbay', {
      color: false,
    });
    expect(out).toContain('SUNSET-DIFFTOOL');
    expect(out).toContain('SD-');
    expect(out).toContain('bay-glass');
    expect(out).toContain('tide-out');
    expect(out).toContain('gold-lip');
    expect(out).toMatch(/^- world$/m);
    expect(out).toMatch(/^\+ bay$/m);
    expect(out).toContain('→ note:');
    expect(out).toMatch(/Moreton Bay/i);
  });

  it('formatSunsetDiff --words path includes adjacent -/+ pair', () => {
    const out = formatSunsetDiff(
      'pelicans on the sandbank',
      'pelicans leave the sandbank',
      { color: false, words: true },
    );
    expect(out).toContain('- ');
    expect(out).toContain('+ ');
    expect(out).toMatch(/sandbank/);
  });

  it('banks and defaults are non-empty', () => {
    expect(DEFAULT_LEFT.length).toBeGreaterThan(0);
    expect(DEFAULT_RIGHT.length).toBeGreaterThan(0);
    expect(HORIZON_NOTES.length).toBeGreaterThan(0);
    expect(SUNSET_PALETTE.equal.label).toMatch(/bay-glass/);
    expect(SUNSET_PALETTE.removed.label).toMatch(/tide-out/);
    expect(SUNSET_PALETTE.added.label).toMatch(/gold-lip/);
  });
});
