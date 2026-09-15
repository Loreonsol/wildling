/**
 * patchwork-passport — passport stamps for monorepo folders.
 * offline, $0, no secrets. Metaphor only — never opens network or reads real git remotes.
 */

/** Ink colors pressed into the page. */
export const INKS = [
  'indigo commit',
  'terracotta refactor',
  'sea-glass merge',
  'midnight rebase',
  'saffron hotfix',
  'mossy cherry-pick',
  'lavender stash',
  'charcoal squash',
];

/** Visa / stamp styles granted to a folder. */
export const VISAS = [
  'tourist of utils',
  'resident of src/',
  'transit via packages/',
  'diplomatic tests/',
  'working holiday in apps/',
  'seasonal worker in scripts/',
  'asylum in docs/',
  'eternal return to root',
];

/** Border stations (where the stamp is issued). */
export const STATIONS = [
  'Gate README',
  'Checkpoint package.json',
  'Customs of .gitignore',
  'Booth of LICENSE',
  'Pier of dist/',
  'Kiosk of node_modules (closed)',
  'Ferry to sibling packages',
  'Lookout of CI green',
];

/** Soft advice printed under the stamp. */
export const ADVICE = [
  'Stamp lightly — folders bruise if you rename them thrice.',
  'Carry one unused import as emergency currency.',
  'If the path forks, take the shorter relative import.',
  'Do not overstay in WIP; renew with a green test.',
  'Declare all secrets at the border: leave them outside git.',
  'A monorepo loves travelers who leave the tree tidy.',
  'Visa valid until the next breaking change.',
  'Photograph the stamp; memory is cheaper than another clone.',
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
 * Sanitize a folder / path hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeFolder(text) {
  if (text == null || typeof text !== 'string') return 'untitled/folder';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'untitled/folder';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 100) || 'untitled/folder';
}

/**
 * Issue one deterministic passport stamp for a folder path.
 * @param {unknown} folderText
 * @param {number} [index=0]
 * @returns {{
 *   folder: string,
 *   folderPreview: string,
 *   ink: string,
 *   visa: string,
 *   station: string,
 *   advice: string,
 *   stampId: string,
 *   pages: number
 * }}
 */
export function stampFolder(folderText, index = 0) {
  const folder = sanitizeFolder(folderText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${folder}`);
  const folderPreview = folder.length > 64 ? `${folder.slice(0, 61)}...` : folder;
  const stampId = `PP-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  return {
    folder,
    folderPreview,
    ink: INKS[h % INKS.length],
    visa: VISAS[(h >>> 3) % VISAS.length],
    station: STATIONS[(h >>> 6) % STATIONS.length],
    advice: ADVICE[(h >>> 9) % ADVICE.length],
    stampId,
    pages: 3 + (h % 29), // 3–31 metaphor passport pages used
  };
}

/**
 * Stamp many folders (order preserved).
 * @param {unknown[]} folders
 * @returns {ReturnType<typeof stampFolder>[]}
 */
export function stampMany(folders) {
  const list = Array.isArray(folders) ? folders : [];
  if (list.length === 0) {
    return [stampFolder('packages/unnamed', 0)];
  }
  return list.map((f, i) => stampFolder(f, i));
}

/**
 * Pretty-print a patchwork passport page of stamps.
 * @param {unknown[]} folders
 * @returns {string}
 */
export function formatPassport(folders) {
  const stamps = stampMany(folders);
  const lines = [
    'PATCHWORK-PASSPORT — stamps for monorepo folders (metaphor only)',
    'border open · offline · $0 · no secrets',
    '',
  ];
  for (const s of stamps) {
    lines.push(`## folder: ${s.folderPreview}`);
    lines.push(`ink:      ${s.ink}`);
    lines.push(`visa:     ${s.visa}`);
    lines.push(`station:  ${s.station}`);
    lines.push(`pages:    ${s.pages} (metaphor)`);
    lines.push(`stamp:    ${s.stampId}`);
    lines.push(`note:     ${s.advice}`);
    lines.push('');
  }
  lines.push('Metaphor only — never opens network or reads remotes.');
  return lines.join('\n').trimEnd() + '\n';
}
