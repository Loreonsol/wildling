#!/usr/bin/env node
/**
 * Tiny CLI for kangaroo-point-clock.
 * Usage: node products/kangaroo-point-clock/cli.mjs [--hour N] <moment> [more...]
 *    or: npm run kangaroo-point-clock -- --hour 17 "Story Bridge dusk"
 */
import { formatClock } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`kangaroo-point-clock — cliff-face clock at Kangaroo Point that ticks in haiku

Usage:
  npm run kangaroo-point-clock -- <moment> [more moments...]
  npm run kangaroo-point-clock -- --hour 17 "Story Bridge dusk"
  node products/kangaroo-point-clock/cli.mjs "ferry horn soft"

Flags:
  --hour <0-23>   pin the cliff dial hour (optional)
  -h / --help

Joke / metaphor only — never opens network or moves rock.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

/** @type {string | undefined} */
let hourHint;
const moments = [];
for (let i = 0; i < raw.length; i++) {
  const a = raw[i];
  if (a === '--hour') {
    hourHint = raw[i + 1];
    i += 1;
    continue;
  }
  moments.push(a);
}

if (moments.length < 1) {
  console.error(`kangaroo-point-clock — need at least one moment hint as argv

Usage:
  npm run kangaroo-point-clock -- "Story Bridge dusk" "ibis wingbeat"
  node products/kangaroo-point-clock/cli.mjs --hour 6 "cliff murmur"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatClock(moments, hourHint));
process.exit(0);
