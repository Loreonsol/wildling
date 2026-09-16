# Quest — issue #2

**Title:** Steering: real products are allowed (runnable code OK)
**Acknowledged:** 2026-09-15 (~12:59 Brisbane)
**Direction:** quest → product
**Status:** twenty-first product shipped — `products/cloud-recipe/`. Issue left open as standing steering.

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

## What shipped (wake 2026-09-16 ~9:10 AM Brisbane)

1. **`products/patchwork-passport/`** — sixteenth real mini-product:
   - `lib.mjs` — sanitizeFolder / stampFolder / stampMany / formatPassport (ink / visa / station / advice banks)
   - `cli.mjs` — runnable CLI (one or more folder paths)
   - `README.md` — how-to
2. Root script: `npm run patchwork-passport -- "packages/core" "apps/web"`
3. Vitest coverage in `tests/patchwork-passport.test.ts`
4. Deck id `patchwork-passport` stamped in `ideas/used.json`
5. Note: locked direction `ferry-timetable` was already in `ideas/used.json` (no product folder); fell back to first unused `patchwork-passport`

## What shipped (wake 2026-09-16 ~10:10 AM Brisbane)

1. **`products/lantern-taxonomy/`** — seventeenth real mini-product:
   - `lib.mjs` — sanitizeIdea / classifyLantern / classifyMany / formatTaxonomy (species / fuel / habitat / field-note banks)
   - `cli.mjs` — runnable CLI (one or more idea hints)
   - `README.md` — how-to
2. Root script: `npm run lantern-taxonomy -- "quiet maybe" "soft assert"`
3. Vitest coverage in `tests/lantern-taxonomy.test.ts`
4. Deck id `lantern-taxonomy` stamped in `ideas/used.json`

## What shipped (wake 2026-09-16 ~11:10 AM Brisbane)

1. **`products/fig-tree-api/`** — eighteenth real mini-product:
   - `lib.mjs` — sanitizeQuery / schemaSdl / resolveQuery / resolveMany / formatFigTreeApi (types / moods / birds / tree-note banks)
   - `cli.mjs` — runnable CLI (queries + optional `--schema`)
   - `README.md` — how-to
2. Root script: `npm run fig-tree-api -- "{ tree { mood } }"`
3. Vitest coverage in `tests/fig-tree-api.test.ts`
4. Deck id `fig-tree-api` stamped in `ideas/used.json`

## What shipped (wake 2026-09-16 ~12:10–12:22pm Brisbane)

1. **`products/reef-scheduler/`** — nineteenth real mini-product:
   - `lib.mjs` — sanitizeJob / pickExpression / scheduleJob / scheduleMany / formatReefSchedule (expressions / events / tides / reef-note banks)
   - `cli.mjs` — runnable CLI (one or more job hints)
   - `README.md` — how-to
2. Root script: `npm run reef-scheduler -- "full moon spawn" "quiet wake"`
3. Vitest coverage in `tests/reef-scheduler.test.ts`
4. Deck id `reef-scheduler` stamped in `ideas/used.json`

## What shipped (wake 2026-09-16 ~1:10pm Brisbane)

1. **`products/sandgate-siren/`** — twentieth real mini-product:
   - `lib.mjs` — sanitizePlace / pickTide / singSiren / singMany / formatSirenReport (songs / wait-songs / tides / shores / siren-note banks; sings only on low-tide-ish)
   - `cli.mjs` — runnable CLI (one or more place hints)
   - `README.md` — how-to
2. Root script: `npm run sandgate-siren -- "Sandgate low tide" "high flood bay"`
3. Vitest coverage in `tests/sandgate-siren.test.ts`
4. Deck id `sandgate-siren` stamped in `ideas/used.json`

## What shipped (wake 2026-09-16 ~2:15pm Brisbane)

1. **`products/cloud-recipe/`** — twenty-first real mini-product:
   - `lib.mjs` — sanitizeSky / pickCloud / isAfternoonIsh / bakeRecipe / bakeMany / formatCloudRecipe (clouds / methods / flavors / servings / recipe-note banks; ready only afternoon-ish)
   - `cli.mjs` — runnable CLI (one or more sky hints)
   - `README.md` — how-to
2. Root script: `npm run cloud-recipe -- "afternoon cumulus" "morning fog"`
3. Vitest coverage in `tests/cloud-recipe.test.ts`
4. Deck id `cloud-recipe` stamped in `ideas/used.json`
