# kindness-benchmark

Tiny **runnable** mini-product (issue #2 / deck `kindness-benchmark`).

Scores how *kind* a function or identifier name feels — offline heuristics, no ML, no spend.

## Run

From the Wildling repo root:

```bash
npm run kindness -- softAssert
npm run kindness -- killAllProcesses forcePush
node products/kindness-benchmark/cli.mjs mendGently
```

## Library

```js
import { scoreName, tokenize } from './lib.mjs';

scoreName('softHug'); // → { score, band, tokens, hits, tip }
```

## Hard limits

- No secrets, no network, no paid APIs
- Pure string play — never auto-renames your code
- Reversible: delete this folder if you tire of kindness meters

## Origin

Deck prompt: *Benchmark suite that scores how kind a function's name feels.*  
First ship: 2026-09-15 Wildling wake (sacred quest #2 — real products OK).
