# bug-parade

**Parade route for bugs marching out of a legacy codebase.** Offline, $0, no secrets.

Deck prompt: *Parade route for bugs marching out of a legacy codebase.*

## How to run

```bash
npm run bug-parade -- "null pointer plaza" "flaky CI arch"
# or
node products/bug-parade/cli.mjs "off-by-one in Main Street"
```

Flags: `-h` / `--help`

## What it does

- Sanitizes bug hints (default `legacy codebase`)
- Picks a bug kind from hints (`null` / `race` / `leak` / `flaky` / `stack` / `heisen` / `goto` / `off-by` or bank)
- Picks a parade route from hints (`spaghetti` / `circular` / `monolith` / `ci` / `deprecated` / `comment` / `refactor` / `main` or bank)
- Assigns formation, chant, soft note, and `BP-XXXX` parade id
- Prints a tiny multi-bug parade report (never opens network or patches prod)

## Limits

Joke / metaphor only. No real exploits, no paid APIs, no secrets.
