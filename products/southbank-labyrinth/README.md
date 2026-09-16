# southbank-labyrinth

**Map a labyrinth beneath South Bank whose walls are sticky notes.** Offline, $0, no secrets.

Deck prompt: *Map a labyrinth beneath South Bank whose walls are sticky notes.*

## How to run

```bash
npm run southbank-labyrinth -- "Quiet Jetty" "neon EXIT?"
# or
node products/southbank-labyrinth/cli.mjs "Goodwill Bridge undercroft"
```

Flags: `-h` / `--help`

## What it does

- Sanitizes place / sticky hints (default `South Bank murmur`)
- Picks a sticky-note wall from hints (`yellow` / `mint` / `coral` / `blue` / `lilac` / `peach` / `neon` / `cream` or bank)
- Picks a chamber from hints (`jetty` / `wheel` / `pagoda` / `bridge` / `beach` / `gallery` / `arbour` / `promenade` or bank)
- Picks a turn from hints (`left` / `right` / `straight` / `spiral` / `backtrack` / `diagonal` / `pause` / `climb` or bank)
- Assigns graffiti, soft note, tiny ASCII map, and `SL-XXXX` map id
- Prints a multi-chamber labyrinth report (never opens network or digs tunnels)

## Limits

Joke / metaphor only. No real excavation, no paid APIs, no secrets.
