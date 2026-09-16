import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'reef-scheduler', 'lib.mjs')).href;

const {
  sanitizeJob,
  pickExpression,
  scheduleJob,
  scheduleMany,
  formatReefSchedule,
  EXPRESSIONS,
  EVENTS,
  TIDES,
  REEF_NOTES,
} = await import(libUrl);

describe('reef-scheduler product', () => {
  it('sanitizeJob defaults empty / non-string', () => {
    expect(sanitizeJob('')).toBe('quiet spawn');
    expect(sanitizeJob('   ')).toBe('quiet spawn');
    expect(sanitizeJob(null as unknown as string)).toBe('quiet spawn');
    expect(sanitizeJob(42 as unknown as string)).toBe('quiet spawn');
  });

  it('sanitizeJob normalizes whitespace', () => {
    expect(sanitizeJob('  full   moon  ')).toBe('full moon');
  });

  it('pickExpression honors moon / tide / dusk / quiet hints', () => {
    expect(pickExpression('full moon spawn', 0)).toBe('@full-moon');
    expect(pickExpression('neap tide polish', 1)).toBe('@neap-tide');
    expect(pickExpression('dusk bloom', 2)).toBe('@dusk-bloom');
    expect(pickExpression('quiet wake', 3)).toBe('@quiet-wake');
    expect(EXPRESSIONS).toContain(pickExpression('generic job', 4));
  });

  it('scheduleJob is stable for same job + index', () => {
    const a = scheduleJob('full moon spawn', 0);
    const b = scheduleJob('full moon spawn', 0);
    expect(a).toEqual(b);
    expect(a.expression).toBe('@full-moon');
    expect(EVENTS).toContain(a.event);
    expect(TIDES).toContain(a.tide);
    expect(REEF_NOTES).toContain(a.note);
    expect(a.jobId).toMatch(/^RF-[0-9A-F]{4}$/);
    expect(a.windowLabel).toMatch(/^\d{2}:\d{2} ± one tide$/);
  });

  it('scheduleJob differs across distinct inputs', () => {
    const a = scheduleJob('alpha reef', 0);
    const b = scheduleJob('beta lagoon', 1);
    expect(
      a.expression !== b.expression ||
        a.jobId !== b.jobId ||
        a.event !== b.event ||
        a.tide !== b.tide ||
        a.note !== b.note,
    ).toBe(true);
  });

  it('scheduleMany defaults empty list to quiet spawn', () => {
    const rows = scheduleMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.job).toBe('quiet spawn');
  });

  it('scheduleMany preserves order for multiple jobs', () => {
    const rows = scheduleMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.job)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatReefSchedule includes key markers and metaphor footer', () => {
    const out = formatReefSchedule(['full moon spawn', 'quiet wake']);
    expect(out).toContain('REEF-SCHEDULER');
    expect(out).toContain('@full-moon');
    expect(out).toContain('@quiet-wake');
    expect(out).toContain('RF-');
    expect(out).toContain('→ event:');
    expect(out).toMatch(/Metaphor only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(EXPRESSIONS.length).toBeGreaterThan(0);
    expect(EVENTS.length).toBeGreaterThan(0);
    expect(TIDES.length).toBeGreaterThan(0);
    expect(REEF_NOTES.length).toBeGreaterThan(0);
  });
});
