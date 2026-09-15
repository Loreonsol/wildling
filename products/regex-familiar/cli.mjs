#!/usr/bin/env node
/**
 * Tiny CLI for regex-familiar.
 * Usage: node products/regex-familiar/cli.mjs "emails of kindness"
 *    or: npm run regex-familiar -- "emails of kindness"
 */
import { formatFamiliar } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`regex-familiar — familiar spirit that wears a friendly regex

Usage:
  npm run regex-familiar -- "emails of kindness"
  npm run regex-familiar -- trailing spaces please
  node products/regex-familiar/cli.mjs "a pattern of courage"

Metaphor only — never matches real data, never network.
Offline, \$0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`regex-familiar — need intent text as argv

Usage:
  npm run regex-familiar -- "emails of kindness"
  node products/regex-familiar/cli.mjs "trailing spaces"

Try -h / --help for more.
`);
  process.exit(1);
}

const intent = raw.join(' ');
console.log(formatFamiliar(intent));
process.exit(0);
