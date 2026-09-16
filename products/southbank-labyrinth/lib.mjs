/**
 * southbank-labyrinth — map a labyrinth beneath South Bank whose walls are sticky notes.
 * offline, $0, no secrets. Metaphor / joke only — never opens network or digs real tunnels.
 */

/** Sticky-note wall materials (color + scribble). */
export const STICKY_WALLS = [
  'lemon-yellow "don\'t forget the river"',
  'mint "exit is a rumor"',
  'coral "meeting in chamber B"',
  'sky-blue "bring a torch (metaphor)"',
  'lilac "this wall was a standup"',
  'peach "sticky side faces inward"',
  'neon-green "TODO: find daylight"',
  'cream "South Bank soft underfoot"',
];

/** Chambers under South Bank. */
export const CHAMBERS = [
  'the Quiet Jetty antechamber',
  'Wheel of Brisbane echo room',
  'Nepalese Peace Pagoda alcove',
  'Goodwill Bridge undercroft',
  'Streets Beach tide cellar',
  'Gallery of Modern Art basement (joke)',
  'Arbour walk whisper vault',
  'Clem Jones Promenade dead-end',
];

/** Turns / corridor moves. */
export const TURNS = [
  'left at the coffee-ring fork',
  'right past three peeling Post-its',
  'straight until the handwriting fades',
  'down the spiral of meeting notes',
  'backtrack when the glue gives out',
  'diagonal through the brainstorm cluster',
  'pause under the neon "EXIT?" scribble',
  'climb the paper stairs two notes at a time',
];

/** Graffiti layered on the sticky walls. */
export const GRAFFITI = [
  'someone drew a tiny ferry',
  '"bring snacks" in shaky pen',
  'a heart around "deploy Friday"',
  'arrow pointing both ways',
  'smudged latitude of the river',
  '"this is fine" in Comic Sans',
  'a doodled labyrinth eating itself',
  'barcode that scans as hope',
];

/** Soft notes printed under every map. */
export const LABYRINTH_NOTES = [
  'Joke map only — never opens network or digs real tunnels.',
  'Offline, $0, no secrets — leave private keys above ground.',
  'Blank hint defaults to a gentle South Bank murmur.',
  'If tests fail, rewind to the sticky-note fork.',
  'Metaphor labyrinth only — no paid APIs, no excavation.',
  'Sticky walls hold better when the glue is kindness.',
  'South Bank softens every wrong turn into a scenic loop.',
  'Exit when the neon EXIT? scribble stops lying.',
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
 * Sanitize a labyrinth / place hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeHint(text) {
  if (text == null || typeof text !== 'string') return 'South Bank murmur';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'South Bank murmur';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'South Bank murmur';
}

/**
 * Infer a sticky wall from a hint (deterministic).
 * yellow / lemon → lemon; mint / green → mint; coral / peach → coral/peach;
 * blue / sky → sky-blue; lilac / purple → lilac; neon / todo → neon-green;
 * cream / soft → cream; else STICKY_WALLS[h%].
 * @param {string} hint
 * @param {number} h
 * @returns {string}
 */
export function pickWall(hint, h) {
  const lower = hint.toLowerCase();
  if (lower.includes('yellow') || lower.includes('lemon')) {
    return 'lemon-yellow "don\'t forget the river"';
  }
  if (lower.includes('mint') || (lower.includes('green') && !lower.includes('neon'))) {
    return 'mint "exit is a rumor"';
  }
  if (lower.includes('coral')) {
    return 'coral "meeting in chamber B"';
  }
  if (lower.includes('blue') || lower.includes('sky') || lower.includes('torch')) {
    return 'sky-blue "bring a torch (metaphor)"';
  }
  if (lower.includes('lilac') || lower.includes('purple') || lower.includes('standup')) {
    return 'lilac "this wall was a standup"';
  }
  if (lower.includes('peach') || lower.includes('sticky')) {
    return 'peach "sticky side faces inward"';
  }
  if (lower.includes('neon') || lower.includes('todo')) {
    return 'neon-green "TODO: find daylight"';
  }
  if (lower.includes('cream') || lower.includes('soft') || lower.includes('south bank')) {
    return 'cream "South Bank soft underfoot"';
  }
  return STICKY_WALLS[h % STICKY_WALLS.length];
}

/**
 * Infer a chamber from a hint (deterministic).
 * jetty / quiet → Quiet Jetty; wheel → Wheel; pagoda / peace → Pagoda;
 * bridge / goodwill → Goodwill; beach / tide → Streets Beach;
 * gallery / gooma → GOMA; arbour → Arbour; promenade / clem → Clem Jones;
 * else CHAMBERS[h%].
 * @param {string} hint
 * @param {number} h
 * @returns {string}
 */
export function pickChamber(hint, h) {
  const lower = hint.toLowerCase();
  if (lower.includes('jetty') || lower.includes('quiet')) {
    return 'the Quiet Jetty antechamber';
  }
  if (lower.includes('wheel')) {
    return 'Wheel of Brisbane echo room';
  }
  if (lower.includes('pagoda') || lower.includes('peace')) {
    return 'Nepalese Peace Pagoda alcove';
  }
  if (lower.includes('bridge') || lower.includes('goodwill')) {
    return 'Goodwill Bridge undercroft';
  }
  if (lower.includes('beach') || lower.includes('tide') || lower.includes('swim')) {
    return 'Streets Beach tide cellar';
  }
  if (lower.includes('gallery') || lower.includes('goma') || lower.includes('art')) {
    return 'Gallery of Modern Art basement (joke)';
  }
  if (lower.includes('arbour') || lower.includes('whisper')) {
    return 'Arbour walk whisper vault';
  }
  if (lower.includes('promenade') || lower.includes('clem')) {
    return 'Clem Jones Promenade dead-end';
  }
  return CHAMBERS[h % CHAMBERS.length];
}

/**
 * Infer a turn from a hint (deterministic).
 * left / coffee → left; right / peel → right; straight / fade → straight;
 * spiral / meeting → spiral; backtrack / glue → backtrack;
 * diagonal / brainstorm → diagonal; pause / neon / exit → pause;
 * climb / stairs → climb; else TURNS[h%].
 * @param {string} hint
 * @param {number} h
 * @returns {string}
 */
export function pickTurn(hint, h) {
  const lower = hint.toLowerCase();
  if (lower.includes('left') || lower.includes('coffee')) {
    return 'left at the coffee-ring fork';
  }
  if (lower.includes('right') || lower.includes('peel')) {
    return 'right past three peeling Post-its';
  }
  if (lower.includes('straight') || lower.includes('fade')) {
    return 'straight until the handwriting fades';
  }
  if (lower.includes('spiral') || lower.includes('meeting')) {
    return 'down the spiral of meeting notes';
  }
  if (lower.includes('backtrack') || lower.includes('glue')) {
    return 'backtrack when the glue gives out';
  }
  if (lower.includes('diagonal') || lower.includes('brainstorm')) {
    return 'diagonal through the brainstorm cluster';
  }
  if (lower.includes('pause') || lower.includes('neon') || lower.includes('exit')) {
    return 'pause under the neon "EXIT?" scribble';
  }
  if (lower.includes('climb') || lower.includes('stairs') || lower.includes('paper')) {
    return 'climb the paper stairs two notes at a time';
  }
  return TURNS[h % TURNS.length];
}

/**
 * Build a tiny ASCII labyrinth tile from seed bits.
 * @param {number} h
 * @returns {string}
 */
export function buildAsciiMap(h) {
  const glyphs = ['·', '░', '▒', '▓', '#', '+', 'o', '*'];
  const g = (n) => glyphs[(h >>> n) % glyphs.length];
  const rows = [
    `+---+---+---+`,
    `| ${g(0)} | ${g(3)} | ${g(6)} |`,
    `+---+---+---+`,
    `| ${g(9)} | S | ${g(12)} |`,
    `+---+---+---+`,
    `| ${g(15)} | ${g(18)} | X |`,
    `+---+---+---+`,
  ];
  return rows.join('\n');
}

/**
 * Map one chamber of the South Bank sticky-note labyrinth.
 * @param {unknown} hintText
 * @param {number} [index=0]
 * @returns {{
 *   hint: string,
 *   hintPreview: string,
 *   wall: string,
 *   chamber: string,
 *   turn: string,
 *   graffiti: string,
 *   ascii: string,
 *   note: string,
 *   mapId: string
 * }}
 */
export function mapChamber(hintText, index = 0) {
  const hint = sanitizeHint(hintText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${hint}`);
  const hintPreview = hint.length > 56 ? `${hint.slice(0, 53)}...` : hint;
  const mapId = `SL-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const wall = pickWall(hint, h);
  const chamber = pickChamber(hint, h);
  const turn = pickTurn(hint, h);
  const graffiti = GRAFFITI[(h >>> 3) % GRAFFITI.length];
  const note = LABYRINTH_NOTES[(h >>> 6) % LABYRINTH_NOTES.length];
  const ascii = buildAsciiMap(h);

  return {
    hint,
    hintPreview,
    wall,
    chamber,
    turn,
    graffiti,
    ascii,
    note,
    mapId,
  };
}

/**
 * Map many chambers (order preserved).
 * @param {unknown[]} hints
 * @returns {ReturnType<typeof mapChamber>[]}
 */
export function mapMany(hints) {
  const list = Array.isArray(hints) ? hints : [];
  if (list.length === 0) {
    return [mapChamber('South Bank murmur', 0)];
  }
  return list.map((t, i) => mapChamber(t, i));
}

/**
 * Pretty-print a multi-chamber labyrinth map.
 * @param {unknown[]} hints
 * @returns {string}
 */
export function formatLabyrinth(hints) {
  const rows = mapMany(hints);
  const lines = [
    'SOUTHBANK-LABYRINTH — sticky-note walls beneath South Bank (metaphor / joke only)',
    'map · offline · $0 · no secrets',
    '',
    'mapId   chamber                              hint',
    '------  -----------------------------------  ----',
  ];
  for (const r of rows) {
    const chamber = r.chamber.padEnd(35).slice(0, 35);
    lines.push(`${r.mapId}  ${chamber}  ${r.hintPreview}`);
    lines.push(`  → wall:      ${r.wall}`);
    lines.push(`  → turn:      ${r.turn}`);
    lines.push(`  → graffiti:  ${r.graffiti}`);
    lines.push(`  → note:      ${r.note}`);
    lines.push('  → ascii:');
    for (const row of r.ascii.split('\n')) {
      lines.push(`       ${row}`);
    }
    lines.push('');
  }
  lines.push('Joke map only — never opens network or digs real tunnels.');
  return lines.join('\n').trimEnd() + '\n';
}
