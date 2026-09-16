#!/usr/bin/env node
/**
 * Tiny CLI for cloud-recipe.
 * Usage: node products/cloud-recipe/cli.mjs <sky> [more skies...]
 *    or: npm run cloud-recipe -- "afternoon cumulus" "morning fog"
 */
import { formatCloudRecipe } from './lib.mjs';

const raw = process.argv.slice(2).filter((a) => a !== '--');

if (raw.includes('-h') || raw.includes('--help')) {
  console.log(`cloud-recipe — turns afternoon clouds into edible meringue

Usage:
  npm run cloud-recipe -- <sky> [more skies...]
  npm run cloud-recipe -- "afternoon cumulus" "morning fog"
  node products/cloud-recipe/cli.mjs "cirrus over Brisbane"

Joke / metaphor only — never cooks or opens network.
Offline, $0, no secrets.
Exit 0 on success; exit 1 on bad usage.
`);
  process.exit(0);
}

if (raw.length < 1) {
  console.error(`cloud-recipe — need at least one sky hint as argv

Usage:
  npm run cloud-recipe -- "afternoon cumulus" "quiet porch"
  node products/cloud-recipe/cli.mjs "afternoon sky"

Try -h / --help for more.
`);
  process.exit(1);
}

console.log(formatCloudRecipe(raw));
process.exit(0);
