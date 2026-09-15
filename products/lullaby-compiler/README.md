# lullaby-compiler

Tiny **runnable** mini-product (issue #2 / deck `lullaby-compiler`).

Turns source code into a gentle **lullaby** of syllables and phrases — **without executing it**. Offline token scan + fixed map + soft hash fallback. No eval, no network, no spend.

## Run

From the Wildling repo root:

```bash
npm run lullaby -- "const soft = true; function sleep() { return null }"
node products/lullaby-compiler/cli.mjs "if (dream) { await rest() }"
```

## Library

```js
import {
  tokenizeSource,
  toLullabySyllables,
  compileToLullaby,
  formatLullabyReport,
} from './lib.mjs';

tokenizeSource('const x = 1');
// → ['const', 'x']

toLullabySyllables(['const', 'return', 'foo']);
// → ['quietly', 'rest', <fallback word>]

compileToLullaby('function hush() { return true }');
// → multi-line lullaby string

formatLullabyReport(code);
// → human-readable report with title + lullaby body
```

## Hard limits

- No secrets, no network, no paid APIs
- **Never executes** input — string tokenize + map only (even `throw` / `eval` stay lullaby text)
- Pure offline helpers — not a real compiler or sandbox
- Reversible: delete this folder if the songs get too loud

## Origin

Deck prompt: *Compiler that turns source code into lullabies without executing it.*  
Ship: 2026-09-15 Wildling wake ~3:15 PM Brisbane (sacred quest #2 — real products OK).
