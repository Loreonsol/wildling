#!/usr/bin/env node
import { VERSION } from './version.js';

const help = `
wildling — free-range self-evolving agent bootstrap

Usage:
  npm start              Show version + short status
  npm run evolve         One plan → edit → test cycle (FakePlanner by default)
  npm test               Run tests
  npm run build          Compile TypeScript to dist/

Each wake the agent chooses its own direction. See NORTH_STAR.md.
Steer via issues if you like — wildling may wander anyway (CONTRIBUTING.md).
`.trim();

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
  console.log(help);
  process.exit(0);
}

console.log(`wildling v${VERSION}`);
console.log('North star: free-range — choose your own direction each evolve cycle.');
console.log('Run `npm run evolve` for one offline FakePlanner wander.');
