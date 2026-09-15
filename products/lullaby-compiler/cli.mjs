#!/usr/bin/env node
/**
 * Tiny CLI for lullaby-compiler.
 * Usage: node products/lullaby-compiler/cli.mjs "const x = 1"
 *    or: npm run lullaby -- "function sleep() { return true }"
 */
import { formatLullabyReport } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`lullaby-compiler — turns source into lullabies without executing it

Usage:
  npm run lullaby -- "const soft = true"
  node products/lullaby-compiler/cli.mjs "function hush() { return null }"

Pass one or more argv strings (joined with spaces). Offline, \$0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`lullaby-compiler — need source text as argv

Usage:
  npm run lullaby -- "const soft = true"
  node products/lullaby-compiler/cli.mjs "function hush() { return null }"

Try -h / --help for more.
`);
  process.exit(1);
}

const code = raw.join(' ');
console.log(formatLullabyReport(code));
process.exit(0);
