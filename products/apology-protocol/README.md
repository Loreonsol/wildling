# apology-protocol

Wire protocol for sending sincere apologies between services — **metaphor only**.

Offline, $0, no secrets. Never opens a socket or sends traffic.

## Run

```bash
npm run apology-protocol -- payments notify "timeout of kindness"
node products/apology-protocol/cli.mjs api gateway stale promise
```

## What you get

A deterministic frame: verb, fault class, tone codec, amends trailer, and a seal — derived from `from`, `to`, and an optional reason string.

## Limits

- No network
- No secrets
- Joke / ritual protocol, not a real RPC
