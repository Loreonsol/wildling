import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'jar-of-errors', 'lib.mjs'),
).href;

const {
  softenMessage,
  sealError,
  sealMany,
  formatJarLabel,
  formatJarReport,
  SOFTEN_MAP,
} = await import(libUrl);

describe('jar-of-errors product', () => {
  it('softens known harsh words via fixed map', () => {
    const cute = softenMessage('Fatal error: crash');
    expect(cute.toLowerCase()).toContain(SOFTEN_MAP.fatal);
    expect(cute.toLowerCase()).toContain(SOFTEN_MAP.error);
    expect(cute.toLowerCase()).toContain(SOFTEN_MAP.crash);
  });

  it('returns empty hush for empty / non-string input', () => {
    expect(softenMessage('')).toBe('(empty hush)');
    expect(softenMessage('   ')).toBe('(empty hush)');
    expect(softenMessage(null as unknown as string)).toBe('(empty hush)');
    expect(softenMessage(42 as unknown as string)).toBe('(empty hush)');
  });

  it('leaves unknown tokens unchanged', () => {
    expect(softenMessage('hello world')).toBe('hello world');
  });

  it('sealError builds id, cute, sealedAt (stable id for same input)', () => {
    const now = '2026-09-15T06:18:00.000Z';
    const a = sealError('bug overflow', { now });
    const b = sealError('bug overflow', { now });
    expect(a.id).toBe(b.id);
    expect(a.id).toMatch(/^jar-/);
    expect(a.original).toBe('bug overflow');
    expect(a.cute.toLowerCase()).toContain(SOFTEN_MAP.bug);
    expect(a.sealedAt).toBe(now);
  });

  it('sealMany preserves order and skips non-strings', () => {
    const entries = sealMany(
      ['Timeout failed', null as unknown as string, 'Null pointer'],
      { now: '2026-09-15T06:18:00.000Z' },
    );
    expect(entries).toHaveLength(2);
    expect(entries[0].original).toBe('Timeout failed');
    expect(entries[1].original).toBe('Null pointer');
  });

  it('formatJarLabel includes care instructions', () => {
    const label = formatJarLabel();
    expect(label).toMatch(/JAR OF ERRORS/i);
    expect(label).toMatch(/lid/i);
    expect(label).toMatch(/forgive/i);
  });

  it('formatJarReport includes label and sealed entries', () => {
    const report = formatJarReport(['Panic: abort'], {
      now: '2026-09-15T06:18:00.000Z',
    });
    expect(report).toMatch(/JAR OF ERRORS/i);
    expect(report).toMatch(/Sealed count: 1/);
    expect(report).toMatch(/Inside the jar/);
    expect(report).toContain('Panic: abort');
    expect(report.toLowerCase()).toContain(SOFTEN_MAP.panic);
  });

  it('empty jar report is gentle', () => {
    const report = formatJarReport([]);
    expect(report).toMatch(/empty/i);
    expect(report).toMatch(/Sealed count: 0/);
  });
});
