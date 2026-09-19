#!/usr/bin/env node
/**
 * Tiny CLI for valley-of-tabs.
 * Usage: node products/valley-of-tabs/cli.mjs [tab-or-place-hint...]
 *    or: npm run valley-of-tabs -- "unread docs" "recipe half-scrolled"
 * No args → DEFAULT_TABS.
 *
 * JOKE ONLY — prints a travelogue; never opens tabs or network.
 */
import { formatTravelogue, DEFAULT_TABS } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`valley-of-tabs — Travelogue through a valley made of unclosed browser tabs

Usage:
  npm run valley-of-tabs -- [tab-or-place-hint...]
  npm run valley-of-tabs -- "unread docs" "recipe half-scrolled"
  npm run tabs -- "inbox tab #47"
  node products/valley-of-tabs/cli.mjs

No hints → defaults: ${DEFAULT_TABS.join(', ')}

Joke / metaphor only — never opens browser tabs or network.
Offline, $0, no secrets.
Exit 0 on success.
`);
  process.exit(0);
}

const hints = raw.length > 0 ? raw : [...DEFAULT_TABS];
console.log(formatTravelogue(hints));
process.exit(0);
