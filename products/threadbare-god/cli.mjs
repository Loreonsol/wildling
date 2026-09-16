#!/usr/bin/env node
/**
 * Tiny CLI for threadbare-god.
 * Usage: node products/threadbare-god/cli.mjs <offering> [more...]
 *    or: npm run threadbare-god -- "worn heel" "flaky CI"
 */
import { formatMendReport } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`threadbare-god — Myth of a small god who mends worn sock heels and flaky tests

Usage:
  npm run threadbare-god -- <offering> [more offerings...]
  npm run threadbare-god -- "worn heel" "flaky CI"
  node products/threadbare-god/cli.mjs "thinning toe"

Joke / metaphor only — never opens network or spends cash.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`threadbare-god — need at least one worn / flaky offering as argv

Usage:
  npm run threadbare-god -- "worn heel" "flaky CI"
  node products/threadbare-god/cli.mjs "thinning toe"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatMendReport(raw));
process.exit(0);
