# glitch-garden

**Plant list for a garden that only grows on 404 pages.** Offline, $0, no secrets.

Deck prompt: *Plant list for a garden that only grows on 404 pages.*

## How to run

```bash
npm run glitch-garden -- "missing route" "ghost href"
# or
node products/glitch-garden/cli.mjs "/lost/page"
```

Flags: `-h` / `--help`

## What it does

- Sanitizes path / page hints (default `404 murmur`)
- Picks a plant from hints (`404` / `ivy` / `fern` / `moss` / `daisy` / `lily` / `vine` / `teapot` / `bookmark` / `weed` / `cache` / `gone` or bank)
- Picks a bed and soil from hints
- Assigns soft note and `GG-XXXX` plot id
- Prints a multi-hint plant list (flora only on missing pages; never opens network)

## Limits

Joke / metaphor only. No real horticulture billed, no paid APIs, no secrets.
