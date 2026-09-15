# patchwork-passport

**Passport stamps for monorepo folders** — metaphor only.

Offline, $0, no secrets. Never opens a network socket or reads real remotes.

## Run

```bash
npm run patchwork-passport -- "packages/core" "apps/web"
node products/patchwork-passport/cli.mjs src/ utils/
```

Pass one or more folder / path hints; each gets a deterministic ink, visa, border station, and stamp id.

## What you get

A printable passport page: ink color, visa style, station, metaphor page count, stamp id, and soft advice.

## Limits

- No network
- No secrets
- Joke / ritual travel docs, not a real auth or CI gate
