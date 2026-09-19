#!/usr/bin/env node
/**
 * Tiny CLI for biscuit-cipher.
 * Usage: node products/biscuit-cipher/cli.mjs [message...]
 *    or: npm run biscuit-cipher -- "pass the tin"
 * Flags: --key <hint>   --decode <text>   -h / --help
 * No args → DEFAULT_MESSAGES.
 *
 * JOKE ONLY — not real encryption; never protects secrets.
 */
import {
  formatCipherReport,
  DEFAULT_MESSAGES,
} from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`biscuit-cipher — Encryption scheme that uses Anzac biscuits as key material

Usage:
  npm run biscuit-cipher -- [message...]
  npm run biscuit-cipher -- "pass the tin"
  npm run biscuit-cipher -- --key "oat tin" "picnic note"
  npm run biscuit-cipher -- --decode "BC{abc}·ᚨ-oat"
  node products/biscuit-cipher/cli.mjs

No messages → defaults: ${DEFAULT_MESSAGES.join(', ')}

Flags:
  --key <hint>      Anzac biscuit key-material hint (joke only)
  --decode <text>   Joke-decode a ciphertext string
  -h / --help       Show this help

JOKE / METAPHOR ONLY — NOT real encryption, NOT cryptography, NOT secure.
Offline, $0, no secrets. Never protects anything.
Exit 0 on success.
`);
  process.exit(0);
}

let keyHint = undefined;
let decodeText = undefined;
const messages = [];

for (let i = 0; i < raw.length; i++) {
  const a = raw[i];
  if (a === '--key' || a === '-k') {
    const next = raw[i + 1];
    if (next == null) {
      console.error('biscuit-cipher — --key needs a hint string');
      process.exit(1);
    }
    keyHint = next;
    i++;
    continue;
  }
  if (a === '--decode' || a === '-d') {
    const next = raw[i + 1];
    if (next == null) {
      console.error('biscuit-cipher — --decode needs a ciphertext string');
      process.exit(1);
    }
    decodeText = next;
    i++;
    continue;
  }
  messages.push(a);
}

if (decodeText != null) {
  console.log(formatCipherReport([], { keyHint, decodeText }));
  process.exit(0);
}

const list = messages.length > 0 ? messages : [...DEFAULT_MESSAGES];
console.log(formatCipherReport(list, { keyHint }));
process.exit(0);
