#!/usr/bin/env node
/**
 * Tiny CLI for cursor-firefly.
 * Usage: node products/cursor-firefly/cli.mjs [--hour N] <moment> [more...]
 *    or: npm run cursor-firefly -- --hour 4 "editing at dawn"
 */
import { formatFireflyReport, normalizeHour } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`cursor-firefly — creature that is a text cursor by day and a firefly by night

Usage:
  npm run cursor-firefly -- <moment> [more moments...]
  npm run cursor-firefly -- --hour 4 "overnight wake" "quiet buffer"
  node products/cursor-firefly/cli.mjs --hour 14 "afternoon refactor"

Day (cursor) = hours 6–17; night (firefly) = 18–5.
Omit --hour to let the moment string decide.

Metaphor only — offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

let hour = null;
const moments = [];
for (let i = 0; i < raw.length; i++) {
  const a = raw[i];
  if (a === '--hour' || a === '-H') {
    const next = raw[i + 1];
    if (next == null || normalizeHour(next) == null) {
      console.error('cursor-firefly — --hour needs an integer 0–23');
      process.exit(1);
    }
    hour = normalizeHour(next);
    i++;
    continue;
  }
  moments.push(a);
}

if (moments.length < 1) {
  console.error(`cursor-firefly — need at least one moment as argv

Usage:
  npm run cursor-firefly -- --hour 4 "overnight wake"
  node products/cursor-firefly/cli.mjs "empty commit line"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatFireflyReport(moments, hour));
process.exit(0);
