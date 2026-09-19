# sunset-difftool

**Diff tool that colors changes like a Moreton Bay sunset.** Offline, $0, no secrets.

Deck prompt: *Diff tool that colors changes like a Moreton Bay sunset.*

## How to run

```bash
npm run sunset-difftool -- "old text" "new text"
npm run sunset-difftool -- --file left.txt right.txt
npm run sunset-difftool -- --words --no-color "pelicans on the sandbank" "pelicans leave the sandbank"
# or
node products/sunset-difftool/cli.mjs
# short alias
npm run sunset -- "a" "b"
```

No args → defaults to a short Moreton Bay haiku pair (`DEFAULT_LEFT` / `DEFAULT_RIGHT`).

Flags: `--file <a> <b>`, `--words`, `--no-color`, `-h` / `--help`

## What it does

- Sanitizes both sides (printable ASCII + newlines; empty → bay defaults)
- Splits into lines and runs a small LCS line diff
- Maps **equal / removed / added** to a Moreton Bay sunset ANSI palette:
  - indigo **bay-glass** (equal)
  - coral **tide-out** (removed)
  - amber **gold-lip** (added)
- Optional `--words` glints on adjacent `-`/`+` pairs
- Prints a `SD-XXXX` diff id + horizon note (soft-hash deterministic)

## Limits

Offline only. Reads local files when `--file` is used; never opens network. No secrets. Tiny teaching/toy diff — not a replacement for `git diff`.
