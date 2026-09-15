import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'soft-assert', 'lib.mjs'),
).href;

const {
  softAssert,
  softEqual,
  SoftAssertError,
  formatResult,
  gentleFail,
} = await import(libUrl);

describe('soft-assert product', () => {
  it('passes with a gentle hug when condition is truthy', () => {
    const r = softAssert(true, 'ok path');
    expect(r.ok).toBe(true);
    expect(r.hug).toMatch(/gently|good/i);
  });

  it('fails softly without throwing by default', () => {
    const r = softAssert(false, 'drifted');
    expect(r.ok).toBe(false);
    expect(r.hug).toBeTruthy();
    expect(r.tip.length).toBeGreaterThan(10);
    expect(r.message).toContain('Tip:');
  });

  it('softEqual uses Object.is and includes actual/expected', () => {
    const r = softEqual(1, 2, 'numbers');
    expect(r.ok).toBe(false);
    expect(r.actual).toBe(1);
    expect(r.expected).toBe(2);
    expect(formatResult(r)).toContain('1');
  });

  it('throws SoftAssertError when throwOnFail is true', () => {
    expect(() =>
      softAssert(false, 'must hug', { throwOnFail: true, actual: 0, expected: 1 }),
    ).toThrow(SoftAssertError);
    try {
      softAssert(false, 'must hug', { throwOnFail: true });
    } catch (e) {
      expect(e).toBeInstanceOf(SoftAssertError);
      expect((e as InstanceType<typeof SoftAssertError>).hug).toBeTruthy();
      expect((e as InstanceType<typeof SoftAssertError>).tip).toBeTruthy();
    }
  });

  it('gentleFail is deterministic for the same inputs', () => {
    const a = gentleFail('same', { actual: 'x', expected: 'y' });
    const b = gentleFail('same', { actual: 'x', expected: 'y' });
    expect(a.hug).toBe(b.hug);
    expect(a.tip).toBe(b.tip);
  });
});
