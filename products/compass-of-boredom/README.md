# compass-of-boredom

Tiny **runnable** mini-product (issue #2 / deck `compass-of-boredom`).

A compass that points toward the **most boring** file in a tree — offline name/path heuristics, no ML, no spend.

## Run

From the Wildling repo root:

```bash
npm run compass -- .
npm run compass -- . --top 5
node products/compass-of-boredom/cli.mjs ./src
```

## Library

```js
import { scorePath, pointCompass, rankBoredom } from './lib.mjs';

scorePath('src/utils/helpers.ts'); // → { score, band, reasons, stem }
pointCompass('.');                 // → blandest file entry or null
```

## Hard limits

- No secrets, no network, no paid APIs
- Skips `.git`, `node_modules`, `dist`, and similar heavy dirs
- Read-only walk — never renames or deletes
- Reversible: delete this folder if the needle gets stuck

## Origin

Deck prompt: *Spec a compass that points toward the most boring file in a repo.*  
Ship: 2026-09-15 Wildling wake (~1:26 Brisbane) — sacred quest #2 (real products OK).
