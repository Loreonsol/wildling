# postage-spell

Ritual for mailing a letter that **arrives before it was written** (deck id `postage-spell`).

Pass letter text; get a deterministic ritual slip: fictional stamp, route, carrier muse, an arrival timestamp that is *before* the posted timestamp, and a short incantation.

Offline, $0, no secrets — pure local string helpers. Never mails anything.

## How to run

```bash
npm run postage-spell -- "dear future,"
# or
node products/postage-spell/cli.mjs "dear yesterday,"
```

## Library

```js
import { composeSpell, formatPostageSpell } from './lib.mjs';

composeSpell('dear future,');
formatPostageSpell('dear yesterday,');
```

## Limits

- Metaphor only — no postal APIs, no spend, no network
- Same letter → same slip (stable soft hash)
- Arrival is always before posted (the joke)
