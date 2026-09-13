/**
 * Tiny util playground — FakePlanner may append harmless helpers here.
 * Keep each addition small, pure, and tested indirectly via FakePlanner plans.
 */

/** Identity: returns the value unchanged. Useful as a no-op baseline. */
export function identity<T>(value: T): T {
  return value;
}

/** Clamp a number into [min, max]. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
