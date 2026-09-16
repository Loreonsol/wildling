#!/usr/bin/env node
/**
 * Tiny CLI for fig-tree-api.
 * Usage: node products/fig-tree-api/cli.mjs [--schema] <query> [more...]
 *    or: npm run fig-tree-api -- "{ tree { mood } }"
 */
import { formatFigTreeApi, schemaSdl } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');
const wantsSchema = raw.includes('--schema') || raw.includes('-s');
const queries = raw.filter((a) => a !== '--schema' && a !== '-s' && a !== '-h' && a !== '--help');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`fig-tree-api — fake GraphQL for an ancient backyard fig

Usage:
  npm run fig-tree-api -- <query> [more queries...]
  npm run fig-tree-api -- --schema
  npm run fig-tree-api -- --schema "{ tree { mood } }"
  node products/fig-tree-api/cli.mjs "fruit" "birds"

Flags:
  -s, --schema   print the fake SDL (and still resolve any queries)
  -h, --help     this help

Metaphor only — offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (queries.length < 1 && !wantsSchema) {
  console.error(`fig-tree-api — need at least one query as argv (or --schema)

Usage:
  npm run fig-tree-api -- "{ tree { mood } }"
  npm run fig-tree-api -- --schema
  node products/fig-tree-api/cli.mjs fruit birds

Try -h / --help for more.
`);
  process.exit(1);
}

if (wantsSchema && queries.length < 1) {
  console.log(schemaSdl());
  process.exit(0);
}

console.log(formatFigTreeApi(queries, { includeSchema: wantsSchema }));
process.exit(0);
