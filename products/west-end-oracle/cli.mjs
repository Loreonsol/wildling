#!/usr/bin/env node
/**
 * Tiny CLI for west-end-oracle.
 * Usage: node products/west-end-oracle/cli.mjs <question> [more...]
 *    or: npm run west-end-oracle -- "where should I go?" "coffee?"
 */
import { formatOracle } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`west-end-oracle — Oracle booth in West End that answers only with shop names

Usage:
  npm run west-end-oracle -- <question> [more questions...]
  npm run west-end-oracle -- "where should I go?" "need coffee"
  node products/west-end-oracle/cli.mjs "what next?"

Joke / metaphor only — never opens network or spends cash.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`west-end-oracle — need at least one question hint as argv

Usage:
  npm run west-end-oracle -- "where should I go?" "need coffee"
  node products/west-end-oracle/cli.mjs "what next?"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatOracle(raw));
process.exit(0);
