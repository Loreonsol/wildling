import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'cardboard-oracle', 'lib.mjs'),
).href;

const {
  sanitizeQuestion,
  trackingId,
  drawLabel,
  formatOracleSlip,
  CARRIERS,
  DESTINATIONS,
  HANDLING,
  ORACLES,
} = await import(libUrl);

describe('cardboard-oracle product', () => {
  it('sanitizeQuestion defaults empty / non-string', () => {
    expect(sanitizeQuestion('')).toBe('what next?');
    expect(sanitizeQuestion('   ')).toBe('what next?');
    expect(sanitizeQuestion(null as unknown as string)).toBe('what next?');
    expect(sanitizeQuestion(42 as unknown as string)).toBe('what next?');
  });

  it('sanitizeQuestion trims and collapses spaces', () => {
    expect(sanitizeQuestion('  should   I ship  ')).toBe('should I ship');
  });

  it('trackingId is stable and barcode-ish', () => {
    const a = trackingId('should I ship');
    const b = trackingId('should I ship');
    expect(a).toBe(b);
    expect(a).toMatch(/^CB-\d{4}-\d{4}-\d{2}$/);
  });

  it('drawLabel is stable for same question', () => {
    const a = drawLabel('courage?');
    const b = drawLabel('courage?');
    expect(a).toEqual(b);
    expect(CARRIERS).toContain(a.carrier);
    expect(DESTINATIONS).toContain(a.destination);
    expect(HANDLING).toContain(a.handling);
    expect(ORACLES).toContain(a.oracle);
  });

  it('drawLabel differs across distinct questions', () => {
    const a = drawLabel('ship the tiny thing');
    const b = drawLabel('nap instead');
    expect(a.tracking).not.toBe(b.tracking);
  });

  it('formatOracleSlip includes tracking and metaphor footer', () => {
    const slip = formatOracleSlip('what next?');
    expect(slip).toContain('CARDBOARD ORACLE');
    expect(slip).toContain('TRACKING:');
    expect(slip).toContain('CB-');
    expect(slip).toMatch(/Metaphor only/);
  });
});
