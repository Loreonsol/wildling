# regex-familiar

Familiar spirit that takes the form of a **friendly regular expression** (deck id `regex-familiar`).

Pass an intent / wish; get a deterministic summoning card: familiar name, decorative pattern shape, disposition, binding tip, prophecy, and sigil.

Offline, $0, no secrets — pure local string helpers. Never matches real data. Never network.

## How to run

```bash
npm run regex-familiar -- "emails of kindness"
# or
node products/regex-familiar/cli.mjs "trailing spaces please"
```

## Library

```js
import { summonFamiliar, formatFamiliar } from './lib.mjs';

summonFamiliar('emails of kindness');
formatFamiliar('trailing spaces please');
```

## Limits

- Metaphor only — patterns are costume, not production matchers
- Same intent → same card (stable soft hash)
- No spend, no secrets, no network
