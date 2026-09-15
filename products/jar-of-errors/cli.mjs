#!/usr/bin/env node
/**
 * Tiny CLI for jar-of-errors.
 * Usage: node products/jar-of-errors/cli.mjs "Fatal Error: crash"
 *    or: npm run jar -- "Null pointer" "Timeout failed"
 */
import { formatJarReport } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`jar-of-errors — safely stores cute error messages

Usage:
  npm run jar -- "Fatal error: segfault"
  npm run jar -- "Timeout failed" "Null is undefined"
  node products/jar-of-errors/cli.mjs "Panic: abort"

Pass one or more error strings. Offline, \$0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`jar-of-errors — need at least one error message as argv

Usage:
  npm run jar -- "Fatal error: segfault"
  node products/jar-of-errors/cli.mjs "Panic: abort"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatJarReport(raw));
process.exit(0);
