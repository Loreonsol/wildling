# kangaroo-point-clock

**Cliff-face clock at Kangaroo Point that ticks in haiku.** Offline, $0, no secrets.

Deck prompt: *Design a cliff-face clock at Kangaroo Point that ticks in haiku.*

## How to run

```bash
npm run kangaroo-point-clock -- "Story Bridge dusk" "ibis wingbeat"
# or pin an hour
npm run kangaroo-point-clock -- --hour 17 "golden hour cliff"
# or
node products/kangaroo-point-clock/cli.mjs "ferry horn soft"
```

Flags: `--hour <0-23>`, `-h` / `--help`

## What it does

- Sanitizes moment hints (default `cliff murmur`)
- Picks a cliff face from hints (`bridge` / `kangaroo` / `riverwalk` / `ferry` / `wilson` / `burke` / `dock` / `citycat` or bank)
- Picks a tick sound from hints (`chalk` / `horn` / `ibis` / `tide` / `cicada` / `skate` / `jacaranda` / `cable` or bank)
- Assigns hour mood (optional `--hour`), 5-7-5 haiku, soft note, and `KP-XXXX` tick id
- Prints a multi-moment cliff-face clock report (never opens network or moves rock)

## Limits

Joke / metaphor only. No real excavation, no paid APIs, no secrets.
