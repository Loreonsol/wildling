/**
 * tide-todo — todo list that syncs tasks to ocean tide tables.
 * offline, $0, no secrets. Metaphor only — never fetches real tides or opens network.
 */

/** Tide phases tasks can wash ashore into. */
export const TIDE_PHASES = [
  'high-slack',
  'ebbing',
  'low-slack',
  'flooding',
  'spring-rush',
  'neap-drift',
  'moon-pull',
  'sandbar-pause',
];

/** Harbor berths (where the task docks). */
export const BERTHS = [
  'Port of Quiet Intent',
  'Wharf of Maybe',
  'Slipway of Soft Focus',
  'Jetty of Deferred Joy',
  'Buoy of Gentle Urgency',
  'Pier of Half-Done Drafts',
  'Mooring of Night Owls',
  'Channel of Clear Water',
];

/** Tide advice (what the sea suggests). */
export const ADVICE = [
  'Do it while the water still remembers your name.',
  'Wait for the slack — rushing sinks the dinghy.',
  'Pair with one smaller task so the tide does not strand you.',
  'If it is heavy, float it first: write the first line only.',
  'Check the sand for clues you already left yourself.',
  'Skip the doom-scroll undertow; surface once done.',
  'Name the blocker like a buoy — then row past it.',
  'Celebrate with a shore walk when the checkbox fills.',
];

/** Priority glyphs (cute, not severe). */
export const PRIORITIES = ['shell', 'pebble', 'driftwood', 'anchor', 'lighthouse'];

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
 * Sanitize a single task line for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeTask(text) {
  if (text == null || typeof text !== 'string') return 'an unnamed shore chore';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'an unnamed shore chore';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 120) || 'an unnamed shore chore';
}

/**
 * Map one task string onto a deterministic tide slot.
 * @param {unknown} taskText
 * @param {number} [index=0]
 * @returns {{
 *   task: string,
 *   taskPreview: string,
 *   phase: string,
 *   berth: string,
 *   advice: string,
 *   priority: string,
 *   tideId: string,
 *   slot: number
 * }}
 */
export function assignTide(taskText, index = 0) {
  const task = sanitizeTask(taskText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${task}`);
  const taskPreview = task.length > 64 ? `${task.slice(0, 61)}...` : task;
  const tideId = `TD-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  return {
    task,
    taskPreview,
    phase: TIDE_PHASES[h % TIDE_PHASES.length],
    berth: BERTHS[(h >>> 4) % BERTHS.length],
    advice: ADVICE[(h >>> 8) % ADVICE.length],
    priority: PRIORITIES[(h >>> 12) % PRIORITIES.length],
    tideId,
    slot: (h % 90) + 10,
  };
}

/**
 * Sync many tasks to a tide table (order preserved).
 * @param {unknown[]} tasks
 * @returns {ReturnType<typeof assignTide>[]}
 */
export function syncTideTable(tasks) {
  const list = Array.isArray(tasks) ? tasks : [];
  if (list.length === 0) {
    return [assignTide('breathe with the tide', 0)];
  }
  return list.map((t, i) => assignTide(t, i));
}

/**
 * Format a printable tide-synced todo table.
 * @param {unknown[]} tasks
 * @returns {string}
 */
export function formatTideTodo(tasks) {
  const rows = syncTideTable(tasks);
  const width = 58;
  const line = '~'.repeat(width);
  const out = [
    line,
    'TIDE-TODO / 0.1  (metaphor tides; no ocean APIs)',
    line,
  ];
  for (const r of rows) {
    out.push(`  [${r.tideId}] slot ${String(r.slot).padStart(2, '0')}  priority:${r.priority}`);
    out.push(`  task : ${r.taskPreview}`);
    out.push(`  phase: ${r.phase}`);
    out.push(`  berth: ${r.berth}`);
    out.push(`  tip  : ${r.advice}`);
    out.push(line);
  }
  out.push('(Metaphor only — never fetches real tides. Offline, $0, no secrets.)');
  return out.join('\n');
}
