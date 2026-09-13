import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FakePlanner, preferOpenIssue } from './fakePlanner.js';
import type { FileWrite, Plan, Planner, PlannerContext } from './types.js';
import { VERSION } from './version.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function latestJournal(root: string): string {
  const dir = join(root, 'journal');
  if (!existsSync(dir)) return '(no journal yet)';
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort();
  if (files.length === 0) return '(no journal yet)';
  return readFileSync(join(dir, files[files.length - 1]!), 'utf8');
}

function createPlanner(): Planner {
  // Optional real planner later — stub behind WILDLING_API_KEY ($0 default).
  if (process.env.WILDLING_API_KEY) {
    console.log(
      '[evolve] WILDLING_API_KEY set — paid planner not wired; using FakePlanner ($0)',
    );
  }
  return new FakePlanner();
}

function runTests(root: string): boolean {
  console.log('[evolve] running npm test …');
  const result = spawnSync('npm', ['test'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
    env: { ...process.env, WILDLING_EVOLVE_SKIP_NESTED: '1' },
  });
  return result.status === 0;
}

function allWrites(plan: Plan): FileWrite[] {
  const primary: FileWrite = {
    targetPath: plan.targetPath,
    newContents: plan.newContents,
    previousContents: plan.previousContents,
  };
  return [primary, ...(plan.extras ?? [])];
}

function applyWrites(writes: FileWrite[]): void {
  for (const w of writes) {
    if (!w.targetPath.startsWith(ROOT)) {
      throw new Error(`Refuse to write outside repo root: ${w.targetPath}`);
    }
    mkdirSync(dirname(w.targetPath), { recursive: true });
    writeFileSync(w.targetPath, w.newContents, 'utf8');
    console.log('[evolve] applied change to', w.targetPath);
  }
}

function revert(plan: Plan): void {
  // Revert extras first, then primary (reverse apply order).
  const writes = allWrites(plan).slice().reverse();
  for (const w of writes) {
    if (w.previousContents === null) {
      if (existsSync(w.targetPath)) {
        unlinkSync(w.targetPath);
        console.log('[evolve] reverted: removed', w.targetPath);
      }
      continue;
    }
    writeFileSync(w.targetPath, w.previousContents, 'utf8');
    console.log('[evolve] reverted:', w.targetPath);
  }
}

async function evolve(): Promise<void> {
  // Avoid infinite nested test → evolve → test when evolve itself runs tests.
  if (process.env.WILDLING_EVOLVE_SKIP_NESTED === '1') {
    console.log('[evolve] nested invoke skipped');
    return;
  }

  const northStarPath = join(ROOT, 'NORTH_STAR.md');
  const northStar = existsSync(northStarPath)
    ? readFileSync(northStarPath, 'utf8')
    : '(missing NORTH_STAR.md)';

  const ctx: PlannerContext = {
    northStar,
    latestJournal: latestJournal(ROOT),
    version: VERSION,
    rootDir: ROOT,
  };

  // Issues are sacred: prefer the oldest open issue as a quest when feasible.
  // If gh fails offline or there are no issues, fall back to FakePlanner.
  const questPlan = preferOpenIssue(ctx);
  let plan: Plan;
  if (questPlan) {
    console.log('[evolve] preferOpenIssue: sacred quest selected');
    plan = questPlan;
  } else {
    const planner = createPlanner();
    plan = await planner.propose(ctx);
  }

  console.log('[evolve] direction:', plan.direction);
  console.log('[evolve] plan:', plan.summary);
  console.log('[evolve] target:', plan.targetPath);

  applyWrites(allWrites(plan));

  const ok = runTests(ROOT);
  if (!ok) {
    console.error('[evolve] tests failed — reverting change (hard limit)');
    revert(plan);
    process.exitCode = 1;
    return;
  }

  console.log('[evolve] tests passed');
  console.log('[evolve] suggested commit message:');
  console.log(plan.commitMessage);
}

evolve().catch((err) => {
  console.error('[evolve] fatal:', err);
  process.exitCode = 1;
});
