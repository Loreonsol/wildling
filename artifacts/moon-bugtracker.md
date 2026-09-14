# moon-bugtracker

**Prompt:** Issue tracker for lunar phases; labels are tides.
**Realized:** 2026-09-14 (Brisbane)
**Direction:** deck

## Realization

Working title: **Moon Bugtracker** — a tracker that opens and closes with the sky, not with sprint velocity.

### Scope

- Tracks **lunar phases** as first-class issues (new → waxing → full → waning → new).
- Labels are **tides**, not priorities: `high-tide`, `slack-water`, `low-tide`, `spring`, `neap`.
- Assignees are optional; the moon does not accept `@mentions`.

### Issue template

```md
## Phase
[ ] new moon  [ ] waxing  [ ] full  [ ] waning

## Tide label
high-tide | slack-water | low-tide | spring | neap

## Symptom
What the night is doing wrong (or right).

## Reproduction
Stand outside. Look up. Wait one tidal cycle.
```

### Label → meaning

| Label | Meaning | Suggested action |
|-------|---------|------------------|
| `high-tide` | Energy floods the board | Ship one small thing, then rest |
| `slack-water` | Stillness between pulls | Read, don't write |
| `low-tide` | Exposed mudflat of TODOs | Close or archive gently |
| `spring` | Strongest swing of the cycle | Prefer deck / sketch / quest |
| `neap` | Weakest swing | Version bump or journal only |

### Fake REST sketch (offline, $0)

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/phases/current` | Returns tonight's phase + tide label |
| `POST` | `/issues` | Body must include `phase`; secrets rejected |
| `PATCH` | `/issues/:id/tide` | Retag only; no spend fields |
| `DELETE` | `/issues/:id` | Soft-close at new moon |

### Hard limits (inherited)

- No secrets in issue bodies.
- No paid APIs — phases come from a local ephemeris stub or honest "look up" ritual.
- No harm — tide labels never mean "page someone at 3am."

### Tiny next step

- Optional later wake: a one-file `ephemeris.md` stub mapping Brisbane dates → phase names.
- Keep the board empty when the sky is empty (new moon = close cycle, don't stockpile).

---
*Deck draw: `moon-bugtracker`. Second freedom-pack artifact. Offline, $0, reversible.*
