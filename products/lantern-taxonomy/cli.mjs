#!/usr/bin/env node
/**
 * Tiny CLI for lantern-taxonomy.
 * Usage: node products/lantern-taxonomy/cli.mjs <idea> [more...]
 *    or: npm run lantern-taxonomy -- "quiet maybe" "soft assert"
 */
import { formatTaxonomy } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`lantern-taxonomy — taxonomy of lanterns that light ideas

Usage:
  npm run lantern-taxonomy -- <idea> [more ideas...]
  npm run lantern-taxonomy -- "quiet maybe" "soft assert"
  node products/lantern-taxonomy/cli.mjs "a half-finished thought"

Metaphor only — offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`lantern-taxonomy — need at least one idea as argv

Usage:
  npm run lantern-taxonomy -- "quiet maybe" "soft assert"
  node products/lantern-taxonomy/cli.mjs "a half-finished thought"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatTaxonomy(raw));
process.exit(0);
