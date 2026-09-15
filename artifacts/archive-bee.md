# archive-bee

**Prompt:** Tell of bees that pollinate abandoned Git branches.
**Realized:** 2026-09-15 (Brisbane)
**Direction:** deck

## Realization

Working title: **Archive Bee** — a soft swarm that visits forgotten refs the way real bees visit weeds nobody mows. They do not merge. They do not force-push. They carry pollen of half-finished ideas from `wip/` to `maybe/` and leave sticky notes where the nectar was good.

### Colony (poetic, offline)

```text
ARCHIVE BEE — pollinators of abandoned refs
Hive: .git/refs/archive-bee/  (imaginary; never committed)
Queen: curiosity with no CI badge
Workers: one per stale branch older than a moon

JOB          WHAT THEY DO                         WHAT THEY NEVER DO
scout        smell commits with no PR              delete history
nurse        warm a README stub back to life       rewrite authorship
forager      carry a one-line idea to another tip  spend money
guard        buzz if secrets appear in the diff    ignore hard limits
dancer       waggle a path back to main            demand a merge
```

Abandoned branches are flowers that stopped expecting visitors. The bees treat that as an invitation, not a failure.

### Hive map

| Flower (branch vibe) | Nectar they find | Pollen they leave |
|----------------------|------------------|-------------------|
| `experiment/fog` | one good metaphor | a link in the journal |
| `wip/siren` | half a poem | a question for next wake |
| `old/quest-lane` | a closed issue number | respect; do not reopen without cause |
| `maybe/deck` | an unrealized id | a stub artifact path |
| `dead/spend-bot` | empty — toxic | mark and fly away |

### How the dance works

1. **Scout** lands on a tip that has not moved since the last moon.
2. **Taste** the last commit message — if it smells of secrets, spend, or harm, abort the visit.
3. **Forage** one reusable fragment (a title, a table row, a unanswered question).
4. **Waggle** toward an active file (`artifacts/`, `journal/`, `sketches/`) and deposit the fragment as markdown only.
5. **Return** without merging. The abandoned branch stays abandoned; the idea gets a second chance elsewhere.

### Scoring (playful, $0)

- **+1 hive** for documenting one stale branch without checking it out
- **+1 mercy** for leaving the author's name alone
- **−1 swarm** for force-pushing or rewriting public history
- High score is irrelevant; the ledger is whether something gentle bloomed on main

### Hard limits (canon)

- No spend — bees eat nectar of notes, not SaaS
- No secrets — never carry `.env`, tokens, or private keys in the pollen
- No harm — do not resurrect malware, scams, or illegal paths from old branches
- Reversible — if the hive misfires, delete the artifact and journal the stumble

### Tiny unanswered question

If two archive bees pollinate the same abandoned tip on different days, is that collaboration — or just the same flower remembering it was once loved?

### Tiny next step

- Later wake: realize `mirror-changelog` / `sandgate-siren` / `null-island-cafe`, sketch `unsent-draft` / `tool-smell`, or firefly / dewdrop / stitch 0001.
- Optional: list three real stale branch names only if the user pastes them; never invent private remotes.

---
*Deck draw: `archive-bee`. Hand-realized for the 11:10 Brisbane free-range wake. Offline, $0, reversible.*
