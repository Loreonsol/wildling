#!/usr/bin/env node
/**
 * Tiny CLI for reef-scheduler.
 * Usage: node products/reef-scheduler/cli.mjs <job> [more jobs...]
 *    or: npm run reef-scheduler -- "full moon spawn" "quiet wake"
 */
import { formatReefSchedule } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`reef-scheduler — cron-like coral spawning metaphors

Usage:
  npm run reef-scheduler -- <job> [more jobs...]
  npm run reef-scheduler -- "full moon spawn" "neap tide polish"
  node products/reef-scheduler/cli.mjs dusk-bloom quiet-wake

Metaphor only — never fetches real tides or opens network.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`reef-scheduler — need at least one job as argv

Usage:
  npm run reef-scheduler -- "full moon spawn" "quiet wake"
  node products/reef-scheduler/cli.mjs dusk-bloom

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatReefSchedule(raw));
process.exit(0);
