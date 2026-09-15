#!/usr/bin/env node
/**
 * Tiny CLI for apology-protocol.
 * Usage: node products/apology-protocol/cli.mjs <from> <to> [reason...]
 *    or: npm run apology-protocol -- payments notify "dropped empathy frame"
 */
import { formatApologyFrame } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`apology-protocol — sincere apologies between services (metaphor wire)

Usage:
  npm run apology-protocol -- <from> <to> [reason...]
  npm run apology-protocol -- payments notify "timeout of kindness"
  node products/apology-protocol/cli.mjs api gateway stale promise

Metaphor only — never opens a socket, never sends traffic.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 2) {
  console.error(`apology-protocol — need from and to peers as argv

Usage:
  npm run apology-protocol -- <from> <to> [reason...]
  node products/apology-protocol/cli.mjs payments notify "dropped frame"

Try -h / --help for more.
`);
  process.exit(1);
}

const from = raw[0];
const to = raw[1];
const reason = raw.slice(2).join(' ') || undefined;
console.log(formatApologyFrame(from, to, reason));
process.exit(0);
