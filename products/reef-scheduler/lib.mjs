/**
 * reef-scheduler — cron-like scheduler for coral spawning metaphors.
 * offline, $0, no secrets. Metaphor only — never opens network or talks to a real reef.
 */

/** Soft cron-ish expressions the reef understands. */
export const EXPRESSIONS = [
  '0 3 * * 2',
  '15 */6 * * *',
  '30 21 1,15 * *',
  '@full-moon',
  '@neap-tide',
  '@dusk-bloom',
  '0 0 * 11 *',
  '@quiet-wake',
];

/** Spawning events (joke jobs). */
export const EVENTS = [
  'broadcast soft gametes of kindness',
  'sync polyp clocks to Brisbane dusk',
  'release unread-idea larvae',
  'flush legacy silt from the lagoon',
  'nudge anemone neighbors awake',
  'deploy moonlight patch notes',
  'rotate calcium scaffolds gently',
  'invite cleaner wrasse code review',
];

/** Tide windows for the schedule. */
export const TIDES = [
  'rising metaphor',
  'high kindness',
  'falling silence',
  'neap of unfinished drafts',
  'spring of tiny commits',
  'slack water between wakes',
  'ebb of flaky tests',
  'flood of curiosity',
];

/** Soft advice printed under every schedule. */
export const REEF_NOTES = [
  'Do not cron paid APIs; the reef prefers $0 moonlight.',
  'Spawn windows are metaphor-accurate ± one tide.',
  'If a job fails, wait for the next full moon of tests.',
  'Never commit private keys into the coral.',
  'Offline only — the reef already knows the schedule.',
  'Missed wakes compost into softer polyps.',
  'Cron fields here mean moods, not minutes.',
  'Revert if the lagoon turns red (tests fail).',
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
 * Sanitize a job / reef hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeJob(text) {
  if (text == null || typeof text !== 'string') return 'quiet spawn';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'quiet spawn';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'quiet spawn';
}

/**
 * Infer a soft cron expression from a job hint (deterministic).
 * @param {string} job
 * @param {number} h
 * @returns {string}
 */
export function pickExpression(job, h) {
  const lower = job.toLowerCase();
  if (lower.includes('moon')) return '@full-moon';
  if (lower.includes('neap') || lower.includes('tide')) return '@neap-tide';
  if (lower.includes('dusk') || lower.includes('bloom')) return '@dusk-bloom';
  if (lower.includes('quiet') || lower.includes('wake')) return '@quiet-wake';
  return EXPRESSIONS[h % EXPRESSIONS.length];
}

/**
 * Schedule one coral-spawn metaphor job.
 * @param {unknown} jobText
 * @param {number} [index=0]
 * @returns {{
 *   job: string,
 *   jobPreview: string,
 *   expression: string,
 *   event: string,
 *   tide: string,
 *   windowLabel: string,
 *   note: string,
 *   jobId: string
 * }}
 */
export function scheduleJob(jobText, index = 0) {
  const job = sanitizeJob(jobText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${job}`);
  const jobPreview = job.length > 56 ? `${job.slice(0, 53)}...` : job;
  const jobId = `RF-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const expression = pickExpression(job, h);
  const event = EVENTS[(h >>> 3) % EVENTS.length];
  const tide = TIDES[(h >>> 6) % TIDES.length];
  const note = REEF_NOTES[(h >>> 9) % REEF_NOTES.length];
  const hour = h % 24;
  const minute = (h >>> 2) % 60;
  const windowLabel = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ± one tide`;

  return {
    job,
    jobPreview,
    expression,
    event,
    tide,
    windowLabel,
    note,
    jobId,
  };
}

/**
 * Schedule many jobs (order preserved).
 * @param {unknown[]} jobs
 * @returns {ReturnType<typeof scheduleJob>[]}
 */
export function scheduleMany(jobs) {
  const list = Array.isArray(jobs) ? jobs : [];
  if (list.length === 0) {
    return [scheduleJob('quiet spawn', 0)];
  }
  return list.map((j, i) => scheduleJob(j, i));
}

/**
 * Pretty-print a reef cron table.
 * @param {unknown[]} jobs
 * @returns {string}
 */
export function formatReefSchedule(jobs) {
  const rows = scheduleMany(jobs);
  const lines = [
    'REEF-SCHEDULER — cron-like coral spawning metaphors (metaphor only)',
    'crontab · offline · $0 · no secrets',
    '',
    'expr                window      tide                    jobId   job',
    '------------------- ----------- ----------------------- ------- ----',
  ];
  for (const r of rows) {
    const expr = r.expression.padEnd(19).slice(0, 19);
    const win = r.windowLabel.padEnd(11).slice(0, 11);
    const tide = r.tide.padEnd(23).slice(0, 23);
    lines.push(`${expr} ${win} ${tide} ${r.jobId}  ${r.jobPreview}`);
    lines.push(`  → event: ${r.event}`);
    lines.push(`  → note:  ${r.note}`);
    lines.push('');
  }
  lines.push('Metaphor only — never opens network or talks to a real reef.');
  return lines.join('\n').trimEnd() + '\n';
}
