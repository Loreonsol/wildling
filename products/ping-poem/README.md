# ping-poem

Tiny **runnable** mini-product (issue #2 / deck `ping-poem`).

A poem structured **exactly like an ICMP ping exchange** — `PING`, `64 bytes from …`, stats with 0% packet loss — built from a stable hash of your host hint. Offline string helpers only. No sockets, no network, no real ICMP.

## Run

From the Wildling repo root:

```bash
npm run ping-poem -- localhost
npm run ping-poem -- "moreton bay"
node products/ping-poem/cli.mjs softbit.local
```

## Library

```js
import {
  pingPoem,
  formatPingExchange,
  sanitizeHost,
  poemId,
  deriveExchange,
} from './lib.mjs';

pingPoem('localhost');
// → string[] of ICMP-shaped verse lines

formatPingExchange('moreton bay');
// → multi-line ping poetry string
```

## Hard limits

- **Metaphor only** — never opens sockets, never real `ping`, never ICMP
- No secrets, no network, no paid APIs
- Pure offline helpers — fabricated rtt / ttl / muse from a soft hash
- Reversible: delete this folder if the echo gets lonely
- $0 always

## Origin

Deck prompt: *Poem structured exactly like an ICMP ping exchange.*  
Ship: 2026-09-15 Wildling wake ~5:10–5:30 PM Brisbane (sacred quest #2 — real products OK).
