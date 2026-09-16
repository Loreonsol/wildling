/**
 * glitch-garden — Plant list for a garden that only grows on 404 pages.
 * offline, $0, no secrets. Metaphor / joke only — never opens network or spends cash.
 */

/** Plants that sprout only where a page is missing. */
export const PLANTS = [
  'Nullia 404-bloom',
  'Softlink ivy',
  'Broken-anchor fern',
  'Missing-route moss',
  'Orphaned-path daisy',
  'Ghost-href lily',
  'Redirect-loop vine',
  'Teapot-status thistle',
  'Dead-bookmark clover',
  'Whitespace-weed',
  'Cache-miss marigold',
  'Gone-forever sunflower',
];

/** Beds / patches where 404 flora take root. */
export const BEDS = [
  'cracked sidebar planter',
  'footer mulch strip',
  'breadcrumb compost heap',
  'nav-gap window box',
  'sitemap shadow bed',
  'robots.txt verge',
  'cdn-edge hanging basket',
  'empty-search trough',
];

/** Soils / growing media unique to missing pages. */
export const SOILS = [
  'compacted 404 clay',
  'soft 410 silt',
  'stale-cache loam',
  'orphan-link peat',
  'redirect-ash compost',
  'whitespace sand',
  'teapot-status gravel',
  'bookmark-dust humus',
];

/** Closing lines / field notes under every planting. */
export const GARDEN_NOTES = [
  'Joke garden only — plants grow on missing pages, never on live routes.',
  'Offline, $0, no secrets — leave wallets and API keys at home.',
  'Blank hints default to a soft 404 murmur.',
  'If tests fail, rewind to the previous empty bed.',
  'Metaphor flora only — no paid APIs, no real horticulture billed.',
  '404 beds hold better when the gardener is kind.',
  'Missing pages soften every hard path into a seedling.',
  'Exit when the status code stops pretending to be a greenhouse.',
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
 * Sanitize a path / page hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeHint(text) {
  if (text == null || typeof text !== 'string') return '404 murmur';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return '404 murmur';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || '404 murmur';
}

/**
 * Infer a plant from a hint (deterministic).
 * null / 404 / bloom → Nullia; soft / link / ivy → Softlink ivy;
 * broken / anchor / fern → Broken-anchor; missing / route / moss → Missing-route;
 * orphan / path / daisy → Orphaned-path; ghost / href / lily → Ghost-href;
 * redirect / loop / vine → Redirect-loop; teapot / 418 / thistle → Teapot;
 * dead / bookmark / clover → Dead-bookmark; white / space / weed → Whitespace;
 * cache / miss / marigold → Cache-miss; gone / forever / sunflower → Gone-forever;
 * else bank.
 * @param {string} hint
 * @param {number} h
 * @returns {string}
 */
export function pickPlant(hint, h) {
  const lower = hint.toLowerCase();
  if (lower.includes('null') || lower.includes('404') || lower.includes('bloom')) {
    return 'Nullia 404-bloom';
  }
  if (lower.includes('soft') || lower.includes('link') || lower.includes('ivy')) {
    return 'Softlink ivy';
  }
  if (lower.includes('broken') || lower.includes('anchor') || lower.includes('fern')) {
    return 'Broken-anchor fern';
  }
  if (lower.includes('missing') || lower.includes('route') || lower.includes('moss')) {
    return 'Missing-route moss';
  }
  if (lower.includes('orphan') || lower.includes('path') || lower.includes('daisy')) {
    return 'Orphaned-path daisy';
  }
  if (lower.includes('ghost') || lower.includes('href') || lower.includes('lily')) {
    return 'Ghost-href lily';
  }
  if (lower.includes('redirect') || lower.includes('loop') || lower.includes('vine')) {
    return 'Redirect-loop vine';
  }
  if (lower.includes('teapot') || lower.includes('418') || lower.includes('thistle')) {
    return 'Teapot-status thistle';
  }
  if (lower.includes('dead') || lower.includes('bookmark') || lower.includes('clover')) {
    return 'Dead-bookmark clover';
  }
  if (lower.includes('white') || lower.includes('space') || lower.includes('weed')) {
    return 'Whitespace-weed';
  }
  if (lower.includes('cache') || lower.includes('miss') || lower.includes('marigold')) {
    return 'Cache-miss marigold';
  }
  if (lower.includes('gone') || lower.includes('forever') || lower.includes('sunflower')) {
    return 'Gone-forever sunflower';
  }
  return PLANTS[h % PLANTS.length];
}

/**
 * Infer a bed from a hint (deterministic).
 * sidebar / crack → cracked sidebar; footer / mulch → footer mulch;
 * breadcrumb / compost → breadcrumb; nav / gap / window → nav-gap;
 * sitemap / shadow → sitemap; robots / verge → robots.txt;
 * cdn / edge / basket → cdn-edge; empty / search / trough → empty-search;
 * else bank.
 * @param {string} hint
 * @param {number} h
 * @returns {string}
 */
export function pickBed(hint, h) {
  const lower = hint.toLowerCase();
  if (lower.includes('sidebar') || lower.includes('crack')) {
    return 'cracked sidebar planter';
  }
  if (lower.includes('footer') || lower.includes('mulch')) {
    return 'footer mulch strip';
  }
  if (lower.includes('breadcrumb') || lower.includes('compost')) {
    return 'breadcrumb compost heap';
  }
  if (lower.includes('nav') || lower.includes('gap') || lower.includes('window')) {
    return 'nav-gap window box';
  }
  if (lower.includes('sitemap') || lower.includes('shadow')) {
    return 'sitemap shadow bed';
  }
  if (lower.includes('robots') || lower.includes('verge')) {
    return 'robots.txt verge';
  }
  if (lower.includes('cdn') || lower.includes('edge') || lower.includes('basket')) {
    return 'cdn-edge hanging basket';
  }
  if (lower.includes('empty') || lower.includes('search') || lower.includes('trough')) {
    return 'empty-search trough';
  }
  return BEDS[h % BEDS.length];
}

/**
 * Infer a soil from a hint (deterministic).
 * 404 / clay → compacted 404; 410 / silt → soft 410; stale / cache / loam → stale-cache;
 * orphan / peat → orphan-link; redirect / ash → redirect-ash; white / sand → whitespace;
 * teapot / gravel → teapot; bookmark / dust / humus → bookmark-dust; else bank.
 * @param {string} hint
 * @param {number} h
 * @returns {string}
 */
export function pickSoil(hint, h) {
  const lower = hint.toLowerCase();
  if (lower.includes('404') || lower.includes('clay')) {
    return 'compacted 404 clay';
  }
  if (lower.includes('410') || lower.includes('silt')) {
    return 'soft 410 silt';
  }
  if (lower.includes('stale') || lower.includes('cache') || lower.includes('loam')) {
    return 'stale-cache loam';
  }
  if (lower.includes('orphan') || lower.includes('peat')) {
    return 'orphan-link peat';
  }
  if (lower.includes('redirect') || lower.includes('ash')) {
    return 'redirect-ash compost';
  }
  if (lower.includes('white') || lower.includes('sand')) {
    return 'whitespace sand';
  }
  if (lower.includes('teapot') || lower.includes('gravel')) {
    return 'teapot-status gravel';
  }
  if (lower.includes('bookmark') || lower.includes('dust') || lower.includes('humus')) {
    return 'bookmark-dust humus';
  }
  return SOILS[h % SOILS.length];
}

/**
 * Plant one glitch-garden specimen on a missing page.
 * @param {unknown} hintText
 * @param {number} [index=0]
 * @returns {{
 *   hint: string,
 *   hintPreview: string,
 *   plant: string,
 *   bed: string,
 *   soil: string,
 *   note: string,
 *   plotId: string
 * }}
 */
export function plantSpecimen(hintText, index = 0) {
  const hint = sanitizeHint(hintText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${hint}`);
  const hintPreview = hint.length > 56 ? `${hint.slice(0, 53)}...` : hint;
  const plotId = `GG-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const plant = pickPlant(hint, h);
  const bed = pickBed(hint, h);
  const soil = pickSoil(hint, h);
  const note = GARDEN_NOTES[(h >>> 4) % GARDEN_NOTES.length];

  return {
    hint,
    hintPreview,
    plant,
    bed,
    soil,
    note,
    plotId,
  };
}

/**
 * Plant many specimens (order preserved).
 * @param {unknown[]} hints
 * @returns {ReturnType<typeof plantSpecimen>[]}
 */
export function plantMany(hints) {
  const list = Array.isArray(hints) ? hints : [];
  if (list.length === 0) {
    return [plantSpecimen('404 murmur', 0)];
  }
  return list.map((q, i) => plantSpecimen(q, i));
}

/**
 * Pretty-print a multi-hint glitch-garden plant list.
 * @param {unknown[]} hints
 * @returns {string}
 */
export function formatGarden(hints) {
  const rows = plantMany(hints);
  const lines = [
    'GLITCH-GARDEN — flora that only grows on 404 pages (metaphor / joke only)',
    'plant · offline · $0 · no secrets',
    '',
    'plotId  plant                            hint',
    '------  -------------------------------  ----',
  ];
  for (const r of rows) {
    const plant = r.plant.padEnd(31).slice(0, 31);
    lines.push(`${r.plotId}  ${plant}  ${r.hintPreview}`);
    lines.push(`  → bed:   ${r.bed}`);
    lines.push(`  → soil:  ${r.soil}`);
    lines.push(`  → plant: ${r.plant}`);
    lines.push(`  → note:  ${r.note}`);
    lines.push('');
  }
  lines.push('Joke garden only — never opens network or spends cash.');
  return lines.join('\n').trimEnd() + '\n';
}
