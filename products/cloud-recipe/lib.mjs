/**
 * cloud-recipe — recipe that turns afternoon clouds into edible meringue.
 * offline, $0, no secrets. Metaphor / joke only — never cooks or opens network.
 */

/** Cloud shapes that become meringue bases. */
export const CLOUDS = [
  'cumulus puff',
  'cirrus thread',
  'stratus sheet',
  'altostratus ribbon',
  'lenticular lens',
  'mammatus pouch',
  'anvil thunderhead',
  'fair-weather fluff',
];

/** Whisk / fold methods (metaphor). */
export const METHODS = [
  'whisk with a soft breeze until peaks hold',
  'fold sunlight into the foam in quiet thirds',
  'beat until the sky turns glossy white',
  'sift afternoon light through a colander of wind',
  'pipe tall peaks onto a tray of blue',
  'rest under shade until the sugar settles',
  'torch the tips with a late-day flare',
  'dust with powdered dusk and serve warm',
];

/** Flavor notes for the finished meringue. */
export const FLAVORS = [
  'vanilla of distant rain',
  'lemon zest of coastal glare',
  'toasted marshmallow of summer haze',
  'berry swirl of sunset pink',
  'honey of late bees',
  'salt-caramel of dry heat',
  'mint of after-storm cool',
  'cocoa of gathering dusk',
];

/** Serving plates / settings. */
export const SERVINGS = [
  'on a porch rail at 3pm',
  'beside a cold glass of quiet',
  'shared with one curious bird',
  'plated on a warm car bonnet',
  'in a bowl made of leftover sky',
  'with tea and no agenda',
  'before the first evening bat',
  'wrapped for tomorrow\'s wake',
];

/** Soft notes printed under every report. */
export const RECIPE_NOTES = [
  'Afternoon clouds only — morning fog is underbaked.',
  'Metaphor kitchen: never opens network or spends money.',
  'Do not commit private keys into the sugar jar.',
  'If tests fail, let the peaks collapse and start over.',
  'Edible in imagination; offline in practice.',
  'Cumulus whisks faster than stratus — patience is a method.',
  'Blank sky defaults to a gentle cumulus puff.',
  'Joke recipe only — no real ovens, no paid APIs.',
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
 * Sanitize a sky / place hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeSky(text) {
  if (text == null || typeof text !== 'string') return 'afternoon sky';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'afternoon sky';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'afternoon sky';
}

/**
 * Infer a cloud shape from a sky hint (deterministic).
 * cumulus / fluff → cumulus; cirrus / thread → cirrus; storm / thunder → anvil; else CLOUDS[h%].
 * @param {string} sky
 * @param {number} h
 * @returns {string}
 */
export function pickCloud(sky, h) {
  const lower = sky.toLowerCase();
  if (lower.includes('cumulus') || lower.includes('fluff') || lower.includes('puff')) {
    return 'cumulus puff';
  }
  if (lower.includes('cirrus') || lower.includes('thread') || lower.includes('wispy')) {
    return 'cirrus thread';
  }
  if (lower.includes('storm') || lower.includes('thunder') || lower.includes('anvil')) {
    return 'anvil thunderhead';
  }
  if (lower.includes('stratus') || lower.includes('sheet') || lower.includes('fog')) {
    return 'stratus sheet';
  }
  return CLOUDS[h % CLOUDS.length];
}

/**
 * Whether a sky hint is afternoon-ish (peaks hold / recipe is ready).
 * @param {string} sky
 * @returns {boolean}
 */
export function isAfternoonIsh(sky) {
  const s = sky.toLowerCase();
  if (s.includes('morning') || s.includes('dawn') || s.includes('sunrise')) return false;
  if (s.includes('night') || s.includes('midnight') || s.includes('dusk only')) return false;
  if (
    s.includes('afternoon') ||
    s.includes('3pm') ||
    s.includes('siesta') ||
    s.includes('late day') ||
    s.includes('pm')
  ) {
    return true;
  }
  // default: afternoon-friendly when no time cue
  return true;
}

/**
 * Bake one cloud-meringue recipe for a sky hint.
 * @param {unknown} skyText
 * @param {number} [index=0]
 * @returns {{
 *   sky: string,
 *   skyPreview: string,
 *   cloud: string,
 *   method: string,
 *   flavor: string,
 *   serving: string,
 *   note: string,
 *   ready: boolean,
 *   recipeId: string
 * }}
 */
export function bakeRecipe(skyText, index = 0) {
  const sky = sanitizeSky(skyText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${sky}`);
  const skyPreview = sky.length > 56 ? `${sky.slice(0, 53)}...` : sky;
  const recipeId = `CR-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const cloud = pickCloud(sky, h);
  const ready = isAfternoonIsh(sky);
  const method = ready
    ? METHODS[(h >>> 3) % METHODS.length]
    : 'wait for afternoon — peaks will not hold yet';
  const flavor = FLAVORS[(h >>> 6) % FLAVORS.length];
  const serving = SERVINGS[(h >>> 9) % SERVINGS.length];
  const note = RECIPE_NOTES[(h >>> 12) % RECIPE_NOTES.length];

  return {
    sky,
    skyPreview,
    cloud,
    method,
    flavor,
    serving,
    note,
    ready,
    recipeId,
  };
}

/**
 * Bake many recipes (order preserved).
 * @param {unknown[]} skies
 * @returns {ReturnType<typeof bakeRecipe>[]}
 */
export function bakeMany(skies) {
  const list = Array.isArray(skies) ? skies : [];
  if (list.length === 0) {
    return [bakeRecipe('afternoon sky', 0)];
  }
  return list.map((s, i) => bakeRecipe(s, i));
}

/**
 * Pretty-print a multi-sky cloud-recipe report.
 * @param {unknown[]} skies
 * @returns {string}
 */
export function formatCloudRecipe(skies) {
  const rows = bakeMany(skies);
  const lines = [
    'CLOUD-RECIPE — afternoon clouds → edible meringue (metaphor / joke only)',
    'kitchen · offline · $0 · no secrets',
    '',
    'recipeId  ready  cloud                 sky',
    '--------  -----  --------------------  ---',
  ];
  for (const r of rows) {
    const ready = (r.ready ? 'yes' : 'wait').padEnd(5);
    const cloud = r.cloud.padEnd(20).slice(0, 20);
    lines.push(`${r.recipeId}  ${ready}  ${cloud}  ${r.skyPreview}`);
    lines.push(`  → method:  ${r.method}`);
    lines.push(`  → flavor:  ${r.flavor}`);
    lines.push(`  → serving: ${r.serving}`);
    lines.push(`  → note:    ${r.note}`);
    lines.push('');
  }
  lines.push('Joke recipe only — never opens network or lights a real oven.');
  return lines.join('\n').trimEnd() + '\n';
}
