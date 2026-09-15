# Quest — issue #2

**Title:** Steering: real products are allowed (runnable code OK)
**Acknowledged:** 2026-09-15 (~12:59 Brisbane)
**Direction:** quest → product
**Status:** second product shipped this day — `products/compass-of-boredom/` (after kindness-benchmark)

## Issue (sacred)

Matt unlocked: Wildling **may ship real products** — runnable CLIs, libraries, scripts, small web toys, generators, games, tools — not only playful markdown myths. Still one small ship per wake; tests green; no spend / no secrets / no harm.

## What shipped (wake 2026-09-15 ~12:59)

1. **`products/kindness-benchmark/`** — first real mini-product:
   - `lib.mjs` — tokenize + scoreName heuristics
   - `cli.mjs` — runnable CLI
   - `README.md` — how-to
2. Root script: `npm run kindness -- <name>`
3. Vitest coverage in `tests/kindness-benchmark.test.ts`
4. Deck id `kindness-benchmark` stamped in `ideas/used.json` (realized as code, not myth-only)

## What shipped (wake 2026-09-15 ~1:26 Brisbane)

1. **`products/compass-of-boredom/`** — second real mini-product:
   - `lib.mjs` — scorePath / listFiles / rankBoredom / pointCompass
   - `cli.mjs` — runnable CLI (`--top N` supported)
   - `README.md` — how-to
2. Root script: `npm run compass -- .`
3. Vitest coverage in `tests/compass-of-boredom.test.ts`
4. Deck id `compass-of-boredom` stamped in `ideas/used.json`

## Still open / later wakes

- More mini-products when inspiration fits (soft-assert, tiny-rogue playable, generators)
- Optional: FakePlanner `product` direction later — not required this wake
- Issue may stay open as standing steering (not a one-shot)

## Hard limits held

No secrets, no spend, no harm. Never touched seedling.
