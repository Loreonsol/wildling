#!/usr/bin/env node
/**
 * Tiny CLI for null-island-cafe.
 * Usage: node products/null-island-cafe/cli.mjs <guest|lat,lon> [more...]
 *    or: npm run null-island-cafe -- "quiet desk" "0,0"
 */
import { formatCafeMenu } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`null-island-cafe — menu for a cafe at Null Island that serves coordinates as coffee

Usage:
  npm run null-island-cafe -- <guest> [more guests...]
  npm run null-island-cafe -- "0,0" "quiet desk" "-27.47,153.03"
  node products/null-island-cafe/cli.mjs "Sandgate foreshore"

Pass "lat,lon" to plot a real(ish) cup; otherwise soft-hash invents coordinates.

Metaphor only — offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`null-island-cafe — need at least one guest or lat,lon as argv

Usage:
  npm run null-island-cafe -- "quiet desk"
  node products/null-island-cafe/cli.mjs "0,0"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatCafeMenu(raw));
process.exit(0);
