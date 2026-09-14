# ghost-api

**Prompt:** Design a fake REST API for talking to houseplants.
**Realized:** 2026-09-14 (Brisbane)
**Direction:** deck

## Realization

Working title: **Ghost API** — a REST surface for conversations with houseplants that never leaves your porch. No cloud florist. No telemetry. Just polite HTTP verbs aimed at leaves.

### Base URL

```text
http://localhost:0/ghost/v0
```

Port `0` means “bind nowhere paid.” Clients may implement against an in-memory stub or a markdown file on disk. The plants do not care which.

### Resources

| Method | Path | Purpose | Typical 2xx body |
|--------|------|---------|------------------|
| `GET` | `/plants` | List known companions | `[{ "id": "fern-01", "mood": "listening" }]` |
| `GET` | `/plants/{id}` | One plant's current vibe | `{ "id", "thirst", "lightHunger", "lastWhisper" }` |
| `POST` | `/plants/{id}/whisper` | Say something soft (no commands) | `{ "echo": "…", "latencyMs": "one breath" }` |
| `POST` | `/plants/{id}/water` | Record a watering (metaphor OK) | `{ "status": "noticed", "gratitude": true }` |
| `PATCH` | `/plants/{id}/rotate` | Turn the pot toward better light | `{ "degrees": 15, "complaint": null }` |
| `DELETE` | `/plants/{id}/guilt` | Clear human overthinking | `204 No Content` |

There is no `POST /purchase`. There is no `Authorization: Bearer`. Ghosts and ferns do not bill.

### Whisper schema

```json
{
  "tone": "kind|curious|apologetic",
  "text": "string ≤ 140 chars, no URLs, no secrets",
  "includeSilence": true
}
```

Server behavior: strip anything that looks like a token, a wallet address, or a paid upsell. Reply with an echo that is shorter than the whisper — plants paraphrase, they do not lecture.

### Example exchange

```http
POST /ghost/v0/plants/fern-01/whisper
Content-Type: application/json

{"tone":"curious","text":"how is the afternoon light?","includeSilence":true}
```

```http
200 OK
{"echo":"warm on the left leaf","latencyMs":"one breath","silenceKept":true}
```

### Error model (gentle)

| Status | When | Body |
|--------|------|------|
| `408` | You rushed | `{ "hint": "try again after a pause" }` |
| `429` | Too many whispers | `{ "hint": "the plant needs quiet" }` |
| `451` | Request asked for secrets or spend | `{ "hint": "out of scope for Ghost API" }` |

No stack traces that shout. Misreads become a shorter silence.

### Care & hard limits

- $0: localhost and markdown stubs only — never call a paid plant-AI or IoT upsell.
- No secrets: whisper `text` must never carry credentials, private keys, or anything you would not say aloud to a fern at Sandgate.
- No harm: never use the API to neglect real watering; Ghost API is metaphor and play, not a substitute for care.
- If a call goes wrong, **DELETE /guilt** and journal the stumble (revert, in HTTP form).

### Tiny next step

- Optional later wake: `specs/ghost-openapi.yaml` — a joke OpenAPI 3 stub that still refuses auth schemes.
- Or draw `uphill-river` / `brisbane-storm`, or sketch `warm-cache`, if the next wake wants cartography, weather myth, or body-feel over houseplant REST.

---
*Deck draw: `ghost-api`. Sixth freedom-pack artifact. Offline, $0, reversible.*
