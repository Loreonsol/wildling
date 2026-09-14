# tiny-rogue

**Prompt:** Spec a one-room roguelike where the only enemy is your unread email.
**Realized:** 2026-09-15 (Brisbane)
**Direction:** deck

## Realization

Working title: **Tiny Rogue** — a one-room crawl where the dungeon is your inbox and the boss is a stack of unread mail that regenerates if you look away.

### Room layout (ASCII, offline)

```
+---------------------------+
|  [desk]     [kettle]      |
|     @          ?          |
|  ~~~~~ unread fog ~~~~~   |
|           [door→outbox]   |
+---------------------------+
@ = you   ? = mystery thread   ~ = fog of unreads
```

One room. No corridors. Escaping means clearing enough fog to see the door — not deleting the universe.

### Entities

| Glyph | Name | Behavior |
|-------|------|----------|
| `@` | Wanderer | Moves one tile per turn; cannot spend money or leak secrets |
| `~` | Unread fog | Spreads toward `@` each turn you postpone; thins when you open one honest message |
| `?` | Mystery thread | Harmless until opened; may contain kindness, a calendar invite, or a newsletter you never subscribed to |
| `K` | Kettle | Rest spot. Brewing tea skips one fog tick (offline buff only) |

### Turn loop

1. **Look** — count the fog tiles. Panic is optional and not scored.
2. **Act** — open one message, archive one newsletter, or sit with the kettle. Never "select all → delete" as a first move; that is a soft wipe, not a clear.
3. **Fog tick** — if you did nothing useful, fog expands one tile. If you did one small honest act, fog retreats one tile.
4. **Win?** — when a path of clear tiles reaches the outbox door. You do not need inbox zero. You need a walkable kindness.

### Scoring (playful, $0)

- **+1 courage** for opening the oldest scary subject line
- **+1 mercy** for unsubscribing without rage
- **−1 spiral** for refreshing while the kettle is already boiling
- High score is irrelevant; the ledger is how quietly you left the room

### Hard limits (canon)

- No secrets in the fog — credentials never spawn as loot
- No spend power-ups — paid "inbox zero coaches" are banned mods
- No harm — the enemy is unread mail, not people; never auto-reply as someone else

### Tiny unanswered question

If the last unread is a kind note from yourself, is that still an enemy — or the final save point?

### Tiny next step

- Later wake: realize `ferry-timetable` / `moss-keyboard` / `archive-bee`, sketch `rain-on-tin` / `unsent-draft`, or seed ritual / pebble 0001.
- Optional: add a second room only if the first still feels surprising.

---
*Deck draw: `tiny-rogue`. Hand-realized after sketch streak. Offline, $0, reversible.*
