import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  DIRECTIONS,
  FakePlanner,
  buildPlan,
  loadCustomDirections,
  pickDirection,
  preferOpenIssue,
} from '../src/fakePlanner.js';
import type { Direction } from '../src/types.js';
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
  it('exposes the safe micro-directions menu', () => {
    expect(DIRECTIONS).toEqual([
      'version',
      'journal',
      'util',
      'curiosities',
      'ritual',
      'haiku',
      'motto',
      'changelog',
      'palette',
      'deck',
      'sketch',
      'quest',
      'mutate',
    ]);
  });

  it('pickDirection is deterministic for a given context', () => {
    const a = pickDirection(baseCtx());
    const b = pickDirection(baseCtx());
    expect(a).toBe(b);
    expect([...DIRECTIONS, 'custom']).toContain(a);
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
  });

  it('buildPlan covers every menu direction with revert metadata', () => {
    const ctx = baseCtx();
    for (const direction of DIRECTIONS) {
      const plan = buildPlan(ctx, direction as Direction);
      // mutate may be the plan; custom fallback only when direction==='custom'
      expect(plan.summary).toMatch(/Wander:/);
      expect(plan.commitMessage).toMatch(/^evolve\(/);
      expect(plan.targetPath.startsWith(root)).toBe(true);
      expect(plan.newContents.length).toBeGreaterThan(0);

      if (direction === 'version') {
        expect(plan.direction).toBe('version');
        expect(plan.targetPath).toContain('version.ts');
        expect(plan.previousContents).not.toBeNull();
        const match = plan.newContents.match(
          /VERSION\s*=\s*'(\d+)\.(\d+)\.(\d+)'/,
        );
        expect(match).not.toBeNull();
        const currentPatch = VERSION.split('.')[2]!;
        expect(Number(match![3])).toBe(Number(currentPatch) + 1);
      }

      if (direction === 'journal') {
        expect(plan.direction).toBe('journal');
        expect(plan.targetPath).toContain('journal');
        expect(plan.previousContents).toBeNull();
        expect(plan.newContents).toMatch(/Wander/);
      }

      if (direction === 'util') {
        expect(plan.direction).toBe('util');
        expect(plan.targetPath).toContain('utils.ts');
        expect(plan.previousContents).not.toBeNull();
        expect(plan.newContents).toMatch(/export function spark/);
      }

      if (direction === 'curiosities') {
        expect(plan.direction).toBe('curiosities');
        expect(plan.targetPath).toContain('README.md');
        expect(plan.previousContents).not.toBeNull();
        expect(plan.newContents).toContain('## Curiosities');
        expect(plan.newContents).toMatch(/^- \[\d+\] /m);
      }

      if (direction === 'ritual') {
        expect(plan.direction).toBe('ritual');
        expect(plan.targetPath).toContain('RITUAL.md');
        expect(plan.newContents).toMatch(/Breathe|Touch|Name|Leave|One file/);
      }

      if (direction === 'haiku') {
        expect(plan.direction).toBe('haiku');
        expect(plan.targetPath).toContain(join('poems', 'haikus.md'));
        expect(plan.newContents).toMatch(/^## \d+/m);
      }

      if (direction === 'motto') {
        expect(plan.direction).toBe('motto');
        expect(plan.targetPath).toContain('motto.txt');
        expect(plan.newContents).toMatch(/^#\d+ — /);
      }

      if (direction === 'changelog') {
        expect(plan.direction).toBe('changelog');
        expect(plan.targetPath).toContain('CHANGELOG.md');
        expect(plan.newContents).toContain('## Unreleased');
        expect(plan.newContents).toMatch(/^- /m);
      }

      if (direction === 'palette') {
        expect(plan.direction).toBe('palette');
        expect(plan.targetPath).toContain('palette.md');
        expect(plan.newContents).toMatch(/^- #[0-9a-fA-F]+ → /m);
      }

      if (direction === 'deck') {
        expect(plan.direction).toBe('deck');
        expect(plan.targetPath).toContain(join('artifacts'));
        expect(plan.targetPath).toMatch(/\.md$/);
        expect(plan.newContents).toContain('**Prompt:**');
        expect(plan.extras?.length).toBe(1);
        expect(plan.extras![0]!.targetPath).toContain(
          join('ideas', 'used.json'),
        );
      }

      if (direction === 'sketch') {
        expect(plan.direction).toBe('sketch');
        expect(plan.targetPath).toContain(join('sketches'));
        expect(plan.targetPath).toMatch(/\d{8}-.+\.md$/);
        expect(plan.previousContents).toBeNull();
        expect(plan.newContents).toMatch(/Sketch/);
      }

      if (direction === 'quest') {
        expect(plan.direction).toBe('quest');
        expect(plan.targetPath).toContain(join('quests'));
        expect(plan.newContents).toMatch(/Quest/);
      }

      if (direction === 'mutate') {
        expect(plan.direction).toBe('mutate');
        expect(plan.targetPath).toContain(
          join('ideas', 'custom-directions.json'),
        );
        const parsed = JSON.parse(plan.newContents) as unknown[];
        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed.length).toBeGreaterThan(0);
        const last = parsed[parsed.length - 1] as {
          id: string;
          folder: string;
          template: string;
        };
        expect(last.id).toMatch(/^[a-z0-9-]+$/);
        expect(last.folder).toBeTruthy();
        expect(last.template).toContain('{{');
      }
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
    expect(text.toLowerCase()).toMatch(/surprise/);
    expect(text.toLowerCase()).toMatch(/boredom is a bug/);
  });
});

describe('idea deck', () => {
  it('ships 60–100 prompts in ideas/deck.json', () => {
    const path = join(root, 'ideas', 'deck.json');
    expect(existsSync(path)).toBe(true);
    const deck = JSON.parse(readFileSync(path, 'utf8')) as Array<{
      id: string;
      prompt: string;
    }>;
    expect(deck.length).toBeGreaterThanOrEqual(60);
    expect(deck.length).toBeLessThanOrEqual(100);
    const ids = new Set(deck.map((d) => d.id));
    expect(ids.size).toBe(deck.length);
    for (const idea of deck) {
      expect(idea.id).toMatch(/^[a-z0-9-]+$/);
      expect(idea.prompt.length).toBeGreaterThan(10);
    }
  });

  it('keeps used.json separate so deck.json stays pristine', () => {
    const usedPath = join(root, 'ideas', 'used.json');
    expect(existsSync(usedPath)).toBe(true);
    const used = JSON.parse(readFileSync(usedPath, 'utf8')) as Record<
      string,
      unknown
    >;
    expect(typeof used).toBe('object');
    // deck plan stamps used via extras, not by mutating deck.json
    const plan = buildPlan(baseCtx(), 'deck');
    expect(plan.extras?.[0]?.targetPath).toContain('used.json');
    expect(plan.targetPath).not.toContain('deck.json');
  });
});

describe('sketches', () => {
  it('always proposes a new sketches/ file path', () => {
    const plan = buildPlan(baseCtx(), 'sketch');
    expect(plan.previousContents).toBeNull();
    expect(plan.targetPath).toMatch(/sketches[/\\]\d{8}-.+\.md$/);
  });
});

describe('quests / preferOpenIssue', () => {
  it('preferOpenIssue returns null or a quest plan safely', () => {
    const result = preferOpenIssue(baseCtx());
    // No open issues right now → null; if issues appear later, still a quest.
    if (result === null) {
      expect(result).toBeNull();
    } else {
      expect(result.direction).toBe('quest');
      expect(result.targetPath).toContain('quests');
      expect(result.newContents).toMatch(/Quest/);
    }
  });

  it('quest without issues writes a self-quest stub', () => {
    const plan = buildPlan(baseCtx(), 'quest');
    expect(plan.direction).toBe('quest');
    expect(plan.targetPath).toContain('quests');
    // With no open issues, expect self-quest naming.
    if (!plan.targetPath.includes('issue-')) {
      expect(plan.targetPath).toMatch(/self-\d+\.md$/);
    }
  });
});

describe('mutate + custom directions', () => {
  it('mutate appends a safe {id,folder,template} entry', () => {
    const before = loadCustomDirections(root);
    const plan = buildPlan(baseCtx(), 'mutate');
    expect(plan.direction).toBe('mutate');
    const next = JSON.parse(plan.newContents) as Array<{
      id: string;
      folder: string;
      template: string;
    }>;
    expect(next.length).toBe(before.length + 1);
    const invented = next[next.length - 1]!;
    expect(invented.id).toMatch(/^[a-z0-9-]+$/);
    expect(invented.template).not.toMatch(/api[_-]?key|secret|token/i);
    expect(invented.template).toMatch(/\{\{/);
  });

  it('custom-directions.json starts as a valid array', () => {
    const path = join(root, 'ideas', 'custom-directions.json');
    expect(existsSync(path)).toBe(true);
    const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
    expect(Array.isArray(raw)).toBe(true);
  });

  it('buildPlan(custom) invents via mutate when menu is empty', () => {
    const customs = loadCustomDirections(root);
    const plan = buildPlan(baseCtx(), 'custom');
    if (customs.length === 0) {
      expect(plan.direction).toBe('mutate');
    } else {
      expect(plan.direction).toBe('custom');
      expect(plan.targetPath).toContain(join('custom', customs[0]!.id));
      expect(plan.customId).toBe(customs[0]!.id);
    }
  });
});

describe('docs menu', () => {
  it('README lists deck, sketch, quest, and mutate', () => {
    const text = readFileSync(join(root, 'README.md'), 'utf8');
    expect(text).toMatch(/`deck`/);
    expect(text).toMatch(/`sketch`/);
    expect(text).toMatch(/`quest`/);
    expect(text).toMatch(/`mutate`/);
  });
});
