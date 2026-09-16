#!/usr/bin/env node
/**
 * Tiny CLI for bug-parade.
 * Usage: node products/bug-parade/cli.mjs <bug> [more bugs...]
 *    or: npm run bug-parade -- "null pointer plaza" "flaky CI arch"
 */
import { formatParade } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`bug-parade — parade route for bugs marching out of a legacy codebase

Usage:
  npm run bug-parade -- <bug> [more bugs...]
  npm run bug-parade -- "null pointer plaza" "flaky CI arch"
  node products/bug-parade/cli.mjs "off-by-one in Main Street"

Joke / metaphor only — never opens network or patches production.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`bug-parade — need at least one bug hint as argv

Usage:
  npm run bug-parade -- "null pointer plaza" "memory leak alley"
  node products/bug-parade/cli.mjs "legacy codebase"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatParade(raw));
process.exit(0);
