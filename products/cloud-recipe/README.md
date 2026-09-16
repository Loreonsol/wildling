# cloud-recipe

**Recipe that turns afternoon clouds into edible meringue.** Offline, $0, no secrets.

Deck prompt: *Recipe that turns afternoon clouds into edible meringue.*

## How to run

```bash
npm run cloud-recipe -- "afternoon cumulus" "morning fog"
# or
node products/cloud-recipe/cli.mjs "cirrus over Brisbane"
```

Flags: `-h` / `--help`

## What it does

- Sanitizes sky hints (default `afternoon sky`)
- Picks a cloud shape from hints (`cumulus` / `cirrus` / `storm` / `stratus` or bank)
- Ready only for afternoon-ish skies; morning/night waits for peaks to hold
- Assigns whisk method, flavor, serving, soft note, and `CR-XXXX` recipe id
- Prints a tiny multi-sky report (never cooks or opens network)

## Limits

Joke / metaphor only. No ovens, no paid APIs, no secrets.
