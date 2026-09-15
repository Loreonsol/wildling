#!/usr/bin/env node
/**
 * Tiny CLI for postage-spell.
 * Usage: node products/postage-spell/cli.mjs "dear future,"
 *    or: npm run postage-spell -- "dear future,"
 */
import { formatPostageSpell } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`postage-spell — ritual for a letter that arrives before it was written

Usage:
  npm run postage-spell -- "dear future,"
  npm run postage-spell -- dear yesterday,
  node products/postage-spell/cli.mjs "a note to the past"

Metaphor only — never mails anything, never network.
Offline, \$0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`postage-spell — need letter text as argv

Usage:
  npm run postage-spell -- "dear future,"
  node products/postage-spell/cli.mjs "dear yesterday,"

Try -h / --help for more.
`);
  process.exit(1);
}

const letter = raw.join(' ');
console.log(formatPostageSpell(letter));
process.exit(0);
