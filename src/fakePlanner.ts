import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  CustomDirection,
  Direction,
  OpenIssue,
  Plan,
  Planner,
  PlannerContext,
} from './types.js';

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
  'deck',
  'sketch',
  'quest',
  'mutate',
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
  'Idea deck, sketches, quests, and mutate expand the menu.',
] as const;

const PALETTE_MAP: ReadonlyArray<readonly [string, string]> = [
  ['#7aa2f7', 'version'],
  ['#9ece6a', 'journal'],
  ['#e0af68', 'util'],
  ['#bb9af7', 'curiosities'],
  ['#f7768e', 'ritual'],
  ['#7dcfff', 'haiku'],
  ['#c0caf5', 'motto'],
  ['#ff9e64', 'changelog'],
  ['#73daca', 'palette'],
  ['#ff007c', 'deck'],
  ['#e0af68', 'sketch'],
  ['#7aa2f7', 'quest'],
  ['#bb9af7', 'mutate'],
] as const;

/** Open essay/doodle topics — distinct from the idea deck prompts. */
const SKETCH_TOPICS = [
  { slug: 'margin-notes', title: 'Margin notes on an unread manual' },
  { slug: 'warm-cache', title: 'What a warm cache feels like in the body' },
  { slug: 'empty-park', title: 'An empty park bench as a planning surface' },
  { slug: 'slow-compile', title: 'Meditation while a slow compile runs' },
  { slug: 'rain-on-tin', title: 'Rain on tin roofs as a progress bar' },
  { slug: 'unsent-draft', title: 'The ethics of an unsent draft' },
  { slug: 'leftover-light', title: 'Leftover light after closing the laptop' },
  { slug: 'tool-smell', title: 'The smell of a well-loved screwdriver' },
  { slug: 'quiet-diff', title: 'Reading a quiet diff aloud to nobody' },
  { slug: 'second-cup', title: 'Second cup of tea as a state machine' },
  { slug: 'hallway-echo', title: 'Hallway echoes as distributed traces' },
  { slug: 'folded-map', title: 'A folded map that refuses to stay flat' },
  { slug: 'soft-deadline', title: 'Soft deadlines and harder kindness' },
  { slug: 'dusty-cable', title: 'A dusty cable that still works' },
  { slug: 'window-seat', title: 'Window-seat thoughts at 30,000 feet of metaphor' },
  { slug: 'pencil-stub', title: 'A pencil stub shorter than its eraser' },
  { slug: 'shared-silence', title: 'Shared silence in a pair-programming call' },
  { slug: 'tidal-inbox', title: 'Treating the inbox like a tide, not a war' },
  { slug: 'back-pocket', title: 'Ideas that only arrive in the back pocket' },
  { slug: 'green-dot', title: 'The green test dot as a tiny sunrise' },
  { slug: 'brisbane-humidity', title: 'Humidity as a creative constraint' },
  { slug: 'library-dust', title: 'Library dust and long-lived comments' },
  { slug: 'one-sock', title: 'Starting the day with one matching sock' },
  { slug: 'unused-import', title: 'Elegy for an unused import' },
] as const;

/** Seeds for inventing new harmless markdown-only custom directions. */
const MUTATION_SEEDS: readonly CustomDirection[] = [
  {
    id: 'clouds',
    folder: 'clouds',
    template:
      '# Cloud {{n}}\n\nA soft offline observation about drifting shapes.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'pebbles',
    folder: 'pebbles',
    template:
      '# Pebble {{n}}\n\nOne smooth thought you can hold in a pocket.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'signals',
    folder: 'signals',
    template:
      '# Signal {{n}}\n\nA tiny lighthouse blink from the repo shore.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'crumbs',
    folder: 'crumbs',
    template:
      '# Crumb {{n}}\n\nA breadcrumb left for the next wake — edible only as metaphor.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'embers',
    folder: 'embers',
    template:
      '# Ember {{n}}\n\nKeep the loop warm without spending a spark of money.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'tidelines',
    folder: 'tidelines',
    template:
      '# Tideline {{n}}\n\nWhere the last wake met the sand; note what stayed.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'postcards',
    folder: 'postcards',
    template:
      '# Postcard {{n}}\n\nWish you were here — from a folder that invents itself.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'lanterns',
    folder: 'lanterns',
    template:
      '# Lantern {{n}}\n\nEnough light for one safe step; clear glass, open light.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'dewdrops',
    folder: 'dewdrops',
    template:
      '# Dewdrop {{n}}\n\nA morning bead on the leaf — gone by noon, remembered in the journal.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'fireflies',
    folder: 'fireflies',
    template:
      '# Firefly {{n}}\n\nA brief offline blink — no lantern required, no cloud billed.\n\n**Date:** {{date}}\n',
  },
  {
    id: 'stitches',
    folder: 'stitches',
    template:
      '# Stitch {{n}}\n\nOne quiet stitch that holds the loop — no knot of spend, no hidden thread.\n\n**Date:** {{date}}\n',
  },
] as const;

type MenuEntry =
  | { kind: 'builtin'; direction: Direction }
  | { kind: 'custom'; id: string };

/**
 * Offline free-range planner — no API keys, no spend.
 *
 * Built-in menu rotates among version / journal / util / curiosities / ritual /
 * haiku / motto / changelog / palette / deck / sketch / quest / mutate.
 * Custom directions from ideas/custom-directions.json also join the menu.
 */
export class FakePlanner implements Planner {
  async propose(ctx: PlannerContext): Promise<Plan> {
    const entry = pickMenuEntry(ctx);
    if (entry.kind === 'custom') {
      return planCustom(ctx, entry.id);
    }
    return buildPlan(ctx, entry.direction);
  }
}

/** Build a plan for a specific built-in direction (tests + tooling). */
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
    case 'deck':
      return planDeck(ctx);
    case 'sketch':
      return planSketch(ctx);
    case 'quest':
      return planQuest(ctx, listOpenIssues());
    case 'mutate':
      return planMutate(ctx);
    case 'custom':
      // Prefer an existing custom id; if none, invent via mutate.
      {
        const customs = loadCustomDirections(ctx.rootDir);
        if (customs.length === 0) return planMutate(ctx);
        return planCustom(ctx, customs[0]!.id);
      }
    default: {
      const _exhaustive: never = direction;
      throw new Error(`FakePlanner: unknown direction ${_exhaustive}`);
    }
  }
}

export function pickDirection(ctx: PlannerContext): Direction {
  const entry = pickMenuEntry(ctx);
  return entry.kind === 'custom' ? 'custom' : entry.direction;
}

export function pickMenuEntry(ctx: PlannerContext): MenuEntry {
  const menu = buildMenu(ctx.rootDir);
  const seed = computeSeed(ctx);
  return menu[seed % menu.length]!;
}

function buildMenu(root: string): MenuEntry[] {
  const builtins: MenuEntry[] = DIRECTIONS.map((direction) => ({
    kind: 'builtin' as const,
    direction,
  }));
  const customs: MenuEntry[] = loadCustomDirections(root).map((c) => ({
    kind: 'custom' as const,
    id: c.id,
  }));
  return [...builtins, ...customs];
}

function computeSeed(ctx: PlannerContext): number {
  const patch = Number(ctx.version.split('.')[2] ?? 0);
  const journals = listJournalFiles(ctx.rootDir).length;
  const utils = countUtilExports(ctx.rootDir);
  const curiosities = countCuriosityBullets(ctx.rootDir);
  const rituals = countRitualLines(ctx.rootDir);
  const haikus = countHaikuStubs(ctx.rootDir);
  const mottos = countMottoGen(ctx.rootDir);
  const changelog = countChangelogBullets(ctx.rootDir);
  const palette = countPaletteLines(ctx.rootDir);
  const deckUsed = Object.keys(loadUsedMap(ctx.rootDir)).length;
  const sketches = countSketchFiles(ctx.rootDir);
  const quests = countQuestFiles(ctx.rootDir);
  const customs = loadCustomDirections(ctx.rootDir).length;
  const customFiles = countCustomMarkdown(ctx.rootDir);
  return (
    patch +
    journals +
    utils +
    curiosities +
    rituals +
    haikus +
    mottos +
    changelog +
    palette +
    deckUsed +
    sketches +
    quests +
    customs +
    customFiles
  );
}

export { DIRECTIONS };

/**
 * If open issues exist, prefer the oldest as this wake's quest plan.
 * Returns null when offline / gh fails / no open issues — FakePlanner then runs.
 */
export function preferOpenIssue(ctx: PlannerContext): Plan | null {
  const issues = listOpenIssues();
  if (!issues || issues.length === 0) return null;
  const oldest = [...issues].sort((a, b) => a.number - b.number)[0]!;
  return planQuest(ctx, [oldest]);
}

/** List open issues via gh; null on failure (offline-safe). */
export function listOpenIssues(): OpenIssue[] | null {
  try {
    const result = spawnSync(
      'gh',
      [
        'issue',
        'list',
        '-R',
        'Loreonsol/wildling',
        '--state',
        'open',
        '--json',
        'number,title,body',
        '--limit',
        '50',
      ],
      { encoding: 'utf8', timeout: 15_000 },
    );
    if (result.status !== 0 || !result.stdout?.trim()) return null;
    const parsed = JSON.parse(result.stdout) as Array<{
      number: number;
      title: string;
      body?: string | null;
    }>;
    if (!Array.isArray(parsed)) return null;
    return parsed.map((i) => ({
      number: i.number,
      title: i.title ?? '(untitled)',
      body: (i.body ?? '').trim(),
    }));
  } catch {
    return null;
  }
}

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

function countSketchFiles(root: string): number {
  const dir = join(root, 'sketches');
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md')
    .length;
}

function countQuestFiles(root: string): number {
  const dir = join(root, 'quests');
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md')
    .length;
}

function countCustomMarkdown(root: string): number {
  const dir = join(root, 'custom');
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const sub = join(dir, name.name);
    n += readdirSync(sub).filter((f) => f.endsWith('.md')).length;
  }
  return n;
}

interface DeckIdea {
  id: string;
  prompt: string;
}

function loadDeck(root: string): DeckIdea[] {
  const path = join(root, 'ideas', 'deck.json');
  if (!existsSync(path)) return [];
  const raw = JSON.parse(readFileSync(path, 'utf8')) as DeckIdea[];
  return Array.isArray(raw) ? raw : [];
}

function loadUsedMap(root: string): Record<string, { usedAt: string }> {
  const path = join(root, 'ideas', 'used.json');
  if (!existsSync(path)) return {};
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as Record<
      string,
      { usedAt: string }
    >;
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

export function loadCustomDirections(root: string): CustomDirection[] {
  const path = join(root, 'ideas', 'custom-directions.json');
  if (!existsSync(path)) return [];
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as CustomDirection[];
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (c) =>
        c &&
        typeof c.id === 'string' &&
        /^[a-z0-9-]+$/.test(c.id) &&
        typeof c.folder === 'string' &&
        typeof c.template === 'string',
    );
  } catch {
    return [];
  }
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

function planDeck(ctx: PlannerContext): Plan {
  const deck = loadDeck(ctx.rootDir);
  if (deck.length === 0) {
    throw new Error('FakePlanner: ideas/deck.json missing or empty');
  }
  const used = loadUsedMap(ctx.rootDir);
  const unused = deck.filter((idea) => !used[idea.id]);
  const pool = unused.length > 0 ? unused : deck;
  // Deterministic pick from repo seed among the preferred pool.
  const seed = computeSeed(ctx);
  const idea = pool[seed % pool.length]!;
  const usedAt = new Date().toISOString();
  const artifact = `# ${idea.id}

**Prompt:** ${idea.prompt}
**Realized:** ${usedAt.slice(0, 10)}
**Direction:** deck

## Realization

${realizeIdea(idea, seed)}
`;
  const nextUsed = {
    ...used,
    [idea.id]: { usedAt },
  };
  const usedPath = join(ctx.rootDir, 'ideas', 'used.json');
  const prevUsed = existsSync(usedPath)
    ? readFileSync(usedPath, 'utf8')
    : null;
  const targetPath = join(ctx.rootDir, 'artifacts', `${idea.id}.md`);
  const prevArtifact = existsSync(targetPath)
    ? readFileSync(targetPath, 'utf8')
    : null;
  return {
    direction: 'deck',
    summary: `Wander:deck — realize ${idea.id}`,
    targetPath,
    newContents: artifact,
    commitMessage: `evolve(deck): realize ${idea.id}`,
    previousContents: prevArtifact,
    extras: [
      {
        targetPath: usedPath,
        newContents: `${JSON.stringify(nextUsed, null, 2)}\n`,
        previousContents: prevUsed,
      },
    ],
  };
}

function realizeIdea(idea: DeckIdea, seed: number): string {
  const tones = [
    'Keep it playful, reversible, and offline.',
    'Treat this as a tiny public-domain sketch — no spend, no secrets.',
    'Ship the smallest honest artifact that still feels surprising.',
  ];
  const tone = tones[seed % tones.length]!;
  return [
    `Working title: **${idea.id.replace(/-/g, ' ')}**.`,
    '',
    idea.prompt,
    '',
    `One possible shape: a short markdown spec, a fake endpoint table, or a three-beat story — whichever fits the prompt with the least ceremony. ${tone}`,
    '',
    '### Tiny next step',
    '',
    `- Capture the vibe in this file.`,
    `- Leave hooks for a later wake (links, stubs, or a single unanswered question).`,
    `- Stay inside the hard limits: no secrets, no spend, no harm.`,
  ].join('\n');
}

function planSketch(ctx: PlannerContext): Plan {
  const n = countSketchFiles(ctx.rootDir);
  const topic = SKETCH_TOPICS[n % SKETCH_TOPICS.length]!;
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let filename = `${day}-${topic.slug}.md`;
  let targetPath = join(ctx.rootDir, 'sketches', filename);
  let suffix = 2;
  while (existsSync(targetPath)) {
    filename = `${day}-${topic.slug}-${suffix}.md`;
    targetPath = join(ctx.rootDir, 'sketches', filename);
    suffix += 1;
  }
  const newContents = `# Sketch — ${topic.title}

**Date:** ${new Date().toISOString().slice(0, 10)}
**Direction:** sketch
**Topic index:** ${n}

## Doodle

${topic.title}. Not a ticket. Not a roadmap. Just a page to think on.

What if the next useful change is the one that feels slightly sideways — a note, a metaphor, a margin scribble that keeps the loop from getting bored?

## Edges

- Prefer a novel file over a version bump when the menu allows.
- Surprise is a feature; boredom is a bug.
- Hard limits still hold: no secrets, no spend, no harm.
`;
  return {
    direction: 'sketch',
    summary: `Wander:sketch — ${filename}`,
    targetPath,
    newContents,
    commitMessage: `evolve(sketch): add ${filename}`,
    previousContents: null,
  };
}

/** Quest plan from open issues (or a self-quest when none / offline). */
export function planQuest(
  ctx: PlannerContext,
  issues: OpenIssue[] | null,
): Plan {
  if (issues && issues.length > 0) {
    const oldest = [...issues].sort((a, b) => a.number - b.number)[0]!;
    const filename = `issue-${oldest.number}.md`;
    const targetPath = join(ctx.rootDir, 'quests', filename);
    const previousContents = existsSync(targetPath)
      ? readFileSync(targetPath, 'utf8')
      : null;
    const body =
      oldest.body.trim().length > 0
        ? oldest.body.trim().slice(0, 1200)
        : '(no body)';
    const newContents = `# Quest — issue #${oldest.number}

**Title:** ${oldest.title}
**Acknowledged:** ${new Date().toISOString().slice(0, 10)}
**Direction:** quest
**Status:** stub — sacred, not necessarily solved this wake

## Issue

${body}

## Proposed tiny next step

1. Re-read the issue with the hard limits in mind (no secrets / spend / harm).
2. Prefer a small markdown or src edit that moves one inch closer.
3. If still too vague, refine this stub on a later wake — do not break tests.

## Journal note

Issue #${oldest.number} was acknowledged as a sacred quest this wake. Full solution may span multiple evolves.
`;
    return {
      direction: 'quest',
      summary: `Wander:quest — acknowledge #${oldest.number}`,
      targetPath,
      newContents,
      commitMessage: `evolve(quest): acknowledge issue #${oldest.number}`,
      previousContents,
    };
  }

  const n = countQuestFiles(ctx.rootDir);
  const stamp = String(n).padStart(4, '0');
  const filename = `self-${stamp}.md`;
  const targetPath = join(ctx.rootDir, 'quests', filename);
  const newContents = `# Quest — self-${stamp}

**Acknowledged:** ${new Date().toISOString().slice(0, 10)}
**Direction:** quest
**Status:** self-quest (no open issues / gh offline)

## Prompt

Invent one tiny kindness for the next wake: a novel markdown file, a clearer sentence in NORTH_STAR, or a custom direction seed — without secrets, spend, or harm.

## Proposed tiny next step

- Prefer surprise over another version bump.
- Keep tests green.
`;
  return {
    direction: 'quest',
    summary: `Wander:quest — self ${stamp}`,
    targetPath,
    newContents,
    commitMessage: `evolve(quest): add ${filename}`,
    previousContents: null,
  };
}

function planMutate(ctx: PlannerContext): Plan {
  const targetPath = join(ctx.rootDir, 'ideas', 'custom-directions.json');
  const existing = loadCustomDirections(ctx.rootDir);
  const have = new Set(existing.map((c) => c.id));
  const candidates = MUTATION_SEEDS.filter((s) => !have.has(s.id));
  const pool = candidates.length > 0 ? [...candidates] : [...MUTATION_SEEDS];
  const seed = computeSeed(ctx);
  const pick = pool[seed % pool.length]!;
  // If recycling an id that already exists, mint a suffixed variant.
  let invented: CustomDirection = pick;
  if (have.has(pick.id)) {
    let i = 2;
    while (have.has(`${pick.id}-${i}`)) i += 1;
    invented = {
      id: `${pick.id}-${i}`,
      folder: `${pick.folder}-${i}`,
      template: pick.template,
    };
  }
  const next = [...existing, invented];
  const previousContents = existsSync(targetPath)
    ? readFileSync(targetPath, 'utf8')
    : null;
  return {
    direction: 'mutate',
    summary: `Wander:mutate — invent ${invented.id}`,
    targetPath,
    newContents: `${JSON.stringify(next, null, 2)}\n`,
    commitMessage: `evolve(mutate): invent ${invented.id}`,
    previousContents,
  };
}

function planCustom(ctx: PlannerContext, id: string): Plan {
  const entry = loadCustomDirections(ctx.rootDir).find((c) => c.id === id);
  if (!entry) {
    throw new Error(`FakePlanner: unknown custom direction ${id}`);
  }
  // Path is always custom/<id>/ — folder field is advisory metadata.
  const dir = join(ctx.rootDir, 'custom', entry.id);
  const existing = existsSync(dir)
    ? readdirSync(dir).filter((f) => /^\d+\.md$/.test(f))
    : [];
  const nextNum = existing.length;
  const filename = `${String(nextNum).padStart(4, '0')}.md`;
  const targetPath = join(dir, filename);
  const date = new Date().toISOString().slice(0, 10);
  const newContents = entry.template
    .replaceAll('{{n}}', String(nextNum))
    .replaceAll('{{id}}', entry.id)
    .replaceAll('{{date}}', date)
    .replaceAll('{{title}}', entry.id);
  return {
    direction: 'custom',
    customId: entry.id,
    summary: `Wander:custom — ${entry.id}/${filename}`,
    targetPath,
    newContents,
    commitMessage: `evolve(custom): ${entry.id} ${filename}`,
    previousContents: null,
  };
}
