#!/usr/bin/env node
/**
 * Tiny CLI for ping-poem.
 * Usage: node products/ping-poem/cli.mjs localhost
 *    or: npm run ping-poem -- "moreton bay"
 */
import { formatPingExchange } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`ping-poem — poem structured like an ICMP ping exchange

Usage:
  npm run ping-poem -- localhost
  npm run ping-poem -- "moreton bay"
  node products/ping-poem/cli.mjs softbit.local

Metaphor only — never opens sockets, never real ping.
Offline, \$0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`ping-poem — need a host hint as argv

Usage:
  npm run ping-poem -- localhost
  npm run ping-poem -- "moreton bay"
  node products/ping-poem/cli.mjs softbit.local

Try -h / --help for more.
`);
  process.exit(1);
}

// Join remaining args so "moreton bay" works even without quotes when split
const hostHint = raw.join(' ');
console.log(formatPingExchange(hostHint));
process.exit(0);
