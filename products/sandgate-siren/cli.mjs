#!/usr/bin/env node
/**
 * Tiny CLI for sandgate-siren.
 * Usage: node products/sandgate-siren/cli.mjs <place> [more places...]
 *    or: npm run sandgate-siren -- "Sandgate low tide" "high flood bay"
 */
import { formatSirenReport } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`sandgate-siren — a siren who sings only at Sandgate at low tide

Usage:
  npm run sandgate-siren -- <place> [more places...]
  npm run sandgate-siren -- "Sandgate low tide" "high flood bay"
  node products/sandgate-siren/cli.mjs Sandgate "neap hush"

Metaphor only — never fetches real tides or opens network.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`sandgate-siren — need at least one place as argv

Usage:
  npm run sandgate-siren -- "Sandgate low tide" "quiet pier"
  node products/sandgate-siren/cli.mjs Sandgate

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatSirenReport(raw));
process.exit(0);
