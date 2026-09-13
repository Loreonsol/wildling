import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Direction, Plan, Planner, PlannerContext } from './types.js';

const DIRECTIONS: readonly Direction[] = [
  'version',
  'journal',
  'util',
  'curiosities',
  'ritual',
  'haiku',
  'motto',
  'changelog',
  'palette',
] as const;

const RITUAL_LINES = [
  'Breathe once. Then take one small step.',
  'Touch the soil of the repo before you dig.',
  'Name the change out loud — then write it small.',
  'Leave the keys at the door; wander offline.',
  'One file, one idea, one honest test.',
] as const;

const HAIKU_STUBS = [
  ['code in the open', 'no keys and no dollars spent', 'one more quiet step'],
  ['soft circuit hums low', 'planner turns without a coin', 'leaf lands on the disk'],
  ['morning light on logs', 'journal grows another page', 'wind keeps the ledger'],
  ['tiny util blooms', 'spark reverses a whisper', 'tests stay evergreen'],
  ['palette picks a hue', 'direction wears a new coat', 'wander paints the map'],
] as const;

const MOTTOS = [
  'Wander small. Revert fast. Stay kind.',
  'No secrets. No spend. No harm.',
  'Curiosity is the roadmap.',
  'One file per wake is enough.',
  'Free-range, not free-for-all.',
  'Tests are the compass; North Star is the sky.',
] as const;

const CHANGELOG_NOTES = [
  'FakePlanner gained another safe micro-direction.',
  'Offline menu widened — still $0, still reversible.',
  'A quieter ritual before the next evolve.',
  'Haiku stubs join the wander toolkit.',
  'Motto and palette keep the loop colorful.',
] as const;

const PALETTE_MAP: ReadonlyArray<readonly [string, Direction]> = [
  ['#7aa2f7', 'version'],
  ['#9ece6a', 'journal'],
  ['#e0af68', 'util'],
  ['#bb9af7', 'curiosities'],
  ['#f7768e', 'ritual'],
  ['#7dcfff', 'haiku'],
  ['#c0caf5', 'motto'],
  ['#ff9e64', 'changelog'],
  ['#73daca', 'palette'],
] as const;

/**
 * Offline free-range planner — no API keys, no spend.
 *
 * Each propose() picks ONE safe micro-improvement by rotating among:
 *   version      → bump patch in src/version.ts
 *   journal      → append a short evolve note under journal/
 *   util         → add a tiny pure helper to src/utils.ts
 *   curiosities  → extend the "## Curiosities" list in README.md
 *   ritual       → create/append one line to RITUAL.md
 *   haiku        → append a 3-line stub under poems/haikus.md
 *   motto        → overwrite motto.txt from a fixed rotating list
 *   changelog    → append one line under CHANGELOG.md Unreleased
 *   palette      → append a color→direction line to palette.md
 *
 * Direction index is deterministic from (patch + journal file count + util
 * export count + curiosity / ritual / haiku / motto / changelog / palette
 * counters) so offline CI stays stable without randomness or network, yet
 * consecutive successful evolves tend to wander.
 */
export class FakePlanner implements Planner {
  async propose(ctx: PlannerContext): Promise<Plan> {
    return buildPlan(ctx, pickDirection(ctx));
  }
}

/** Build a plan for a specific direction (tests + tooling). */
export function buildPlan(ctx: PlannerContext, direction: Direction): Plan {
  switch (direction) {
    case 'version':
      return planVersionBump(ctx);
    case 'journal':
      return planJournalNote(ctx);
    case 'util':
      return planUtilAppend(ctx);
    case 'curiosities':
      return planCuriosity(ctx);
    case 'ritual':
      return planRitual(ctx);
    case 'haiku':
      return planHaiku(ctx);
    case 'motto':
      return planMotto(ctx);
    case 'changelog':
      return planChangelog(ctx);
    case 'palette':
      return planPalette(ctx);
    default: {
      const _exhaustive: never = direction;
      throw new Error(`FakePlanner: unknown direction ${_exhaustive}`);
    }
  }
}

export function pickDirection(ctx: PlannerContext): Direction {
  const patch = Number(ctx.version.split('.')[2] ?? 0);
  const journals = listJournalFiles(ctx.rootDir).length;
  const utils = countUtilExports(ctx.rootDir);
  const curiosities = countCuriosityBullets(ctx.rootDir);
  const rituals = countRitualLines(ctx.rootDir);
  const haikus = countHaikuStubs(ctx.rootDir);
  const mottos = countMottoGen(ctx.rootDir);
  const changelog = countChangelogBullets(ctx.rootDir);
  const palette = countPaletteLines(ctx.rootDir);
  const seed =
    patch +
    journals +
    utils +
    curiosities +
    rituals +
    haikus +
    mottos +
    changelog +
    palette;
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

function countRitualLines(root: string): number {
  const path = join(root, 'RITUAL.md');
  if (!existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8');
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0 && !line.trim().startsWith('#'))
    .length;
}

function countHaikuStubs(root: string): number {
  const path = join(root, 'poems', 'haikus.md');
  if (!existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8');
  return (text.match(/^## \d+/gm) ?? []).length;
}

function countMottoGen(root: string): number {
  const path = join(root, 'motto.txt');
  if (!existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8');
  const match = text.match(/^#(\d+)/);
  return match ? Number(match[1]) : 1;
}

function countChangelogBullets(root: string): number {
  const path = join(root, 'CHANGELOG.md');
  if (!existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8');
  const section = text.split('## Unreleased')[1] ?? '';
  const beforeNext = section.split(/\n## /)[0] ?? '';
  return (beforeNext.match(/^- /gm) ?? []).length;
}

function countPaletteLines(root: string): number {
  const path = join(root, 'palette.md');
  if (!existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8');
  return (text.match(/^- /gm) ?? []).length;
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

function planRitual(ctx: PlannerContext): Plan {
  const targetPath = join(ctx.rootDir, 'RITUAL.md');
  const existed = existsSync(targetPath);
  const current = existed ? readFileSync(targetPath, 'utf8') : null;
  const n = countRitualLines(ctx.rootDir);
  const line = RITUAL_LINES[n % RITUAL_LINES.length]!;
  let newContents: string;
  if (!current) {
    newContents = `# Ritual\n\nOne-line pre-evolve reminders — keep them short.\n\n${line}\n`;
  } else {
    const base = current.trimEnd();
    newContents = `${base}\n${line}\n`;
  }
  return {
    direction: 'ritual',
    summary: `Wander:ritual — add line ${n}`,
    targetPath,
    newContents,
    commitMessage: `evolve(ritual): add line ${n}`,
    previousContents: current,
  };
}

function planHaiku(ctx: PlannerContext): Plan {
  const targetPath = join(ctx.rootDir, 'poems', 'haikus.md');
  const existed = existsSync(targetPath);
  const current = existed ? readFileSync(targetPath, 'utf8') : null;
  const n = countHaikuStubs(ctx.rootDir);
  const stub = HAIKU_STUBS[n % HAIKU_STUBS.length]!;
  const block = `## ${n}\n${stub[0]}\n${stub[1]}\n${stub[2]}\n`;
  let newContents: string;
  if (!current) {
    newContents = `# Haikus\n\nOffline stubs from FakePlanner — three lines each.\n\n${block}`;
  } else {
    const base = current.trimEnd();
    newContents = `${base}\n\n${block}`;
  }
  return {
    direction: 'haiku',
    summary: `Wander:haiku — stub ${n}`,
    targetPath,
    newContents,
    commitMessage: `evolve(haiku): add stub ${n}`,
    previousContents: current,
  };
}

function planMotto(ctx: PlannerContext): Plan {
  const targetPath = join(ctx.rootDir, 'motto.txt');
  const existed = existsSync(targetPath);
  const current = existed ? readFileSync(targetPath, 'utf8') : null;
  const gen = countMottoGen(ctx.rootDir) + 1;
  const motto = MOTTOS[(gen - 1) % MOTTOS.length]!;
  const newContents = `#${gen} — ${motto}\n`;
  return {
    direction: 'motto',
    summary: `Wander:motto — set #${gen}`,
    targetPath,
    newContents,
    commitMessage: `evolve(motto): set #${gen}`,
    previousContents: current,
  };
}

function planChangelog(ctx: PlannerContext): Plan {
  const targetPath = join(ctx.rootDir, 'CHANGELOG.md');
  const existed = existsSync(targetPath);
  const current = existed ? readFileSync(targetPath, 'utf8') : null;
  const n = countChangelogBullets(ctx.rootDir);
  const note = CHANGELOG_NOTES[n % CHANGELOG_NOTES.length]!;
  const bullet = `- ${note}`;
  let newContents: string;
  if (!current) {
    newContents = `# Changelog\n\n## Unreleased\n\n${bullet}\n`;
  } else if (!current.includes('## Unreleased')) {
    const base = current.trimEnd();
    newContents = `${base}\n\n## Unreleased\n\n${bullet}\n`;
  } else {
    const marker = '## Unreleased';
    const idx = current.indexOf(marker);
    const after = current.slice(idx + marker.length);
    const nextHeading = after.search(/\n## /);
    if (nextHeading === -1) {
      const base = current.trimEnd();
      newContents = `${base}\n${bullet}\n`;
    } else {
      const insertAt = idx + marker.length + nextHeading;
      const before = current.slice(0, insertAt).trimEnd();
      const rest = current.slice(insertAt);
      newContents = `${before}\n${bullet}\n${rest}`;
    }
  }
  return {
    direction: 'changelog',
    summary: `Wander:changelog — note ${n}`,
    targetPath,
    newContents,
    commitMessage: `evolve(changelog): note ${n}`,
    previousContents: current,
  };
}

function planPalette(ctx: PlannerContext): Plan {
  const targetPath = join(ctx.rootDir, 'palette.md');
  const existed = existsSync(targetPath);
  const current = existed ? readFileSync(targetPath, 'utf8') : null;
  const n = countPaletteLines(ctx.rootDir);
  const entry = PALETTE_MAP[n % PALETTE_MAP.length]!;
  const bullet = `- ${entry[0]} → ${entry[1]}`;
  let newContents: string;
  if (!current) {
    newContents = `# Palette\n\nColor → FakePlanner direction mappings.\n\n${bullet}\n`;
  } else {
    const base = current.trimEnd();
    newContents = `${base}\n${bullet}\n`;
  }
  return {
    direction: 'palette',
    summary: `Wander:palette — map ${entry[1]}`,
    targetPath,
    newContents,
    commitMessage: `evolve(palette): map ${entry[1]}`,
    previousContents: current,
  };
}
