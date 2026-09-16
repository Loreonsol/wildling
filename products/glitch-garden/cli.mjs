#!/usr/bin/env node
/**
 * Tiny CLI for glitch-garden.
 * Usage: node products/glitch-garden/cli.mjs <hint> [more...]
 *    or: npm run glitch-garden -- "missing route" "ghost href"
 */
import { formatGarden } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`glitch-garden — Plant list for a garden that only grows on 404 pages

Usage:
  npm run glitch-garden -- <hint> [more hints...]
  npm run glitch-garden -- "missing route" "ghost href"
  node products/glitch-garden/cli.mjs "/lost/page"

Joke / metaphor only — never opens network or spends cash.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`glitch-garden — need at least one path / page hint as argv

Usage:
  npm run glitch-garden -- "missing route" "ghost href"
  node products/glitch-garden/cli.mjs "/lost/page"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatGarden(raw));
process.exit(0);
