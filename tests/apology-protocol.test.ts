import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'apology-protocol', 'lib.mjs'),
).href;

const {
  sanitizePeer,
  sanitizeReason,
  encodeApology,
  formatApologyFrame,
  VERBS,
  FAULT_CLASSES,
  TONE_CODECS,
  AMENDS,
  SEALS,
} = await import(libUrl);

describe('apology-protocol product', () => {
  it('sanitizePeer defaults empty / non-string', () => {
    expect(sanitizePeer('')).toBe('unknown-service');
    expect(sanitizePeer('   ')).toBe('unknown-service');
    expect(sanitizePeer(null as unknown as string)).toBe('unknown-service');
    expect(sanitizePeer(42 as unknown as string)).toBe('unknown-service');
  });

  it('sanitizePeer normalizes names', () => {
    expect(sanitizePeer('  Payments API  ')).toBe('payments-api');
  });

  it('sanitizeReason defaults empty / non-string', () => {
    expect(sanitizeReason('')).toBe('an unnamed hiccup');
    expect(sanitizeReason(null as unknown as string)).toBe('an unnamed hiccup');
  });

  it('encodeApology is stable for same peers + reason', () => {
    const a = encodeApology('payments', 'notify', 'timeout of kindness');
    const b = encodeApology('payments', 'notify', 'timeout of kindness');
    expect(a).toEqual(b);
    expect(VERBS).toContain(a.verb);
    expect(FAULT_CLASSES).toContain(a.fault);
    expect(TONE_CODECS).toContain(a.codec);
    expect(AMENDS).toContain(a.amends);
    expect(SEALS).toContain(a.seal);
    expect(a.frameId).toMatch(/^AP-[0-9A-F]{4}$/);
    expect(a.sequence).toBeGreaterThanOrEqual(1000);
    expect(a.sequence).toBeLessThanOrEqual(9999);
  });

  it('encodeApology differs across distinct inputs', () => {
    const a = encodeApology('payments', 'notify', 'timeout of kindness');
    const b = encodeApology('api', 'gateway', 'stale promise');
    expect(
      a.verb !== b.verb ||
        a.fault !== b.fault ||
        a.codec !== b.codec ||
        a.amends !== b.amends ||
        a.seal !== b.seal ||
        a.frameId !== b.frameId,
    ).toBe(true);
    expect(a.from).not.toBe(b.from);
  });

  it('formatApologyFrame includes key markers and metaphor footer', () => {
    const frame = formatApologyFrame('payments', 'notify', 'timeout of kindness');
    expect(frame).toContain('APOLOGY-PROTOCOL');
    expect(frame).toContain('FRAME');
    expect(frame).toContain('VERB');
    expect(frame).toContain('FROM');
    expect(frame).toContain('TO');
    expect(frame).toContain('FAULT');
    expect(frame).toContain('CODEC');
    expect(frame).toContain('REASON');
    expect(frame).toContain('AMENDS');
    expect(frame).toContain('SEAL');
    expect(frame).toMatch(/Metaphor only/);
    expect(frame).toMatch(/never transmits/i);
  });
});
