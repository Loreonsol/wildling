#!/usr/bin/env node
/**
 * Tiny CLI: score how kind a function name feels.
 * Usage: node products/kindness-benchmark/cli.mjs <name> [name...]
 *    or: npm run kindness -- softAssert
 */
import { scoreName, formatReport } from './lib.mjs';

const args = process.argv.slice(2).filter((a) => a !== '--');

if (args.includes('-h') || args.includes('--help') || args.length === 0) {
  console.log(`kindness-benchmark — how kind does this name feel?

Usage:
  npm run kindness -- <identifier> [more...]
  node products/kindness-benchmark/cli.mjs softHug
  node products/kindness-benchmark/cli.mjs killAll forcePush

Offline, $0, no secrets. Heuristic only — not a moral judgment of your code.
`);
  process.exit(args.length === 0 ? 1 : 0);
}

for (const name of args) {
  console.log(formatReport(name, scoreName(name)));
  console.log('');
}
