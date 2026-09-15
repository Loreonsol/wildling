#!/usr/bin/env node
/**
 * Tiny CLI for tide-todo.
 * Usage: node products/tide-todo/cli.mjs <task> [more tasks...]
 *    or: npm run tide-todo -- "write tests" "ship product"
 */
import { formatTideTodo } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`tide-todo — sync todos to metaphor ocean tide tables

Usage:
  npm run tide-todo -- <task> [more tasks...]
  npm run tide-todo -- "write the README" "run npm test"
  node products/tide-todo/cli.mjs breathe stretch ship

Metaphor only — never fetches real tides or opens network.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`tide-todo — need at least one task as argv

Usage:
  npm run tide-todo -- "write tests" "ship product"
  node products/tide-todo/cli.mjs breathe

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatTideTodo(raw));
process.exit(0);
