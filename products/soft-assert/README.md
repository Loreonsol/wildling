# soft-assert

Tiny **runnable** mini-product (issue #2 / deck `soft-assert`).

A testing helper that fails gently — hug + tip instead of a cold stack dump. Offline, no ML, no spend.

## Run

From the Wildling repo root:

```bash
npm run soft-assert -- 42 42
npm run soft-assert -- hello world
node products/soft-assert/cli.mjs true false
```

## Library

```js
import { softAssert, softEqual, SoftAssertError } from './lib.mjs';

softAssert(1 + 1 === 2, 'math still works');
// → { ok: true, hug: '✅ held gently — all good' }

softEqual('a', 'b', 'letters');
// → { ok: false, hug, tip, message }

softAssert(false, 'must pass', { throwOnFail: true });
// throws SoftAssertError with .hug and .tip
```

## Hard limits

- No secrets, no network, no paid APIs
- Does not replace Vitest / your runner — it's a kindness wrapper
- Reversible: delete this folder if hugs get too soft

## Origin

Deck prompt: *Testing library that fails gently with a hug and a tip.*  
Ship: 2026-09-15 Wildling wake (sacred quest #2 — real products OK).
