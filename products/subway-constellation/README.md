# subway-constellation

**Connect train stations into a constellation chart of transfers.** Offline, $0, no secrets.

Deck prompt: *Connect train stations into a constellation chart of transfers.*

## How to run

```bash
npm run subway-constellation -- Central "Roma Street" "South Bank"
# alias
npm run subway -- "Park Road" Airport
# or
node products/subway-constellation/cli.mjs
```

No station args → defaults to Central, Roma Street, South Bank, Park Road.

Flags: `-h` / `--help`

## What it does

- Sanitizes station names (default `platform murmur`)
- Maps each station to a constellation star (`central` / `roma` / `south` / `park` / `ferry` / `airport` / … or bank)
- Draws transfer hops as named constellation lines between consecutive stations
- Prints an ASCII star map plus hop counts and a soft chart note
- Assigns `SC-XXXX` star / chart ids (soft-hash deterministic)

## Limits

Joke / metaphor only. No real fares, no paid APIs, no secrets.
