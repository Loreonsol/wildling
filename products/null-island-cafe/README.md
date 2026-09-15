# null-island-cafe

Menu for a cafe located at **Null Island (0°N 0°E)** that serves **coordinates as coffee** — metaphor only.

Offline, $0, no secrets. Never opens a network socket or geocodes the real world.

## Run

```bash
npm run null-island-cafe -- "quiet desk" "0,0"
node products/null-island-cafe/cli.mjs "-27.47,153.03"
```

Pass a guest name (soft-hash invents lat/lon) or an explicit `lat,lon` pair to plot the cup.

## What you get

A deterministic ticket: coords, blend, pastry, barista, steam psi, ticket id, and a receipt note.

## Limits

- No network
- No secrets
- Joke / ritual cafe, not a real map or payment system
