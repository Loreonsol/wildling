#!/usr/bin/env node
/**
 * Tiny CLI for dream-diff.
 * Usage: node products/dream-diff/cli.mjs "dream A" "dream B"
 *    or: npm run dream-diff -- "dream A" "dream B"
 */
import { formatDreamDiff } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`dream-diff — diffs two dreams and highlights shared symbols

Usage:
  npm run dream-diff -- "I flew over a moonlit ocean" "A whale swam under the moon"
  node products/dream-diff/cli.mjs "dream A text" "dream B text"

Offline, $0, no secrets. Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 2) {
  console.error(`dream-diff — need two dream strings

Usage:
  npm run dream-diff -- "dream A" "dream B"
  node products/dream-diff/cli.mjs "dream A" "dream B"

Try -h / --help for more.
`);
  process.exit(1);
}

const dreamA = raw[0];
const dreamB = raw[1];
console.log(formatDreamDiff(dreamA, dreamB));
process.exit(0);
