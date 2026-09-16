import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'bug-parade', 'lib.mjs')).href;

const {
  sanitizeBug,
  pickBugKind,
  pickRoute,
  marchBug,
  marchMany,
  formatParade,
  BUG_KINDS,
  ROUTES,
  FORMATIONS,
  CHANTS,
  PARADE_NOTES,
} = await import(libUrl);

describe('bug-parade product', () => {
  it('sanitizeBug defaults empty / non-string to legacy codebase', () => {
    expect(sanitizeBug('')).toBe('legacy codebase');
    expect(sanitizeBug('   ')).toBe('legacy codebase');
    expect(sanitizeBug(null as unknown as string)).toBe('legacy codebase');
    expect(sanitizeBug(42 as unknown as string)).toBe('legacy codebase');
  });

  it('sanitizeBug normalizes whitespace and strips non-printable', () => {
    expect(sanitizeBug('  null   pointer  ')).toBe('null pointer');
    expect(sanitizeBug('bug\x00leak')).toBe('bugleak');
  });

  it('pickBugKind honors null / race / leak / flaky / stack / heisen / goto / off-by hints', () => {
    expect(pickBugKind('null pointer crash', 0)).toBe('null-pointer moth');
    expect(pickBugKind('race condition deadlock', 1)).toBe('race-condition cricket');
    expect(pickBugKind('memory leak oom', 2)).toBe('memory-leak snail');
    expect(pickBugKind('flaky test suite', 3)).toBe('flaky-test flea');
    expect(pickBugKind('stack overflow recursion', 4)).toBe('stack-overflow locust');
    expect(pickBugKind('heisenbug observer', 5)).toBe('heisenbug firefly');
    expect(pickBugKind('legacy goto cobol', 6)).toBe('legacy-goto cockroach');
    expect(pickBugKind('off-by-one fencepost', 7)).toBe('off-by-one beetle');
    expect(BUG_KINDS).toContain(pickBugKind('generic glitch', 8));
  });

  it('pickRoute honors spaghetti / circular / monolith / main / refactor hints', () => {
    expect(pickRoute('spaghetti todo mess', 0)).toBe(
      'through the spaghetti alley of forgotten TODOs',
    );
    expect(pickRoute('circular import cycle', 1)).toBe(
      'across the brittle bridge of circular imports',
    );
    expect(pickRoute('monolith roundabout', 2)).toBe(
      'around the monolith roundabout (three times)',
    );
    expect(pickRoute('main god-object plaza', 3)).toBe(
      'down Main Street past the god-object plaza',
    );
    expect(pickRoute('refactor escape hatch', 4)).toBe(
      'out the emergency exit marked refactor-later',
    );
    expect(ROUTES).toContain(pickRoute('generic hallway', 5));
  });

  it('marchBug is stable for same bug + index', () => {
    const a = marchBug('null pointer plaza', 0);
    const b = marchBug('null pointer plaza', 0);
    expect(a).toEqual(b);
    expect(a.kind).toBe('null-pointer moth');
    expect(FORMATIONS).toContain(a.formation);
    expect(CHANTS).toContain(a.chant);
    expect(PARADE_NOTES).toContain(a.note);
    expect(ROUTES).toContain(a.route);
    expect(a.paradeId).toMatch(/^BP-[0-9A-F]{4}$/);
  });

  it('marchBug differs across distinct inputs', () => {
    const a = marchBug('alpha null pointer', 0);
    const b = marchBug('beta race condition', 1);
    expect(
      a.kind !== b.kind ||
        a.paradeId !== b.paradeId ||
        a.route !== b.route ||
        a.formation !== b.formation ||
        a.chant !== b.chant ||
        a.note !== b.note,
    ).toBe(true);
  });

  it('marchMany defaults empty list to legacy codebase', () => {
    const rows = marchMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.bug).toBe('legacy codebase');
  });

  it('marchMany preserves order for multiple bugs', () => {
    const rows = marchMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.bug)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatParade includes key markers and joke footer', () => {
    const out = formatParade(['null pointer plaza', 'memory leak alley']);
    expect(out).toContain('BUG-PARADE');
    expect(out).toContain('BP-');
    expect(out).toContain('→ route:');
    expect(out).toContain('→ formation:');
    expect(out).toContain('→ chant:');
    expect(out).toContain('→ note:');
    expect(out).toMatch(/Joke parade only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(BUG_KINDS.length).toBeGreaterThan(0);
    expect(ROUTES.length).toBeGreaterThan(0);
    expect(FORMATIONS.length).toBeGreaterThan(0);
    expect(CHANTS.length).toBeGreaterThan(0);
    expect(PARADE_NOTES.length).toBeGreaterThan(0);
  });
});
