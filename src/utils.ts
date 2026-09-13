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
/** Free-range spark #2: reverse a string (harmless playground). */
export function spark2(s: string): string {
  return [...s].reverse().join('');
}
/** Free-range spark #3: reverse a string (harmless playground). */
export function spark3(s: string): string {
  return [...s].reverse().join('');
}
