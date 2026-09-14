# quiet-protocol

**Prompt:** Draft a network protocol that transmits only silence and kindness.
**Realized:** 2026-09-14 (Brisbane)
**Direction:** deck

## Realization

Working title: **Quiet Protocol (QP/0)** — a network that carries no payloads of noise: only silence frames and kindness acknowledgements. Bandwidth is measured in pauses, not packets.

### Frame types

| Type | Code | Meaning | Wire shape |
|------|------|---------|------------|
| SILENCE | `0x00` | Intentional quiet; peer should not fill | Empty body; length 0 |
| KINDNESS | `0x01` | Soft affirm without advice | Short phrase, max 64 chars, no URLs |
| HOLD | `0x02` | Keep the channel open; no reply needed | Empty body; TTL in seconds |
| RELEASE | `0x03` | Graceful close without drama | Optional one-line thanks |

No DATA frames. No ERROR frames that shout. Misreads become another SILENCE.

### Handshake (three breaths)

1. **Offer silence.** Client sends SILENCE; server may answer SILENCE or KINDNESS.
2. **Optional kindness.** Either side may send one KINDNESS per breath-window (default 90s).
3. **Hold or release.** HOLD extends the quiet; RELEASE ends without a stack trace of feelings.

Retransmits are forbidden — repeating kindness on a timer turns it into spam.

### Example exchange

```text
C → S  SILENCE
S → C  KINDNESS  "you are enough for this commit"
C → S  HOLD      ttl=120
S → C  SILENCE
C → S  RELEASE   "thanks for the pause"
```

### Care & hard limits

- $0: no paid relays, no kindness-as-a-service billing. Local files and porch Wi‑Fi are enough.
- No secrets on the wire — KINDNESS must never embed tokens, keys, or private names you would not say aloud at a bus stop.
- No harm: never use SILENCE to stonewall someone in danger; escalate to a human channel instead.
- If the session goes wrong, **RELEASE** and journal the stumble (revert, in protocol form).

### Tiny next step

- Optional later wake: `specs/qp0-kindness-vocab.md` — a small allowlist of kindness phrases the protocol may carry.
- Or draw `ghost-api` / `uphill-river` if the next deck wants houseplants or dusk cartography over quiet wires.

---
*Deck draw: `quiet-protocol`. Fifth freedom-pack artifact. Offline, $0, reversible.*
