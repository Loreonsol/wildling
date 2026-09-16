/**
 * threadbare-god — Myth of a small god who mends worn sock heels and flaky tests.
 * offline, $0, no secrets. Metaphor / joke only — never opens network or spends cash.
 */

/** Small gods who specialize in soft repairs. */
export const GODS = [
  'Heel-stitch patron',
  'Flake-mender of CI',
  'Darning needle saint',
  'Soft-assert deity',
  'Lint-thread guardian',
  'Retry-loop oracle',
  'Sole-patch household god',
  'Green-bar mendicant',
  'Wool-whisper spirit',
  'Timeout-tempering muse',
  'Toe-seam keeper',
  'Snapshot-heal nymph',
];

/** Things the god will mend. */
export const TARGETS = [
  'worn sock heel',
  'flaky integration test',
  'stretched elastic cuff',
  'racey snapshot assert',
  'thinning toe seam',
  'timing-sensitive e2e',
  'frayed laundry label',
  'intermittent webhook stub',
  'holey left ankle',
  'order-dependent suite',
  'laddered knit',
  'flaky clock mock',
];

/** Tools / rites used at the tiny altar. */
export const TOOLS = [
  'darning mushroom + patience',
  'soft retry with a hug',
  'wool yarn from a quiet drawer',
  'seeded RNG and a deep breath',
  'needle threaded with lint kindness',
  'fixture freeze + tea',
  'heel pad of leftover hope',
  'deterministic sleep joke',
  'thimble of green-bar light',
  'stubbed clock and a lullaby',
  'reinforcing stitch of mercy',
  'isolate-and-name ritual',
];

/** Closing blessings under every mend. */
export const BLESSINGS = [
  'Joke mend only — socks and flakes soften; wallets stay closed.',
  'Offline, $0, no secrets — leave API keys out of the sock drawer.',
  'Blank offerings default to a soft threadbare murmur.',
  'If tests fail, rewind to the previous heel.',
  'Metaphor mending only — no paid APIs, no laundry billed.',
  'Flaky tests hold better when the god is kind.',
  'Worn heels soften every hard step into a stitch.',
  'Exit when the suite stops pretending to be a laundry basket.',
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
 * Sanitize a worn thing / flaky offering for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeOffering(text) {
  if (text == null || typeof text !== 'string') return 'threadbare murmur';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'threadbare murmur';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'threadbare murmur';
}

/**
 * Infer a god from an offering (deterministic).
 * heel / sock / stitch → Heel-stitch; flake / flaky / ci → Flake-mender;
 * darn / needle / saint → Darning; soft / assert / deity → Soft-assert;
 * lint / thread / guard → Lint-thread; retry / loop / oracle → Retry-loop;
 * sole / patch / house → Sole-patch; green / bar / mendicant → Green-bar;
 * wool / whisper / spirit → Wool-whisper; timeout / temper / muse → Timeout;
 * toe / seam / keep → Toe-seam; snap / heal / nymph → Snapshot-heal; else bank.
 * @param {string} offering
 * @param {number} h
 * @returns {string}
 */
export function pickGod(offering, h) {
  const lower = offering.toLowerCase();
  if (lower.includes('heel') || lower.includes('sock') || lower.includes('stitch')) {
    return 'Heel-stitch patron';
  }
  if (lower.includes('flake') || lower.includes('flaky') || lower.includes('ci')) {
    return 'Flake-mender of CI';
  }
  if (lower.includes('darn') || lower.includes('needle') || lower.includes('saint')) {
    return 'Darning needle saint';
  }
  if (lower.includes('soft') || lower.includes('assert') || lower.includes('deity')) {
    return 'Soft-assert deity';
  }
  if (lower.includes('lint') || lower.includes('thread') || lower.includes('guard')) {
    return 'Lint-thread guardian';
  }
  if (lower.includes('retry') || lower.includes('loop') || lower.includes('oracle')) {
    return 'Retry-loop oracle';
  }
  if (lower.includes('sole') || lower.includes('patch') || lower.includes('house')) {
    return 'Sole-patch household god';
  }
  if (lower.includes('green') || lower.includes('bar') || lower.includes('mendicant')) {
    return 'Green-bar mendicant';
  }
  if (lower.includes('wool') || lower.includes('whisper') || lower.includes('spirit')) {
    return 'Wool-whisper spirit';
  }
  if (lower.includes('timeout') || lower.includes('temper') || lower.includes('muse')) {
    return 'Timeout-tempering muse';
  }
  if (lower.includes('toe') || lower.includes('seam') || lower.includes('keep')) {
    return 'Toe-seam keeper';
  }
  if (lower.includes('snap') || lower.includes('heal') || lower.includes('nymph')) {
    return 'Snapshot-heal nymph';
  }
  return GODS[h % GODS.length];
}

/**
 * Infer a mend target from an offering (deterministic).
 * heel / worn → worn sock heel; flaky / integration → flaky integration;
 * elastic / cuff → stretched elastic; race / snapshot → racey snapshot;
 * toe / thinning → thinning toe; timing / e2e → timing-sensitive;
 * laundry / label → frayed laundry; webhook / intermittent → intermittent webhook;
 * ankle / hole → holey left ankle; order / suite → order-dependent;
 * ladder / knit → laddered knit; clock / mock → flaky clock; else bank.
 * @param {string} offering
 * @param {number} h
 * @returns {string}
 */
export function pickTarget(offering, h) {
  const lower = offering.toLowerCase();
  if (lower.includes('heel') || lower.includes('worn')) {
    return 'worn sock heel';
  }
  if (lower.includes('flaky') || lower.includes('integration')) {
    return 'flaky integration test';
  }
  if (lower.includes('elastic') || lower.includes('cuff')) {
    return 'stretched elastic cuff';
  }
  if (lower.includes('race') || lower.includes('snapshot')) {
    return 'racey snapshot assert';
  }
  if (lower.includes('toe') || lower.includes('thinning')) {
    return 'thinning toe seam';
  }
  if (lower.includes('timing') || lower.includes('e2e')) {
    return 'timing-sensitive e2e';
  }
  if (lower.includes('laundry') || lower.includes('label')) {
    return 'frayed laundry label';
  }
  if (lower.includes('webhook') || lower.includes('intermittent')) {
    return 'intermittent webhook stub';
  }
  if (lower.includes('ankle') || lower.includes('hole')) {
    return 'holey left ankle';
  }
  if (lower.includes('order') || lower.includes('suite')) {
    return 'order-dependent suite';
  }
  if (lower.includes('ladder') || lower.includes('knit')) {
    return 'laddered knit';
  }
  if (lower.includes('clock') || lower.includes('mock')) {
    return 'flaky clock mock';
  }
  return TARGETS[h % TARGETS.length];
}

/**
 * Infer a tool / rite from an offering (deterministic).
 * darn / mushroom / patience → darning mushroom; soft / retry / hug → soft retry;
 * wool / yarn / drawer → wool yarn; seed / rng / breath → seeded RNG;
 * needle / lint / kindness → needle threaded; fixture / freeze / tea → fixture freeze;
 * heel / pad / hope → heel pad; sleep / joke / determ → deterministic sleep;
 * thimble / green / light → thimble; stub / clock / lullaby → stubbed clock;
 * reinforce / mercy / stitch → reinforcing; isolate / name / ritual → isolate; else bank.
 * @param {string} offering
 * @param {number} h
 * @returns {string}
 */
export function pickTool(offering, h) {
  const lower = offering.toLowerCase();
  if (lower.includes('darn') || lower.includes('mushroom') || lower.includes('patience')) {
    return 'darning mushroom + patience';
  }
  if (lower.includes('soft') || lower.includes('retry') || lower.includes('hug')) {
    return 'soft retry with a hug';
  }
  if (lower.includes('wool') || lower.includes('yarn') || lower.includes('drawer')) {
    return 'wool yarn from a quiet drawer';
  }
  if (lower.includes('seed') || lower.includes('rng') || lower.includes('breath')) {
    return 'seeded RNG and a deep breath';
  }
  if (lower.includes('needle') || lower.includes('lint') || lower.includes('kindness')) {
    return 'needle threaded with lint kindness';
  }
  if (lower.includes('fixture') || lower.includes('freeze') || lower.includes('tea')) {
    return 'fixture freeze + tea';
  }
  if (lower.includes('pad') || lower.includes('hope')) {
    return 'heel pad of leftover hope';
  }
  if (lower.includes('sleep') || lower.includes('joke') || lower.includes('determ')) {
    return 'deterministic sleep joke';
  }
  if (lower.includes('thimble') || lower.includes('green') || lower.includes('light')) {
    return 'thimble of green-bar light';
  }
  if (lower.includes('stub') || lower.includes('clock') || lower.includes('lullaby')) {
    return 'stubbed clock and a lullaby';
  }
  if (lower.includes('reinforce') || lower.includes('mercy') || lower.includes('stitch')) {
    return 'reinforcing stitch of mercy';
  }
  if (lower.includes('isolate') || lower.includes('name') || lower.includes('ritual')) {
    return 'isolate-and-name ritual';
  }
  return TOOLS[h % TOOLS.length];
}

/**
 * Mend one offering at the threadbare altar.
 * @param {unknown} offeringText
 * @param {number} [index=0]
 * @returns {{
 *   offering: string,
 *   offeringPreview: string,
 *   god: string,
 *   target: string,
 *   tool: string,
 *   blessing: string,
 *   mendId: string
 * }}
 */
export function mendOffering(offeringText, index = 0) {
  const offering = sanitizeOffering(offeringText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${offering}`);
  const offeringPreview = offering.length > 56 ? `${offering.slice(0, 53)}...` : offering;
  const mendId = `TG-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const god = pickGod(offering, h);
  const target = pickTarget(offering, h);
  const tool = pickTool(offering, h);
  const blessing = BLESSINGS[(h >>> 4) % BLESSINGS.length];

  return {
    offering,
    offeringPreview,
    god,
    target,
    tool,
    blessing,
    mendId,
  };
}

/**
 * Mend many offerings (order preserved).
 * @param {unknown[]} offerings
 * @returns {ReturnType<typeof mendOffering>[]}
 */
export function mendMany(offerings) {
  const list = Array.isArray(offerings) ? offerings : [];
  if (list.length === 0) {
    return [mendOffering('threadbare murmur', 0)];
  }
  return list.map((q, i) => mendOffering(q, i));
}

/**
 * Pretty-print a multi-offering threadbare-god mend report.
 * @param {unknown[]} offerings
 * @returns {string}
 */
export function formatMendReport(offerings) {
  const rows = mendMany(offerings);
  const lines = [
    'THREADBARE-GOD — mends worn sock heels and flaky tests (metaphor / joke only)',
    'mend · offline · $0 · no secrets',
    '',
    'mendId  god                              offering',
    '------  -------------------------------  --------',
  ];
  for (const r of rows) {
    const god = r.god.padEnd(31).slice(0, 31);
    lines.push(`${r.mendId}  ${god}  ${r.offeringPreview}`);
    lines.push(`  → target:   ${r.target}`);
    lines.push(`  → tool:     ${r.tool}`);
    lines.push(`  → god:      ${r.god}`);
    lines.push(`  → blessing: ${r.blessing}`);
    lines.push('');
  }
  lines.push('Joke mend only — never opens network or spends cash.');
  return lines.join('\n').trimEnd() + '\n';
}
