#!/usr/bin/env node
/**
 * Tiny CLI for southbank-labyrinth.
 * Usage: node products/southbank-labyrinth/cli.mjs <hint> [more hints...]
 *    or: npm run southbank-labyrinth -- "Quiet Jetty" "neon EXIT?"
 */
import { formatLabyrinth } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`southbank-labyrinth — map a labyrinth beneath South Bank whose walls are sticky notes

Usage:
  npm run southbank-labyrinth -- <hint> [more hints...]
  npm run southbank-labyrinth -- "Quiet Jetty" "neon EXIT?"
  node products/southbank-labyrinth/cli.mjs "Goodwill Bridge undercroft"

Joke / metaphor only — never opens network or digs real tunnels.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`southbank-labyrinth — need at least one place / sticky hint as argv

Usage:
  npm run southbank-labyrinth -- "Quiet Jetty" "Streets Beach tide"
  node products/southbank-labyrinth/cli.mjs "South Bank murmur"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatLabyrinth(raw));
process.exit(0);
