#!/usr/bin/env node
/**
 * Tiny CLI for ink-weather.
 * Usage: node products/ink-weather/cli.mjs <place> [more places...]
 *    or: npm run ink-weather -- "Brisbane desk" "Sandgate"
 */
import { formatInkWeather } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`ink-weather — weather report where precipitation is colored ink

Usage:
  npm run ink-weather -- <place> [more places...]
  npm run ink-weather -- "quiet desk" "Sandgate foreshore"
  node products/ink-weather/cli.mjs Brisbane notebook

Metaphor only — never fetches real weather or opens network.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`ink-weather — need at least one place as argv

Usage:
  npm run ink-weather -- "quiet desk" "kitchen window"
  node products/ink-weather/cli.mjs Brisbane

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatInkWeather(raw));
process.exit(0);
