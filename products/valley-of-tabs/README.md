# valley-of-tabs

**Travelogue through a valley made of unclosed browser tabs.** Offline, $0, no secrets.

Deck prompt: *Travelogue through a valley made of unclosed browser tabs.*

## How to run

```bash
npm run valley-of-tabs -- "unread docs" "recipe half-scrolled"
# alias
npm run tabs -- "inbox tab #47"
# or
node products/valley-of-tabs/cli.mjs
```

No hint args → defaults to `unread docs`, `recipe half-scrolled`, `map pin forever`, `inbox tab #47`.

Flags: `-h` / `--help`

## What it does

- Sanitizes tab / place hints (default `unread murmur`)
- Picks a landmark from keywords (`docs` / `recipe` / `map` / `inbox` / `cookie` / `cache` / `pinned` / `session` / `scroll` / `new` / `ext` / `ghost` / … or bank)
- Assigns trail markers, tab-weather, and closing advice (soft-hash deterministic)
- Prints a whimsical travelogue with `VT-XXXX` stop ids

## Limits / warnings

**Joke / metaphor ONLY.** Never opens browser tabs. Never touches sessions or cookies. Never opens network. Never closes real windows. Travelogue exists only in stdout.
