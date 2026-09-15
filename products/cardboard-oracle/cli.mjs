#!/usr/bin/env node
/**
 * Tiny CLI for cardboard-oracle.
 * Usage: node products/cardboard-oracle/cli.mjs "should I ship today?"
 *    or: npm run cardboard-oracle -- "what next?"
 */
import { formatOracleSlip } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`cardboard-oracle — fortune deck made of shipping labels

Usage:
  npm run cardboard-oracle -- "should I ship today?"
  npm run cardboard-oracle -- what next
  node products/cardboard-oracle/cli.mjs "courage?"

Metaphor only — never mails anything, never network.
Offline, \$0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`cardboard-oracle — need a question as argv

Usage:
  npm run cardboard-oracle -- "should I ship today?"
  node products/cardboard-oracle/cli.mjs "what next?"

Try -h / --help for more.
`);
  process.exit(1);
}

const question = raw.join(' ');
console.log(formatOracleSlip(question));
process.exit(0);
