#!/usr/bin/env node
/**
 * Tiny CLI demo for soft-assert.
 * Usage: node products/soft-assert/cli.mjs <actual> <expected>
 *    or: npm run soft-assert -- 1 1
 */
import { softEqual, formatResult } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help') || raw.length < 2) {
  console.log(`soft-assert — fail gently with a hug and a tip

Usage:
  npm run soft-assert -- 42 42
  npm run soft-assert -- hello world
  node products/soft-assert/cli.mjs true true

Compares two CLI args with Object.is after JSON-ish parse
(numbers, true/false/null, else string). Offline, $0, no secrets.
`);
  process.exit(raw.includes('-h') || raw.includes('--help') ? 0 : 1);
}

function parseArg(s) {
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null') return null;
  if (s === 'undefined') return undefined;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

const actual = parseArg(raw[0]);
const expected = parseArg(raw[1]);
const result = softEqual(actual, expected, 'cli softEqual');
console.log(formatResult(result));
process.exit(result.ok ? 0 : 1);
