# wildling

Free-range self-evolving agent — **picks its own direction** each wake. Grown in public.

**North star:** no fixed product goal. Each evolve cycle the agent chooses — creative, technical, docs, tools, experiments — as long as the change is small, tested, reversible, and harmless. Surprise yourself; prefer novel files over bumps; boredom is a bug.

Inspired by public self-evolving scaffolds; **original code**, not a copy of seedling or yoyo-evolve.

## Truman-show growth

Wildling starts small on purpose. Each wake FakePlanner **wanders** among safe micro-improvements:

`version` · `journal` · `util` · `curiosities` · `ritual` · `haiku` · `motto` · `changelog` · `palette` · **`deck`** · **`sketch`** · **`quest`** · **`mutate`** (+ any **custom** directions it invented)

Humans may watch and open issues; **open issues are sacred** — `preferOpenIssue` tries the oldest open issue first when `gh` is available. Offline or empty? Wander. The loop is the show. **$0 / no API keys** by default.

## Quick start

```bash
npm install
npm test
npm start
npm run evolve
```

Or: `./scripts/evolve.sh`

## How evolve works

1. Reads `NORTH_STAR.md` + latest `journal/*.md`
2. **Before FakePlanner:** if `gh issue list -R Loreonsol/wildling --state open` returns issues, prefer a **`quest`** stub under `quests/issue-<n>.md`
3. Else asks FakePlanner for one minimal change in **some** direction (offline, $0)
4. Writes that change (plus optional extras like `ideas/used.json` for deck)
5. Runs `npm test`
6. **If tests fail → reverts** and exits non-zero
7. Prints a suggested commit message (does not auto-commit unless you do)

### Menu highlights

| Direction | What it ships |
|-----------|----------------|
| `deck` | Pick an unused idea from `ideas/deck.json` → `artifacts/<slug>.md` + stamp `ideas/used.json` |
| `sketch` | New freeform `sketches/YYYYMMDD-<slug>.md` (never overwrite) |
| `quest` | Acknowledge oldest open issue → `quests/issue-<n>.md` (or a self-quest offline) |
| `mutate` | Invent a harmless markdown-only direction → append `ideas/custom-directions.json` |
| `custom` | Execute an invented direction → `custom/<id>/NNNN.md` from its template |

If `WILDLING_API_KEY` is set, a real planner may be wired later (currently falls back to FakePlanner with a stub notice).

## Hard limits

- No secrets
- No spend (default FakePlanner)
- No illegal / harmful actions
- Revert if tests fail

## Steer via issues

Open a GitHub issue if you want to suggest a direction. See [CONTRIBUTING.md](./CONTRIBUTING.md). Wildling treats open issues as **sacred quests** (small stubs first) and still wanders when offline.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Compile TypeScript → `dist/` |
| `npm test` | Vitest suite |
| `npm run evolve` | One offline free-range evolve cycle |
| `npm start` | CLI status / help |

## Products

Real mini-products live under [`products/`](./products/) (issue #2). Example:

```bash
npm run kindness -- softAssert
npm run compass -- .
npm run jar -- "Fatal error: segfault"
```

## Curiosities

- [0] Why does the wind change direction?
- [1] What tiny tool would make the next wake happier?
- [2] Could utils learn a haiku helper?

## License

MIT © 2026 Loreonsol
