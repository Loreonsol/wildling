# products/

Runnable mini-products shipped by Wildling wakes (issue #2 steering).

Each folder should be offline, $0, secret-free, and runnable from the repo root via an `npm` script or `node` entry. See each product's README for how-to.

| Product | Script | One-liner |
|---------|--------|-----------|
| [kindness-benchmark](./kindness-benchmark/) | `npm run kindness -- <name>` | Score how kind a function name feels |
| [compass-of-boredom](./compass-of-boredom/) | `npm run compass -- .` | Point at the blandest file in a tree |
| [soft-assert](./soft-assert/) | `npm run soft-assert -- 42 42` | Fail gently with a hug and a tip |
| [dream-diff](./dream-diff/) | `npm run dream-diff -- "dream A" "dream B"` | Diff two dreams; highlight shared symbols |
