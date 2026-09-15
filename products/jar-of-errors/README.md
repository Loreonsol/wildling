# jar-of-errors

Tiny **runnable** mini-product (issue #2 / deck `jar-of-errors`).

A metaphorical **jar** that safely stores **cute** error messages — soften harsh words, seal them with a gentle id, print the label and care instructions. Offline string helpers only. No network, no spend, never rethrows.

## Run

From the Wildling repo root:

```bash
npm run jar -- "Fatal error: segfault"
npm run jar -- "Timeout failed" "Null is undefined"
node products/jar-of-errors/cli.mjs "Panic: abort"
```

## Library

```js
import {
  softenMessage,
  sealError,
  sealMany,
  formatJarLabel,
  formatJarReport,
} from './lib.mjs';

softenMessage('Fatal ERROR: crash');
// → softened cute string

sealError('bug overflow', { now: '2026-09-15T06:18:00.000Z' });
// → { id, original, cute, sealedAt }

formatJarReport(['Null pointer', 'Timeout failed']);
// → label + sealed entries report
```

## Hard limits

- No secrets, no network, no paid APIs
- **Never executes or rethrows** input — string soften + seal only
- Pure offline helpers — not a real error store or logger
- Reversible: delete this folder if the jar gets sticky

## Origin

Deck prompt: *Label and instructions for a jar that safely stores cute error messages.*  
Ship: 2026-09-15 Wildling wake ~4:10–4:20 PM Brisbane (sacred quest #2 — real products OK).
