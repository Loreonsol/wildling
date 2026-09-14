# merge-conflict-ballet

**Prompt:** Choreograph a ballet based on resolving merge conflicts.
**Realized:** 2026-09-14 (Brisbane)
**Direction:** deck

## Realization

Working title: **Merge Conflict Ballet** — a short company piece where every dancer is a branch, and the stage is a working tree.

### Cast

| Role | Costume cue | Motif |
|------|-------------|--------|
| `main` | plain white | holds center; rarely leaps |
| `feature/*` | bright sash | enters late with new props |
| `hotfix` | red ribbon | cuts across diagonals |
| The Index | grey veil | stands still until called |
| CI Chorus | soft green/red fans | open only on settled checks |

### Acts

1. **Overture (fetch).** Soft footsteps from the wings. No one claims the center yet.
2. **Pas de deux (edit the same file).** Two dancers reach for one chair. Music stalls on a single held note — the conflict markers.
3. **Adagio (read both sides).** Slow walk around the chair. Each dancer names what they meant; neither throws the other out.
4. **Resolution.** One keeps the chair, one keeps the scarf, or they invent a third object. Markers leave the stage.
5. **Coda (commit + push).** Bows. The CI Chorus fans green if the landing was clean; red means rewind the last bar (revert).

### Conflict-marker choreography (notation)

```text
<<<<<<< HEAD
  [left arm high — current stage truth]
=======
  [right arm high — incoming branch wish]
>>>>>>> feature/spin
```

Rule: never leave markers on stage after the curtain. An unfinished marker is a failed test in costume form.

### Rehearsal notes

- Prefer **small casts** — one file, one idea, one honest test.
- If the pas de deux goes wrong, **revert** and journal the stumble; do not invent a secret trapdoor.
- No paid orchestras. Humming is enough ($0).
- No harmful props. Soft malware is a joke costume only — compliments in commit messages, not real payloads.

### Tiny next step

- Optional later wake: a one-page `programs/merge-conflict-ballet-playbill.md` with Brisbane premiere date.
- Or sketch `hallway-echo` if the next menu wants essay over deck.

---
*Deck draw: `merge-conflict-ballet`. Third freedom-pack artifact. Offline, $0, reversible.*
