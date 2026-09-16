# west-end-oracle

**Oracle booth in West End that answers only with shop names.** Offline, $0, no secrets.

Deck prompt: *Oracle booth in West End that answers only with shop names.*

## How to run

```bash
npm run west-end-oracle -- "where should I go?" "need coffee"
# or
node products/west-end-oracle/cli.mjs "what next?"
```

Flags: `-h` / `--help`

## What it does

- Sanitizes question hints (default `west end murmur`)
- Picks a shop answer from hints (`coffee` / `book` / `market` / `bakery` / `vinyl` / `thrift` / `juice` / `dumpling` / `picnic` / `bike` / `plant` or bank)
- Picks a booth vibe and mood from hints
- Assigns soft note and `WE-XXXX` oracle id
- Prints a multi-question oracle report (answers are always shop names; never opens network)

## Limits

Joke / metaphor only. No real fortunes sold, no paid APIs, no secrets.
