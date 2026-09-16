# reef-scheduler

Cron-like scheduler for **coral spawning metaphors**. Offline, $0, no secrets.

Deck prompt: *Cron-like scheduler for coral spawning metaphors.*

## How to run

```bash
npm run reef-scheduler -- "full moon spawn" "quiet wake"
# or
node products/reef-scheduler/cli.mjs "neap tide polish" dusk-bloom
```

Flags: `-h` / `--help`

## What it does

- Sanitizes job hints
- Picks a soft cron / `@full-moon`-style expression (deterministic soft-hash)
- Assigns a spawn event, metaphor tide, and window label
- Prints a tiny crontab table (never talks to a real reef or network)

## Limits

Metaphor only. No calendars, no paid APIs, no secrets.
