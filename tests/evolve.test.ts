import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  DIRECTIONS,
  FakePlanner,
  pickDirection,
} from '../src/fakePlanner.js';
import { clamp, identity } from '../src/utils.js';
import { VERSION } from '../src/version.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function baseCtx() {
  return {
    northStar: 'free-range',
    latestJournal: 'bootstrap',
    version: VERSION,
    rootDir: root,
  };
}

describe('VERSION', () => {
  it('is semver-ish (major.minor.patch)', () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe('utils', () => {
  it('identity returns the same value', () => {
    expect(identity(42)).toBe(42);
    expect(identity('wild')).toBe('wild');
  });

  it('clamp keeps numbers in range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe('FakePlanner direction rotation', () => {
  it('exposes the four safe micro-directions', () => {
    expect(DIRECTIONS).toEqual([
      'version',
      'journal',
      'util',
      'curiosities',
    ]);
  });

  it('pickDirection is deterministic for a given context', () => {
    const a = pickDirection(baseCtx());
    const b = pickDirection(baseCtx());
    expect(a).toBe(b);
    expect(DIRECTIONS).toContain(a);
  });

  it('propose returns a plan matching the picked direction', async () => {
    const planner = new FakePlanner();
    const ctx = baseCtx();
    const expected = pickDirection(ctx);
    const plan = await planner.propose(ctx);

    expect(plan.direction).toBe(expected);
    expect(plan.summary).toMatch(/Wander:/);
    expect(plan.commitMessage).toMatch(/^evolve\(/);
    expect(plan.targetPath.startsWith(root)).toBe(true);
    expect(plan.newContents.length).toBeGreaterThan(0);

    if (plan.direction === 'version') {
      expect(plan.targetPath).toContain('version.ts');
      const match = plan.newContents.match(
        /VERSION\s*=\s*'(\d+)\.(\d+)\.(\d+)'/,
      );
      expect(match).not.toBeNull();
      const currentPatch = VERSION.split('.')[2]!;
      expect(Number(match![3])).toBe(Number(currentPatch) + 1);
    }

    if (plan.direction === 'journal') {
      expect(plan.targetPath).toContain('journal');
      expect(plan.previousContents).toBeNull();
      expect(plan.newContents).toMatch(/Wander/);
    }

    if (plan.direction === 'util') {
      expect(plan.targetPath).toContain('utils.ts');
      expect(plan.newContents).toMatch(/export function spark/);
    }

    if (plan.direction === 'curiosities') {
      expect(plan.targetPath).toContain('README.md');
      expect(plan.newContents).toContain('## Curiosities');
      expect(plan.newContents).toMatch(/^- \[\d+\] /m);
    }
  });

  it('can parse the on-disk version.ts', () => {
    const text = readFileSync(join(root, 'src', 'version.ts'), 'utf8');
    expect(text).toContain(`VERSION = '${VERSION}'`);
  });

  it('README has a Curiosities section for wander targets', () => {
    const text = readFileSync(join(root, 'README.md'), 'utf8');
    expect(text).toContain('## Curiosities');
  });

  it('NORTH_STAR declares free-range choose-your-own-direction', () => {
    const text = readFileSync(join(root, 'NORTH_STAR.md'), 'utf8');
    expect(text.toLowerCase()).toMatch(/free-range|chooses? its own direction/);
    expect(text.toLowerCase()).toMatch(/no secrets/);
    expect(text.toLowerCase()).toMatch(/revert/);
  });
});
