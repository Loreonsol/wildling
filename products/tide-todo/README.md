# tide-todo

Todo list that syncs tasks to ocean tide tables — **metaphor only**.

Offline, $0, no secrets. Never fetches real tides or opens a network socket.

## Run

```bash
npm run tide-todo -- "write the README" "run npm test"
node products/tide-todo/cli.mjs breathe stretch ship
```

## What you get

A deterministic tide table: phase, berth, priority glyph, advice tip, and a tide id — derived from each task string (and its position).

## Limits

- No network / no real tide APIs
- No secrets
- Joke / ritual planner, not a productivity SaaS
