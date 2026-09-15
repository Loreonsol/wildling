# Quest — issue #2

**Title:** Steering: real products are allowed (runnable code OK)
**Acknowledged:** 2026-09-15 (~12:59 Brisbane)
**Direction:** quest → product
**Status:** twelfth product shipped this day — `products/tide-todo/` (after kindness-benchmark, compass-of-boredom, soft-assert, dream-diff, lullaby-compiler, jar-of-errors, ping-poem, cardboard-oracle, postage-spell, regex-familiar, apology-protocol)

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

## What shipped (wake 2026-09-15 ~1:45 Brisbane)

1. **`products/soft-assert/`** — third real mini-product:
   - `lib.mjs` — softAssert / softEqual / SoftAssertError / gentleFail
   - `cli.mjs` — runnable CLI (compare two args)
   - `README.md` — how-to
2. Root script: `npm run soft-assert -- <actual> <expected>`
3. Vitest coverage in `tests/soft-assert.test.ts`
4. Deck id `soft-assert` stamped in `ideas/used.json`

## What shipped (wake 2026-09-15 ~2:25 Brisbane)

1. **`products/dream-diff/`** — fourth real mini-product:
   - `lib.mjs` — tokenize / findSharedSymbols / formatDreamDiff
   - `cli.mjs` — runnable CLI (two dream strings)
   - `README.md` — how-to
2. Root script: `npm run dream-diff -- "dream A" "dream B"`
3. Vitest coverage in `tests/dream-diff.test.ts`
4. Deck id `dream-diff` stamped in `ideas/used.json`


## What shipped (wake 2026-09-15 ~3:15 Brisbane)

1. **`products/lullaby-compiler/`** — fifth real mini-product:
   - `lib.mjs` — tokenizeSource / toLullabySyllables / compileToLullaby / formatLullabyReport
   - `cli.mjs` — runnable CLI (source as argv string(s))
   - `README.md` — how-to
2. Root script: `npm run lullaby -- "const soft = true"`
3. Vitest coverage in `tests/lullaby-compiler.test.ts`
4. Deck id `lullaby-compiler` stamped in `ideas/used.json`

## What shipped (wake 2026-09-15 ~4:10–4:20 Brisbane)

1. **`products/jar-of-errors/`** — sixth real mini-product:
   - `lib.mjs` — softenMessage / sealError / sealMany / formatJarLabel / formatJarReport
   - `cli.mjs` — runnable CLI (one or more error strings)
   - `README.md` — how-to
2. Root script: `npm run jar -- "Fatal error: segfault"`
3. Vitest coverage in `tests/jar-of-errors.test.ts`
4. Deck id `jar-of-errors` stamped in `ideas/used.json`


## What shipped (wake 2026-09-15 ~5:10–5:30 Brisbane)

1. **`products/ping-poem/`** — seventh real mini-product:
   - `lib.mjs` — sanitizeHost / poemId / deriveExchange / pingPoem / formatPingExchange
   - `cli.mjs` — runnable CLI (host hint as argv)
   - `README.md` — how-to
2. Root script: `npm run ping-poem -- localhost`
3. Vitest coverage in `tests/ping-poem.test.ts`
4. Deck id `ping-poem` stamped in `ideas/used.json`

## What shipped (wake 2026-09-15 ~7:10–7:30 Brisbane)

1. **`products/postage-spell/`** — ninth real mini-product:
   - `lib.mjs` — sanitizeLetter / composeSpell / formatPostageSpell (arrival before posted)
   - `cli.mjs` — runnable CLI (letter text as argv)
   - `README.md` — how-to
2. Root script: `npm run postage-spell -- "dear future,"`
3. Vitest coverage in `tests/postage-spell.test.ts`
4. Deck id `postage-spell` stamped in `ideas/used.json`

## What shipped (wake 2026-09-15 ~8:10 PM Brisbane)

1. **`products/regex-familiar/`** — tenth real mini-product:
   - `lib.mjs` — sanitizeIntent / summonFamiliar / formatFamiliar (soft-hash muse banks)
   - `cli.mjs` — runnable CLI (intent text as argv)
   - `README.md` — how-to
2. Root script: `npm run regex-familiar -- "emails of kindness"`
3. Vitest coverage in `tests/regex-familiar.test.ts`
4. Deck id `regex-familiar` stamped in `ideas/used.json`

## Still open / later wakes

- More mini-products when inspiration fits (tiny-rogue playable, generators, other unused deck ids)
- Optional: FakePlanner `product` direction later — not required this wake
- Issue may stay open as standing steering (not a one-shot)

## Hard limits held

No secrets, no spend, no harm. Never touched seedling.

## What shipped (wake 2026-09-15 ~10:28 PM Brisbane)

1. **`products/tide-todo/`** — twelfth real mini-product:
   - `lib.mjs` — sanitizeTask / assignTide / syncTideTable / formatTideTodo
   - `cli.mjs` — runnable CLI (one or more task strings)
   - `README.md` — how-to
2. Root script: `npm run tide-todo -- "write tests" "ship product"`
3. Vitest coverage in `tests/tide-todo.test.ts`
4. Deck id `tide-todo` stamped in `ideas/used.json`

## What shipped (wake 2026-09-16 ~12:10 AM Brisbane)

1. **`products/ink-weather/`** — thirteenth real mini-product:
   - `lib.mjs` — sanitizePlace / forecastInk / forecastMany / formatInkWeather
   - `cli.mjs` — runnable CLI (one or more place strings)
   - `README.md` — how-to
2. Root script: `npm run ink-weather -- "quiet desk" "Sandgate foreshore"`
3. Vitest coverage in `tests/ink-weather.test.ts`
4. Deck id `ink-weather` stamped in `ideas/used.json`

## What shipped (wake 2026-09-16 ~4:10 AM Brisbane)

1. **`products/cursor-firefly/`** — fourteenth real mini-product:
   - `lib.mjs` — sanitizeMoment / normalizeHour / resolveForm / summonFirefly / summonMany / formatFireflyReport
   - `cli.mjs` — runnable CLI (moments + optional `--hour`)
   - `README.md` — how-to
2. Root script: `npm run cursor-firefly -- --hour 4 "overnight wake"`
3. Vitest coverage in `tests/cursor-firefly.test.ts`
4. Deck id `cursor-firefly` stamped in `ideas/used.json`


## What shipped (wake 2026-09-16 ~8:10 AM Brisbane)

1. **`products/null-island-cafe/`** — fifteenth real mini-product:
   - `lib.mjs` — sanitizeGuest / resolveCoords / brewOrder / brewMany / formatCafeMenu
   - `cli.mjs` — runnable CLI (guest names or lat,lon)
   - `README.md` — how-to
2. Root script: `npm run null-island-cafe -- "quiet desk" "0,0"`
3. Vitest coverage in `tests/null-island-cafe.test.ts`
4. Deck id `null-island-cafe` stamped in `ideas/used.json`
