#!/usr/bin/env node
/**
 * Tiny CLI: point toward the most boring file in a repo.
 * Usage: node products/compass-of-boredom/cli.mjs [dir] [--top N]
 *    or: npm run compass -- .
 */
import { resolve } from 'node:path';
import { formatNeedle, pointCompass, rankBoredom } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`compass-of-boredom — find the blandest file in a tree

Usage:
  npm run compass -- .
  npm run compass -- ./src --top 5
  node products/compass-of-boredom/cli.mjs /path/to/repo

Offline, $0, no secrets. Heuristic only — not a judgment of your craft.
`);
  process.exit(0);
}

let top = 1;
let dir = process.cwd();
const args = [...raw];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--top' && args[i + 1]) {
    top = Math.max(1, Number.parseInt(args[i + 1], 10) || 1);
    args.splice(i, 2);
    i--;
  }
}
if (args[0] && !args[0].startsWith('-')) {
  dir = resolve(args[0]);
}

if (top === 1) {
  console.log(formatNeedle(pointCompass(dir)));
} else {
  const ranked = rankBoredom(dir);
  const slice = ranked.slice(0, top);
  if (slice.length === 0) {
    console.log('compass spins… no files found.');
    process.exit(1);
  }
  console.log(`🧭 top ${slice.length} blandest under ${dir}\n`);
  for (const [i, e] of slice.entries()) {
    console.log(`${i + 1}. ${e.rel}  (${e.score}/100 — ${e.band})`);
  }
}
