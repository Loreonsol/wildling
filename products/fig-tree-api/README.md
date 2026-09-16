# fig-tree-api

**Fake GraphQL schema for querying an ancient backyard fig tree** — metaphor only.

Offline, $0, no secrets. Never opens a network socket or talks to a real tree.

## Run

```bash
npm run fig-tree-api -- "{ tree { mood fruitCount } }"
npm run fig-tree-api -- --schema
npm run fig-tree-api -- fruit birds "shade for matt"
node products/fig-tree-api/cli.mjs "{ tree { rootWhisper { message } } }"
```

Pass one or more query hints; each gets a deterministic fake GraphQL-ish response (tree / fruit / birds / shade / roots). Use `--schema` to dump the joke SDL.

## What you get

A printable resolver page: operation guess, type hint, request id, JSON `data`, and a soft tree note. Optional schema dump first.

## Limits

- No network
- No secrets
- Joke / ritual API, not a real GraphQL server or botanical instrument
