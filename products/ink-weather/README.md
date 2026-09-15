# ink-weather

Weather report where precipitation is **colored ink** — metaphor only.

Offline, $0, no secrets. Never fetches real weather or opens a network socket.

## Run

```bash
npm run ink-weather -- "quiet desk" "Sandgate foreshore"
node products/ink-weather/cli.mjs Brisbane notebook
```

## What you get

A deterministic bulletin: sky mood, ink precip, landing surface, tip, chance %, and a report id — derived from each place string (and its position).

## Limits

- No network / no real weather APIs
- No secrets
- Joke / ritual forecast, not meteorology
