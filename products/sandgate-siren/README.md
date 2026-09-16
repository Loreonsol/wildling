# sandgate-siren

Invent a **siren who sings only at Sandgate at low tide**. Offline, $0, no secrets.

Deck prompt: *Invent a siren who sings only at Sandgate at low tide.*

## How to run

```bash
npm run sandgate-siren -- "Sandgate low tide" "high flood bay"
# or
node products/sandgate-siren/cli.mjs Sandgate "neap hush"
```

Flags: `-h` / `--help`

## What it does

- Sanitizes place hints (default `Sandgate`)
- Picks a metaphor tide from hints (`low` / `neap` / `ebb` → low; `high` / `flood` → high)
- Sings only on low-tide-ish tides; otherwise waits / stays silent
- Assigns shore texture, soft note, and `SS-XXXX` song id
- Prints a tiny multi-place report (never fetches real tides or opens network)

## Limits

Metaphor only. No tide APIs, no paid services, no secrets.
