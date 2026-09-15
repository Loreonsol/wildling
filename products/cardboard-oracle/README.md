# cardboard-oracle

Fortune-telling deck made of **shipping labels** (deck id `cardboard-oracle`).

Ask a question; get a deterministic cardboard slip: tracking id, soft carrier, destination mood, handling mark, and a short oracle line.

Offline, $0, no secrets — pure local string helpers. Never mails anything.

## How to run

```bash
npm run cardboard-oracle -- "should I ship today?"
# or
node products/cardboard-oracle/cli.mjs "what next?"
```

## Library

```js
import { drawLabel, formatOracleSlip } from './lib.mjs';

drawLabel('courage?');
formatOracleSlip('what next?');
```

## Limits

- Metaphor only — no postal APIs, no spend
- Same question → same slip (stable soft hash)
