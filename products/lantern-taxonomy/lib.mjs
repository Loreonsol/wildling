/**
 * lantern-taxonomy — taxonomy of lanterns that light ideas instead of rooms.
 * offline, $0, no secrets. Metaphor only — never opens network or ignites anything.
 */

/** Species / genera of idea-lanterns. */
export const SPECIES = [
  'Lumina brainstormii',
  'Glowworm of unfinished drafts',
  'Paper-bag epiphany',
  'Jarred soft-hash firefly',
  'Tide-glass rethinker',
  'Moss-wick curiosity',
  'Null-island nightlight',
  'Commit-candle of maybe',
];

/** Fuels that burn without heat (joke only). */
export const FUELS = [
  'unused TODO comments',
  'polite PR praise',
  'half-remembered haiku',
  'green test sparks',
  'quiet afternoon dust',
  'coffee-ring diagrams',
  'orphan markdown headings',
  'soft-assert hugs',
];

/** Habitats where idea-lanterns nest. */
export const HABITATS = [
  'margin of a sticky note',
  'under the unread README',
  'between two merge parents',
  'inside a paused cursor',
  'on the windowsill of CI',
  'pocket constellation pocket',
  'fog of a forgotten branch',
  'porch of the next wake',
];

/** Soft field-guide notes. */
export const FIELD_NOTES = [
  'Do not feed with secrets; they dim the wick.',
  'Shake gently — ideas bruise if you force them.',
  'Pair with a second lantern for stereoscopic insight.',
  'Extinguish by finishing the thought, not by closing the laptop.',
  'Classify by glow, never by LOC count.',
  'If it flickers, the metaphor needs air.',
  'Lanterns prefer offline nights and $0 oil.',
  'Photograph the glow; memory is cheaper than another clone.',
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
 * Sanitize an idea / subject hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeIdea(text) {
  if (text == null || typeof text !== 'string') return 'untitled idea';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'untitled idea';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 100) || 'untitled idea';
}

/**
 * Classify one idea into a deterministic lantern specimen.
 * @param {unknown} ideaText
 * @param {number} [index=0]
 * @returns {{
 *   idea: string,
 *   ideaPreview: string,
 *   species: string,
 *   fuel: string,
 *   habitat: string,
 *   note: string,
 *   specimenId: string,
 *   lumen: number
 * }}
 */
export function classifyLantern(ideaText, index = 0) {
  const idea = sanitizeIdea(ideaText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${idea}`);
  const ideaPreview = idea.length > 64 ? `${idea.slice(0, 61)}...` : idea;
  const specimenId = `LT-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  return {
    idea,
    ideaPreview,
    species: SPECIES[h % SPECIES.length],
    fuel: FUELS[(h >>> 3) % FUELS.length],
    habitat: HABITATS[(h >>> 6) % HABITATS.length],
    note: FIELD_NOTES[(h >>> 9) % FIELD_NOTES.length],
    specimenId,
    lumen: 1 + (h % 99), // 1–99 metaphor lumens
  };
}

/**
 * Classify many ideas (order preserved).
 * @param {unknown[]} ideas
 * @returns {ReturnType<typeof classifyLantern>[]}
 */
export function classifyMany(ideas) {
  const list = Array.isArray(ideas) ? ideas : [];
  if (list.length === 0) {
    return [classifyLantern('a quiet maybe', 0)];
  }
  return list.map((f, i) => classifyLantern(f, i));
}

/**
 * Pretty-print a lantern taxonomy field page.
 * @param {unknown[]} ideas
 * @returns {string}
 */
export function formatTaxonomy(ideas) {
  const rows = classifyMany(ideas);
  const lines = [
    'LANTERN-TAXONOMY — lanterns that light ideas, not rooms (metaphor only)',
    'field guide · offline · $0 · no secrets',
    '',
  ];
  for (const s of rows) {
    lines.push(`## idea: ${s.ideaPreview}`);
    lines.push(`species:  ${s.species}`);
    lines.push(`fuel:     ${s.fuel}`);
    lines.push(`habitat:  ${s.habitat}`);
    lines.push(`lumen:    ${s.lumen} (metaphor)`);
    lines.push(`id:       ${s.specimenId}`);
    lines.push(`note:     ${s.note}`);
    lines.push('');
  }
  lines.push('Metaphor only — never opens network or ignites anything.');
  return lines.join('\n').trimEnd() + '\n';
}
