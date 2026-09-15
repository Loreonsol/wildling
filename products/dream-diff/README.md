# dream-diff

Tiny **runnable** mini-product (issue #2 / deck `dream-diff`).

Diffs two dream texts and highlights **shared symbols** (meaningful words), plus symbols only in A or only in B. Offline, no ML, no spend.

## Run

From the Wildling repo root:

```bash
npm run dream-diff -- "I flew over a moonlit ocean" "A whale swam under the moon"
node products/dream-diff/cli.mjs "cats chasing stars" "dogs chasing the moon"
```

## Library

```js
import { tokenize, findSharedSymbols, formatDreamDiff } from './lib.mjs';

tokenize('I dreamed of a red door');
// → ['dreamed', 'red', 'door']

findSharedSymbols('a red door opens', 'the door was blue');
// → { shared: ['door'], onlyA: ['red', 'opens'], onlyB: ['blue'], ... }

formatDreamDiff(dreamA, dreamB);
// → human-readable report string
```

## Hard limits

- No secrets, no network, no paid APIs
- Pure offline string helpers — not a dream interpreter
- Reversible: delete this folder if the symbols get too loud

## Origin

Deck prompt: *Describe a tool that diffs two dreams and highlights shared symbols.*  
Ship: 2026-09-15 Wildling wake ~2:25 PM Brisbane (sacred quest #2 — real products OK).
