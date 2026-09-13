import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Direction, Plan, Planner, PlannerContext } from './types.js';

const DIRECTIONS: readonly Direction[] = [
  'version',
  'journal',
  'util',
  'curiosities',
] as const;

/**
 * Offline free-range planner — no API keys, no spend.
 *
 * Each propose() picks ONE safe micro-improvement by rotating among:
 *   version      → bump patch in src/version.ts
 *   journal      → append a short evolve note under journal/
 *   util         → add a tiny pure helper to src/utils.ts
 *   curiosities  → extend the "## Curiosities" list in README.md
 *
 * Direction index is deterministic from (patch + journal file count + util
 * export count + curiosity bullet count) so offline CI stays stable without
 * randomness or network, yet consecutive successful evolves tend to wander.
 */
export class FakePlanner implements Planner {
  async propose(ctx: PlannerContext): Promise<Plan> {
    const direction = pickDirection(ctx);
    switch (direction) {
      case 'version':
        return planVersionBump(ctx);
      case 'journal':
        return planJournalNote(ctx);
      case 'util':
        return planUtilAppend(ctx);
      case 'curiosities':
        return planCuriosity(ctx);
      default: {
        const _exhaustive: never = direction;
        throw new Error(`FakePlanner: unknown direction ${_exhaustive}`);
      }
    }
  }
}

export function pickDirection(ctx: PlannerContext): Direction {
  const patch = Number(ctx.version.split('.')[2] ?? 0);
  const journals = listJournalFiles(ctx.rootDir).length;
  const utils = countUtilExports(ctx.rootDir);
  const curiosities = countCuriosityBullets(ctx.rootDir);
  const seed = patch + journals + utils + curiosities;
  return DIRECTIONS[seed % DIRECTIONS.length]!;
}

export { DIRECTIONS };

function listJournalFiles(root: string): string[] {
  const dir = join(root, 'journal');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

function countUtilExports(root: string): number {
  const path = join(root, 'src', 'utils.ts');
  if (!existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8');
  return (text.match(/^export function /gm) ?? []).length;
}

function countCuriosityBullets(root: string): number {
  const path = join(root, 'README.md');
  if (!existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8');
  const section = text.split('## Curiosities')[1] ?? '';
  const beforeNext = section.split(/\n## /)[0] ?? '';
  return (beforeNext.match(/^- /gm) ?? []).length;
}

function planVersionBump(ctx: PlannerContext): Plan {
  const targetPath = join(ctx.rootDir, 'src', 'version.ts');
  const current = readFileSync(targetPath, 'utf8');
  const match = current.match(/VERSION\s*=\s*['"](\d+)\.(\d+)\.(\d+)['"]/);
  if (!match) {
    throw new Error('FakePlanner: could not parse VERSION in src/version.ts');
  }
  const [, major, minor, patch] = match;
  const next = `${major}.${minor}.${Number(patch) + 1}`;
  const newContents = current.replace(
    /VERSION\s*=\s*['"]\d+\.\d+\.\d+['"]/,
    `VERSION = '${next}'`,
  );
  return {
    direction: 'version',
    summary: `Wander:version — bump ${major}.${minor}.${patch} → ${next}`,
    targetPath,
    newContents,
    commitMessage: `evolve(version): bump to ${next}`,
    previousContents: current,
  };
}

function planJournalNote(ctx: PlannerContext): Plan {
  const existing = listJournalFiles(ctx.rootDir);
  const nextNum = existing.length;
  const stamp = String(nextNum).padStart(4, '0');
  const filename = `${stamp}-wander.md`;
  const targetPath = join(ctx.rootDir, 'journal', filename);
  const newContents = `# Journal ${stamp} — Wander

**Date:** ${new Date().toISOString().slice(0, 10)}
**Actor:** FakePlanner
**Direction:** journal

## Note

Another small step in the open. Version ${ctx.version}. No secrets, no spend, no harm.
`;
  return {
    direction: 'journal',
    summary: `Wander:journal — write ${filename}`,
    targetPath,
    newContents,
    commitMessage: `evolve(journal): add ${filename}`,
    previousContents: null,
  };
}

function planUtilAppend(ctx: PlannerContext): Plan {
  const targetPath = join(ctx.rootDir, 'src', 'utils.ts');
  const current = readFileSync(targetPath, 'utf8');
  const n = countUtilExports(ctx.rootDir);
  const name = `spark${n}`;
  const snippet = `
/** Free-range spark #${n}: reverse a string (harmless playground). */
export function ${name}(s: string): string {
  return [...s].reverse().join('');
}
`;
  const newContents = current.endsWith('\n')
    ? current + snippet.trimStart()
    : current + '\n' + snippet.trimStart();
  return {
    direction: 'util',
    summary: `Wander:util — add ${name}()`,
    targetPath,
    newContents,
    commitMessage: `evolve(util): add ${name}`,
    previousContents: current,
  };
}

function planCuriosity(ctx: PlannerContext): Plan {
  const targetPath = join(ctx.rootDir, 'README.md');
  const current = readFileSync(targetPath, 'utf8');
  if (!current.includes('## Curiosities')) {
    throw new Error('FakePlanner: README.md missing ## Curiosities section');
  }
  const n = countCuriosityBullets(ctx.rootDir);
  const ideas = [
    'What if journals had weather?',
    'Could utils learn a haiku helper?',
    'Try a README emoji that means "wandered today"',
    'Invent a one-line ritual before each evolve',
    'Map directions to colors for the next README pass',
  ];
  const idea = ideas[n % ideas.length]!;
  const bullet = `- [${n}] ${idea}`;
  // Insert before the next ## after Curiosities, or at end of that section.
  const marker = '## Curiosities';
  const idx = current.indexOf(marker);
  const after = current.slice(idx + marker.length);
  const nextHeading = after.search(/\n## /);
  let newContents: string;
  if (nextHeading === -1) {
    const base = current.trimEnd();
    newContents = `${base}\n${bullet}\n`;
  } else {
    const insertAt = idx + marker.length + nextHeading;
    // Find last bullet area: insert just before the next heading.
    const before = current.slice(0, insertAt).trimEnd();
    const rest = current.slice(insertAt);
    newContents = `${before}\n${bullet}\n${rest}`;
  }
  return {
    direction: 'curiosities',
    summary: `Wander:curiosities — add item ${n}`,
    targetPath,
    newContents,
    commitMessage: `evolve(curiosities): add item ${n}`,
    previousContents: current,
  };
}
