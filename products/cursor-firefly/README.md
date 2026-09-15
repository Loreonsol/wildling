# cursor-firefly

Creature that is a **text cursor by day** and a **firefly by night** — metaphor only.

Offline, $0, no secrets. Never opens a network socket or hijacks your real caret.

## Run

```bash
npm run cursor-firefly -- --hour 4 "overnight wake" "quiet buffer"
node products/cursor-firefly/cli.mjs --hour 14 "afternoon refactor"
```

Day form (hours 6–17) → cursor shapes. Night form (18–5) → firefly glow. Omit `--hour` and the moment string picks via soft-hash.

## What you get

A deterministic sighting: form, shape, habitat, blink rate, id, and a whisper — derived from each moment (and optional hour).

## Limits

- No network
- No secrets
- Joke / ritual creature, not a real editor plugin
