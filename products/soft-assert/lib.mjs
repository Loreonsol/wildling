/**
 * soft-assert — testing helper that fails gently with a hug and a tip.
 * Offline, $0, no secrets. Pure local assertions (not a test runner).
 */

const TIPS = [
  'Breathe. Rename the expected value so it matches the world you meant.',
  'Check the edge case you skipped — empty strings hide in plain sight.',
  'Print the actual once; hugs are better when they know what went wrong.',
  'Maybe flip the comparison — lessThan vs greaterThan is a classic trap.',
  'Split the assert: prove the shape first, then the value.',
  'A soft retry after a settle() beats a hard fail on flaky timing.',
];

const HUGS = [
  '🫂 soft hug',
  '🤗 gentle squeeze',
  '💛 warm hold',
  '🌿 quiet pat',
  '✨ kindness bump',
];

function pick(list, seed) {
  const i = Math.abs(seed) % list.length;
  return list[i];
}

function hashSeed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/**
 * Soft assertion error — still an Error, but with hug + tip fields.
 */
export class SoftAssertError extends Error {
  /**
   * @param {string} message
   * @param {{ hug: string, tip: string, actual?: unknown, expected?: unknown }} extra
   */
  constructor(message, extra) {
    super(message);
    this.name = 'SoftAssertError';
    this.hug = extra.hug;
    this.tip = extra.tip;
    if ('actual' in extra) this.actual = extra.actual;
    if ('expected' in extra) this.expected = extra.expected;
  }
}

/**
 * Build a gentle failure payload from a label / values.
 * @returns {{ ok: false, hug: string, tip: string, message: string }}
 */
export function gentleFail(label, { actual, expected } = {}) {
  const seedSrc = `${label ?? ''}|${String(actual)}|${String(expected)}`;
  const seed = hashSeed(seedSrc);
  const hug = pick(HUGS, seed);
  const tip = pick(TIPS, seed >>> 3);
  const bits = [label || 'assertion drifted'];
  if (expected !== undefined) bits.push(`expected ${JSON.stringify(expected)}`);
  if (actual !== undefined) bits.push(`got ${JSON.stringify(actual)}`);
  const message = `${hug} — ${bits.join('; ')}. Tip: ${tip}`;
  return { ok: false, hug, tip, message, actual, expected };
}

/**
 * Soft assert: returns a result object; never throws unless `throwOnFail` is true.
 * @param {unknown} condition
 * @param {string} [label]
 * @param {{ throwOnFail?: boolean, actual?: unknown, expected?: unknown }} [opts]
 * @returns {{ ok: true, hug: string } | { ok: false, hug: string, tip: string, message: string }}
 */
export function softAssert(condition, label = 'softAssert', opts = {}) {
  const { throwOnFail = false, actual, expected } = opts;
  if (condition) {
    return { ok: true, hug: '✅ held gently — all good' };
  }
  const fail = gentleFail(label, { actual, expected });
  if (throwOnFail) {
    throw new SoftAssertError(fail.message, fail);
  }
  return fail;
}

/**
 * Equality helper: softAssert(actual === expected) with richer labels.
 */
export function softEqual(actual, expected, label = 'softEqual', opts = {}) {
  return softAssert(Object.is(actual, expected), label, {
    ...opts,
    actual,
    expected,
  });
}

/**
 * Format a soft-assert result for CLI / logs.
 */
export function formatResult(result) {
  if (result.ok) return result.hug;
  return result.message;
}

export { TIPS, HUGS };
