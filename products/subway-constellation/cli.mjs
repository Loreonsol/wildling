#!/usr/bin/env node
/**
 * Tiny CLI for subway-constellation.
 * Usage: node products/subway-constellation/cli.mjs [station...]
 *    or: npm run subway-constellation -- Central "Roma Street" "South Bank"
 * No args → DEFAULT_STATIONS (Central, Roma Street, South Bank, Park Road).
 */
import { formatConstellation, DEFAULT_STATIONS } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`subway-constellation — Connect train stations into a constellation chart of transfers

Usage:
  npm run subway-constellation -- [station...]
  npm run subway-constellation -- Central "Roma Street" "South Bank"
  npm run subway -- "Park Road" Airport
  node products/subway-constellation/cli.mjs

No stations → defaults: ${DEFAULT_STATIONS.join(', ')}

Joke / metaphor only — never opens network or books real fares.
Offline, $0, no secrets.
Exit 0 on success.
`);
  process.exit(0);
}

const stations = raw.length > 0 ? raw : [...DEFAULT_STATIONS];
console.log(formatConstellation(stations));
process.exit(0);
