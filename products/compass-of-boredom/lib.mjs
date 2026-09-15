/**
 * compass-of-boredom — point toward the most boring file in a tree.
 * Offline, $0, no secrets. Pure path/name heuristics (not ML).
 */

import { readdirSync, statSync } from 'node:fs';
import { basename, extname, join, relative, sep } from 'node:path';

/** Names that smell like placeholder / dump drawers. */
const BORING_STEMS = [
  'util',
  'utils',
  'helper',
  'helpers',
  'misc',
  'tmp',
  'temp',
  'data',
  'common',
  'shared',
  'stuff',
  'foo',
  'bar',
  'baz',
  'old',
  'backup',
  'copy',
  'untitled',
  'new',
  'file',
  'test',
  'tests',
  'index',
  'main',
  'app',
  'lib',
  'src',
  'dist',
  'build',
  'output',
  'input',
  'config',
  'settings',
  'defaults',
  'constants',
  'types',
  'models',
  'handlers',
  'manager',
  'service',
  'controller',
  'base',
  'core',
  'commonplace',
];

/** Stems that feel alive — lower boredom. */
const LIVELY_STEMS = [
  'wildling',
  'kindness',
  'compass',
  'haiku',
  'ritual',
  'firefly',
  'dewdrop',
  'lantern',
  'quest',
  'sketch',
  'myth',
  'oracle',
  'siren',
  'moss',
  'ferry',
  'rogue',
  'stitch',
  'ember',
  'pebble',
  'garden',
  'lullaby',
  'postcard',
  'tideline',
  'curiosity',
  'north',
  'star',
  'wander',
  'journal',
];

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'coverage',
  '.next',
  '.turbo',
  '.cache',
]);

function stemOf(filename) {
  const base = basename(filename);
  const ext = extname(base);
  return (ext ? base.slice(0, -ext.length) : base).toLowerCase();
}

function tokens(stem) {
  return stem
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-.]+/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Score how boring a relative path feels (0 = lively, 100 = snooze).
 * @returns {{ score: number, band: string, reasons: string[], stem: string }}
 */
export function scorePath(relPath) {
  const reasons = [];
  const base = basename(relPath);
  const stem = stemOf(base);
  const toks = tokens(stem);
  let score = 40;

  for (const t of toks) {
    if (BORING_STEMS.includes(t)) {
      score += 18;
      reasons.push(`bland stem "${t}"`);
    }
    if (LIVELY_STEMS.includes(t)) {
      score -= 22;
      reasons.push(`lively stem "${t}"`);
    }
  }

  if (/^\d+$/.test(stem)) {
    score += 25;
    reasons.push('numeric-only name');
  }
  if (stem.length <= 2 && stem.length > 0) {
    score += 15;
    reasons.push('tiny name');
  }
  if (stem.length >= 24) {
    score -= 8;
    reasons.push('long quirky name');
  }
  if (!extname(base) && stem.length > 0) {
    score += 5;
    reasons.push('no extension');
  }
  // Deep nested misc/tmp folders feel dumpier
  const parts = relPath.split(/[/\\]/).map((p) => p.toLowerCase());
  for (const p of parts.slice(0, -1)) {
    if (BORING_STEMS.includes(p)) {
      score += 8;
      reasons.push(`bland folder "${p}"`);
    }
  }

  if (toks.length === 0) {
    score = 0;
    reasons.push('empty path');
  }

  score = Math.max(0, Math.min(100, score));

  let band;
  if (score >= 80) band = 'pure snooze';
  else if (score >= 60) band = 'office beige';
  else if (score >= 40) band = 'middling';
  else if (score >= 20) band = 'has a pulse';
  else band = 'alive and kicking';

  return { score, band, reasons, stem };
}

/**
 * Walk a directory tree (files only), skipping heavy/vendor dirs.
 * @returns {string[]} absolute paths
 */
export function listFiles(rootDir, { maxFiles = 500 } = {}) {
  const out = [];
  function walk(dir) {
    if (out.length >= maxFiles) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      if (out.length >= maxFiles) return;
      const name = ent.name;
      if (name === '.' || name === '..') continue;
      const full = join(dir, name);
      if (ent.isDirectory()) {
        if (SKIP_DIRS.has(name)) continue;
        walk(full);
      } else if (ent.isFile()) {
        out.push(full);
      }
    }
  }
  walk(rootDir);
  return out;
}

/**
 * Rank files by boredom; highest score first.
 * @returns {Array<{ path: string, rel: string, score: number, band: string, reasons: string[] }>}
 */
export function rankBoredom(rootDir, { maxFiles = 500 } = {}) {
  const files = listFiles(rootDir, { maxFiles });
  const ranked = files.map((abs) => {
    const rel = relative(rootDir, abs).split(sep).join('/');
    const r = scorePath(rel);
    return {
      path: abs,
      rel,
      score: r.score,
      band: r.band,
      reasons: r.reasons,
      stem: r.stem,
    };
  });
  ranked.sort((a, b) => b.score - a.score || a.rel.localeCompare(b.rel));
  return ranked;
}

/** Needle of the compass: the single most boring file (or null). */
export function pointCompass(rootDir, opts) {
  const ranked = rankBoredom(rootDir, opts);
  return ranked[0] ?? null;
}

export function formatNeedle(entry) {
  if (!entry) return 'compass spins… no files found.';
  const why =
    entry.reasons.length > 0
      ? entry.reasons.slice(0, 4).join('; ')
      : 'ineffable beige';
  return [
    `🧭 compass-of-boredom`,
    `   needle → ${entry.rel}`,
    `   boredom: ${entry.score}/100 (${entry.band})`,
    `   why: ${why}`,
  ].join('\n');
}

export { BORING_STEMS, LIVELY_STEMS, SKIP_DIRS };
