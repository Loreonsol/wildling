#!/usr/bin/env node
/**
 * Tiny CLI for sunset-difftool.
 * Usage: node products/sunset-difftool/cli.mjs [left] [right]
 *    or: npm run sunset-difftool -- "left" "right"
 *    or: npm run sunset-difftool -- --file a.txt b.txt
 * Flags: --file a b   --words   --no-color   -h / --help
 * No args → DEFAULT_LEFT / DEFAULT_RIGHT (Moreton Bay haiku pair).
 *
 * Offline, $0, no secrets, no network.
 */
import { readFileSync } from 'node:fs';
import {
  formatSunsetDiff,
  DEFAULT_LEFT,
  DEFAULT_RIGHT,
} from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`sunset-difftool — Diff tool that colors changes like a Moreton Bay sunset

Usage:
  npm run sunset-difftool -- "left text" "right text"
  npm run sunset-difftool -- --file left.txt right.txt
  npm run sunset-difftool -- --words "old line" "new line"
  node products/sunset-difftool/cli.mjs

No args → defaults to a short Moreton Bay haiku pair.

Flags:
  --file <a> <b>   Diff two UTF-8 files (offline read)
  --words          Word-glints on adjacent -/+ line pairs
  --no-color       Plain markers without ANSI
  -h / --help      Show this help

Offline, $0, no secrets. Exit 0 on success.
`);
  process.exit(0);
}

let useColor = true;
let showWords = false;
let fileMode = false;
/** @type {string[]} */
const positional = [];

for (let i = 0; i < raw.length; i++) {
  const a = raw[i];
  if (a === '--no-color') {
    useColor = false;
    continue;
  }
  if (a === '--words' || a === '-w') {
    showWords = true;
    continue;
  }
  if (a === '--file' || a === '-f') {
    fileMode = true;
    const fa = raw[i + 1];
    const fb = raw[i + 2];
    if (fa == null || fb == null) {
      console.error('sunset-difftool — --file needs two paths');
      process.exit(1);
    }
    positional.push(fa, fb);
    i += 2;
    continue;
  }
  positional.push(a);
}

/** @type {string} */
let left;
/** @type {string} */
let right;

if (fileMode) {
  if (positional.length < 2) {
    console.error('sunset-difftool — --file needs two paths');
    process.exit(1);
  }
  try {
    left = readFileSync(positional[0], 'utf8');
    right = readFileSync(positional[1], 'utf8');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`sunset-difftool — file read failed: ${msg}`);
    process.exit(1);
  }
} else if (positional.length >= 2) {
  left = positional[0];
  right = positional[1];
} else if (positional.length === 1) {
  left = positional[0];
  right = DEFAULT_RIGHT;
} else {
  left = DEFAULT_LEFT;
  right = DEFAULT_RIGHT;
}

console.log(
  formatSunsetDiff(left, right, { color: useColor, words: showWords }),
);
process.exit(0);
