/**
 * sunset-difftool — Diff tool that colors changes like a Moreton Bay sunset.
 * Offline, $0, no secrets. Pure local string/file helpers (no network).
 */

/** Friendly defaults when argv is empty. */
export const DEFAULT_LEFT = `Moreton Bay at dusk
pelicans on the sandbank
ferry lights begin`;

export const DEFAULT_RIGHT = `Moreton Bay at dusk
pelicans leave the sandbank
ferry lights begin
gold spills on the tide`;

/** Sunset palette: ANSI 256 + metaphor labels (Moreton Bay). */
export const SUNSET_PALETTE = {
  equal: {
    ansi: '\x1b[38;5;105m', // soft indigo dusk
    label: 'bay-glass (equal)',
    marker: ' ',
  },
  removed: {
    ansi: '\x1b[38;5;203m', // coral / magenta dusk
    label: 'tide-out (removed)',
    marker: '-',
  },
  added: {
    ansi: '\x1b[38;5;214m', // amber / tangerine gold
    label: 'gold-lip (added)',
    marker: '+',
  },
};

export const ANSI_RESET = '\x1b[0m';

/** Horizon metaphors stamped into the report. */
export const HORIZON_NOTES = [
  'Moreton Bay dusk — coral out, gold in, indigo holds the glass.',
  'Sandbank hush: unchanged lines keep the bay-glass indigo.',
  'Ferry wake: removals blush coral; additions pour tangerine.',
  'Offline sunset — no network, $0, no secrets in the tide.',
  'If tests fail, rewind; the bay keeps yesterday\'s palette.',
  'Word-glints inside changed lines use the same dusk map.',
  'Blank sides default to a short Moreton Bay haiku pair.',
  'Leave issue #2 open — standing steering, standing tide.',
];

/**
 * Stable non-crypto hash → non-negative int.
 * @param {string} s
 * @returns {number}
 */
export function softHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Sanitize a full document / side string for diffing.
 * Preserves newlines; strips non-printable except \n \t; caps length.
 * @param {unknown} text
 * @param {string} [fallback]
 * @returns {string}
 */
export function sanitizeText(text, fallback = '') {
  if (text == null || typeof text !== 'string') return fallback;
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[^\x09\x0A\x20-\x7E]/g, '');
  if (cleaned.trim().length === 0) return fallback;
  return cleaned.slice(0, 8000);
}

/**
 * Sanitize a single line (no embedded newlines).
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeLine(text) {
  if (text == null || typeof text !== 'string') return '';
  return text
    .replace(/[\r\n]/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .slice(0, 500);
}

/**
 * Split text into lines (trailing empty line dropped if final newline).
 * @param {string} text
 * @returns {string[]}
 */
export function splitLines(text) {
  const s = typeof text === 'string' ? text : '';
  if (s.length === 0) return [];
  const parts = s.split('\n');
  if (parts.length > 1 && parts[parts.length - 1] === '') parts.pop();
  return parts.map(sanitizeLine);
}

/**
 * Classic LCS table for two string arrays (line-level).
 * @param {string[]} a
 * @param {string[]} b
 * @returns {number[][]}
 */
export function buildLcsTable(a, b) {
  const n = a.length;
  const m = b.length;
  /** @type {number[][]} */
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

/**
 * Backtrack LCS into line ops: equal | removed | added.
 * @param {string[]} left
 * @param {string[]} right
 * @returns {{ type: 'equal'|'removed'|'added', text: string }[]}
 */
export function lineDiff(left, right) {
  const a = Array.isArray(left) ? left : [];
  const b = Array.isArray(right) ? right : [];
  const dp = buildLcsTable(a, b);
  /** @type {{ type: 'equal'|'removed'|'added', text: string }[]} */
  const ops = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.push({ type: 'equal', text: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ type: 'added', text: b[j - 1] });
      j--;
    } else {
      ops.push({ type: 'removed', text: a[i - 1] });
      i--;
    }
  }
  ops.reverse();
  return ops;
}

/**
 * Tiny word-level LCS for a single changed-line pair (optional glints).
 * @param {string} leftLine
 * @param {string} rightLine
 * @returns {{ type: 'equal'|'removed'|'added', text: string }[]}
 */
export function wordDiff(leftLine, rightLine) {
  const splitWords = (s) => {
    const t = sanitizeLine(s);
    if (!t) return [];
    return t.split(/(\s+)/).filter((w) => w.length > 0);
  };
  return lineDiff(splitWords(leftLine), splitWords(rightLine));
}

/**
 * Color a line with sunset palette ANSI + marker.
 * @param {'equal'|'removed'|'added'} type
 * @param {string} text
 * @param {{ color?: boolean }} [opts]
 * @returns {string}
 */
export function colorLine(type, text, opts = {}) {
  const useColor = opts.color !== false;
  const pal = SUNSET_PALETTE[type] || SUNSET_PALETTE.equal;
  const body = `${pal.marker} ${text}`;
  if (!useColor) return body;
  return `${pal.ansi}${body}${ANSI_RESET}`;
}

/**
 * Pick a horizon note from seed bits (deterministic).
 * @param {number} h
 * @returns {string}
 */
export function pickHorizonNote(h) {
  return HORIZON_NOTES[h % HORIZON_NOTES.length];
}

/**
 * Diff two texts (strings) into structured sunset ops + stats.
 * @param {unknown} leftText
 * @param {unknown} rightText
 * @returns {{
 *   left: string,
 *   right: string,
 *   leftLines: string[],
 *   rightLines: string[],
 *   ops: { type: 'equal'|'removed'|'added', text: string }[],
 *   stats: { equal: number, removed: number, added: number },
 *   diffId: string,
 *   note: string
 * }}
 */
export function sunsetDiff(leftText, rightText) {
  const left = sanitizeText(leftText, DEFAULT_LEFT);
  const right = sanitizeText(rightText, DEFAULT_RIGHT);
  const leftLines = splitLines(left);
  const rightLines = splitLines(right);
  const ops = lineDiff(leftLines, rightLines);
  const stats = { equal: 0, removed: 0, added: 0 };
  for (const op of ops) {
    if (op.type === 'equal') stats.equal++;
    else if (op.type === 'removed') stats.removed++;
    else stats.added++;
  }
  const h = softHash(`${left}|${right}`);
  const diffId = `SD-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const note = pickHorizonNote(h >>> 4);
  return { left, right, leftLines, rightLines, ops, stats, diffId, note };
}

/**
 * Pretty-print a Moreton Bay sunset diff report.
 * @param {unknown} leftText
 * @param {unknown} rightText
 * @param {{ color?: boolean, words?: boolean }} [opts]
 * @returns {string}
 */
export function formatSunsetDiff(leftText, rightText, opts = {}) {
  const useColor = opts.color !== false;
  const showWords = opts.words === true;
  const report = sunsetDiff(leftText, rightText);
  const lines = [
    'SUNSET-DIFFTOOL — Moreton Bay dusk palette',
    'offline · $0 · no secrets · no network',
    '',
    `diffId   ${report.diffId}`,
    `palette  ${SUNSET_PALETTE.equal.label} · ${SUNSET_PALETTE.removed.label} · ${SUNSET_PALETTE.added.label}`,
    `stats    =${report.stats.equal}  -${report.stats.removed}  +${report.stats.added}`,
    '',
    'mark  line',
    '----  ----',
  ];

  // Pair adjacent removed+added for optional word glints
  const ops = report.ops;
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const next = ops[i + 1];
    if (
      showWords &&
      op.type === 'removed' &&
      next &&
      next.type === 'added'
    ) {
      const wops = wordDiff(op.text, next.text);
      const paintSide = (keep) =>
        wops
          .filter((w) => w.type === 'equal' || w.type === keep)
          .map((w) => {
            if (!useColor || w.type === 'equal') return w.text;
            const pal = SUNSET_PALETTE[w.type];
            return `${pal.ansi}${w.text}${ANSI_RESET}`;
          })
          .join('');
      const remPal = SUNSET_PALETTE.removed;
      const addPal = SUNSET_PALETTE.added;
      const leftBody = paintSide('removed') || op.text;
      const rightBody = paintSide('added') || next.text;
      if (useColor) {
        lines.push(
          `${remPal.ansi}${remPal.marker} ${ANSI_RESET}${leftBody}`,
        );
        lines.push(
          `${addPal.ansi}${addPal.marker} ${ANSI_RESET}${rightBody}`,
        );
      } else {
        lines.push(`${remPal.marker} ${leftBody}`);
        lines.push(`${addPal.marker} ${rightBody}`);
      }
      i++;
      continue;
    }
    lines.push(colorLine(op.type, op.text, { color: useColor }));
  }

  lines.push('');
  lines.push(`  → note: ${report.note}`);
  lines.push('');
  lines.push('Moreton Bay sunset · coral removals · gold additions · indigo equals.');
  return lines.join('\n').trimEnd() + '\n';
}
