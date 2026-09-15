#!/usr/bin/env node
/**
 * Tiny CLI for patchwork-passport.
 * Usage: node products/patchwork-passport/cli.mjs <folder> [more...]
 *    or: npm run patchwork-passport -- "packages/core" "apps/web"
 */
import { formatPassport } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`patchwork-passport — passport stamps for monorepo folders

Usage:
  npm run patchwork-passport -- <folder> [more folders...]
  npm run patchwork-passport -- "packages/core" "apps/web" "tests/"
  node products/patchwork-passport/cli.mjs src/ utils/

Metaphor only — offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`patchwork-passport — need at least one folder path as argv

Usage:
  npm run patchwork-passport -- "packages/core" "apps/web"
  node products/patchwork-passport/cli.mjs src/

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatPassport(raw));
process.exit(0);
