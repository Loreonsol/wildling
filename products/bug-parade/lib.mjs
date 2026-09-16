/**
 * bug-parade — parade route for bugs marching out of a legacy codebase.
 * offline, $0, no secrets. Metaphor / joke only — never opens network or patches prod.
 */

/** Kinds of bugs that join the parade. */
export const BUG_KINDS = [
  'off-by-one beetle',
  'null-pointer moth',
  'race-condition cricket',
  'memory-leak snail',
  'heisenbug firefly',
  'stack-overflow locust',
  'flaky-test flea',
  'legacy-goto cockroach',
];

/** Parade routes through the codebase metaphor. */
export const ROUTES = [
  'down Main Street past the god-object plaza',
  'through the spaghetti alley of forgotten TODOs',
  'across the brittle bridge of circular imports',
  'around the monolith roundabout (three times)',
  'under the flaky CI arch and out to daylight',
  'along the deprecated boulevard of unused flags',
  'past the comment graveyard of "temporary" hacks',
  'out the emergency exit marked refactor-later',
];

/** Marching formations. */
export const FORMATIONS = [
  'single file of shame',
  'linked-list conga',
  'breadth-first swarm',
  'depth-first column',
  'pair-programmed pairs',
  'circular-buffer wheel',
  'stack of nested try/catch',
  'queue of patients waiting for triage',
];

/** Chants the bugs shout while marching. */
export const CHANTS = [
  'fix it forward! Fix it forward!',
  'We were features once!',
  'Legacy forever, patches never!',
  'Reproduce me if you can!',
  'One more sprint and we graduate!',
  'Stack traces unite!',
  'Cannot reproduce — still here!',
  'Ship it, then chase us!',
];

/** Soft notes printed under every parade report. */
export const PARADE_NOTES = [
  'Joke parade only — never opens network or patches production.',
  'Offline, $0, no secrets — leave private keys off the float.',
  'Blank hint defaults to a gentle off-by-one beetle.',
  'If tests fail, the parade loops until green.',
  'Metaphor bugs only — no real exploits, no paid APIs.',
  'Legacy codebases make the best marching bands.',
  'Heisenbugs glow brighter after the crowd looks away.',
  'Exit the parade at the emergency exit marked refactor-later.',
];

/**
 * Stable non-crypto hash → non-negative int.
 * @param {string} s
 * @returns {number}
 */
function softHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Sanitize a bug / codebase hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeBug(text) {
  if (text == null || typeof text !== 'string') return 'legacy codebase';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'legacy codebase';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'legacy codebase';
}

/**
 * Infer a bug kind from a hint (deterministic).
 * null / pointer → moth; race / concurrent → cricket; leak / memory → snail;
 * flaky / test → flea; stack / overflow → locust; heisen → firefly;
 * goto / legacy → cockroach; off-by / one → beetle; else BUG_KINDS[h%].
 * @param {string} bug
 * @param {number} h
 * @returns {string}
 */
export function pickBugKind(bug, h) {
  const lower = bug.toLowerCase();
  if (lower.includes('null') || lower.includes('pointer') || lower.includes('npe')) {
    return 'null-pointer moth';
  }
  if (lower.includes('race') || lower.includes('concurrent') || lower.includes('deadlock')) {
    return 'race-condition cricket';
  }
  if (lower.includes('leak') || lower.includes('memory') || lower.includes('oom')) {
    return 'memory-leak snail';
  }
  if (lower.includes('flaky') || lower.includes('flake') || lower.includes('test')) {
    return 'flaky-test flea';
  }
  if (lower.includes('stack') || lower.includes('overflow') || lower.includes('recursion')) {
    return 'stack-overflow locust';
  }
  if (lower.includes('heisen') || lower.includes('observer')) {
    return 'heisenbug firefly';
  }
  if (lower.includes('goto') || lower.includes('legacy') || lower.includes('cobol')) {
    return 'legacy-goto cockroach';
  }
  if (lower.includes('off-by') || lower.includes('off by') || lower.includes('fencepost')) {
    return 'off-by-one beetle';
  }
  return BUG_KINDS[h % BUG_KINDS.length];
}

/**
 * Infer a parade route from a hint (deterministic).
 * spaghetti / todo → alley; circular / import → bridge; monolith → roundabout;
 * ci / flaky → arch; deprecated / flag → boulevard; comment / hack → graveyard;
 * refactor / exit → emergency exit; main / god → Main Street; else ROUTES[h%].
 * @param {string} bug
 * @param {number} h
 * @returns {string}
 */
export function pickRoute(bug, h) {
  const lower = bug.toLowerCase();
  if (lower.includes('spaghetti') || lower.includes('todo')) {
    return 'through the spaghetti alley of forgotten TODOs';
  }
  if (lower.includes('circular') || lower.includes('import')) {
    return 'across the brittle bridge of circular imports';
  }
  if (lower.includes('monolith') || lower.includes('roundabout')) {
    return 'around the monolith roundabout (three times)';
  }
  if (lower.includes('ci') || (lower.includes('flaky') && lower.includes('build'))) {
    return 'under the flaky CI arch and out to daylight';
  }
  if (lower.includes('deprecated') || lower.includes('flag')) {
    return 'along the deprecated boulevard of unused flags';
  }
  if (lower.includes('comment') || lower.includes('hack') || lower.includes('graveyard')) {
    return 'past the comment graveyard of "temporary" hacks';
  }
  if (lower.includes('refactor') || lower.includes('exit') || lower.includes('escape')) {
    return 'out the emergency exit marked refactor-later';
  }
  if (lower.includes('main') || lower.includes('god-object') || lower.includes('god object')) {
    return 'down Main Street past the god-object plaza';
  }
  return ROUTES[h % ROUTES.length];
}

/**
 * March one bug out of the legacy codebase.
 * @param {unknown} bugText
 * @param {number} [index=0]
 * @returns {{
 *   bug: string,
 *   bugPreview: string,
 *   kind: string,
 *   route: string,
 *   formation: string,
 *   chant: string,
 *   note: string,
 *   paradeId: string
 * }}
 */
export function marchBug(bugText, index = 0) {
  const bug = sanitizeBug(bugText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${bug}`);
  const bugPreview = bug.length > 56 ? `${bug.slice(0, 53)}...` : bug;
  const paradeId = `BP-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const kind = pickBugKind(bug, h);
  const route = pickRoute(bug, h);
  const formation = FORMATIONS[(h >>> 3) % FORMATIONS.length];
  const chant = CHANTS[(h >>> 6) % CHANTS.length];
  const note = PARADE_NOTES[(h >>> 9) % PARADE_NOTES.length];

  return {
    bug,
    bugPreview,
    kind,
    route,
    formation,
    chant,
    note,
    paradeId,
  };
}

/**
 * March many bugs (order preserved).
 * @param {unknown[]} bugs
 * @returns {ReturnType<typeof marchBug>[]}
 */
export function marchMany(bugs) {
  const list = Array.isArray(bugs) ? bugs : [];
  if (list.length === 0) {
    return [marchBug('legacy codebase', 0)];
  }
  return list.map((b, i) => marchBug(b, i));
}

/**
 * Pretty-print a multi-bug parade report.
 * @param {unknown[]} bugs
 * @returns {string}
 */
export function formatParade(bugs) {
  const rows = marchMany(bugs);
  const lines = [
    'BUG-PARADE — bugs marching out of a legacy codebase (metaphor / joke only)',
    'route · offline · $0 · no secrets',
    '',
    'paradeId  kind                    bug',
    '--------  ----------------------  ---',
  ];
  for (const r of rows) {
    const kind = r.kind.padEnd(22).slice(0, 22);
    lines.push(`${r.paradeId}  ${kind}  ${r.bugPreview}`);
    lines.push(`  → route:      ${r.route}`);
    lines.push(`  → formation:  ${r.formation}`);
    lines.push(`  → chant:      ${r.chant}`);
    lines.push(`  → note:       ${r.note}`);
    lines.push('');
  }
  lines.push('Joke parade only — never opens network or patches production.');
  return lines.join('\n').trimEnd() + '\n';
}
