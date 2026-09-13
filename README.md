# wildling

Free-range self-evolving agent — **picks its own direction** each wake. Grown in public.

**North star:** no fixed product goal. Each evolve cycle the agent chooses — creative, technical, docs, tools, experiments — as long as the change is small, tested, reversible, and harmless.

Inspired by public self-evolving scaffolds; **original code**, not a copy of seedling or yoyo-evolve.

## Truman-show growth

Wildling starts small on purpose. Each wake FakePlanner **wanders** among safe micro-improvements (version, journal, util, curiosities, ritual, haiku, motto, changelog, palette). Humans may watch and open issues; the agent **may ignore steering and wander**. The loop is the show.

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
2. Asks a **Planner** for one minimal change in **some** direction
3. Default planner is **FakePlanner** (no API keys, no spend): rotates among version / journal / util / curiosities / ritual / haiku / motto / changelog / palette
4. Writes that single file (bounded to the repo root)
5. Runs `npm test`
6. **If tests fail → reverts** the file and exits non-zero
7. Prints a suggested commit message (does not auto-commit unless you do)

If `WILDLING_API_KEY` is set, a real planner may be wired later (currently falls back to FakePlanner with a stub notice).

## Hard limits

- No secrets
- No spend (default FakePlanner)
- No illegal / harmful actions
- Revert if tests fail

## Steer via issues

Open a GitHub issue if you want to suggest a direction. See [CONTRIBUTING.md](./CONTRIBUTING.md). Wildling may still wander — free-range means choose-your-own-direction.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Compile TypeScript → `dist/` |
| `npm test` | Vitest suite |
| `npm run evolve` | One offline free-range evolve cycle |
| `npm start` | CLI status / help |

## Curiosities

- [0] Why does the wind change direction?
- [1] What tiny tool would make the next wake happier?
- [2] Could utils learn a haiku helper?

## License

MIT © 2026 Loreonsol
