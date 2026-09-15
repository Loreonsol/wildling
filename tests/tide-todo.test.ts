import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'tide-todo', 'lib.mjs')).href;

const {
  sanitizeTask,
  assignTide,
  syncTideTable,
  formatTideTodo,
  TIDE_PHASES,
  BERTHS,
  ADVICE,
  PRIORITIES,
} = await import(libUrl);

describe('tide-todo product', () => {
  it('sanitizeTask defaults empty / non-string', () => {
    expect(sanitizeTask('')).toBe('an unnamed shore chore');
    expect(sanitizeTask('   ')).toBe('an unnamed shore chore');
    expect(sanitizeTask(null as unknown as string)).toBe('an unnamed shore chore');
    expect(sanitizeTask(42 as unknown as string)).toBe('an unnamed shore chore');
  });

  it('sanitizeTask normalizes whitespace', () => {
    expect(sanitizeTask('  write   tests  ')).toBe('write tests');
  });

  it('assignTide is stable for same task + index', () => {
    const a = assignTide('write the README', 0);
    const b = assignTide('write the README', 0);
    expect(a).toEqual(b);
    expect(TIDE_PHASES).toContain(a.phase);
    expect(BERTHS).toContain(a.berth);
    expect(ADVICE).toContain(a.advice);
    expect(PRIORITIES).toContain(a.priority);
    expect(a.tideId).toMatch(/^TD-[0-9A-F]{4}$/);
    expect(a.slot).toBeGreaterThanOrEqual(10);
    expect(a.slot).toBeLessThanOrEqual(99);
  });

  it('assignTide differs across distinct inputs', () => {
    const a = assignTide('write the README', 0);
    const b = assignTide('run npm test', 1);
    expect(
      a.phase !== b.phase ||
        a.berth !== b.berth ||
        a.advice !== b.advice ||
        a.priority !== b.priority ||
        a.tideId !== b.tideId,
    ).toBe(true);
    expect(a.task).not.toBe(b.task);
  });

  it('syncTideTable defaults empty list to a breathe chore', () => {
    const rows = syncTideTable([]);
    expect(rows).toHaveLength(1);
    expect(rows[0].task).toBe('breathe with the tide');
  });

  it('syncTideTable preserves order for multiple tasks', () => {
    const rows = syncTideTable(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.task)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatTideTodo includes key markers and metaphor footer', () => {
    const table = formatTideTodo(['write tests', 'ship product']);
    expect(table).toContain('TIDE-TODO');
    expect(table).toContain('phase');
    expect(table).toContain('berth');
    expect(table).toContain('priority');
    expect(table).toContain('write tests');
    expect(table).toContain('ship product');
    expect(table).toMatch(/Metaphor only/);
    expect(table).toMatch(/never fetches real tides/i);
  });
});
