import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(
  join(root, 'products', 'ping-poem', 'lib.mjs'),
).href;

const {
  sanitizeHost,
  poemId,
  deriveExchange,
  pingPoem,
  formatPingExchange,
  MUSES,
  WORDS,
} = await import(libUrl);

describe('ping-poem product', () => {
  it('sanitizeHost defaults empty / non-string to localhost', () => {
    expect(sanitizeHost('')).toBe('localhost');
    expect(sanitizeHost('   ')).toBe('localhost');
    expect(sanitizeHost(null as unknown as string)).toBe('localhost');
    expect(sanitizeHost(42 as unknown as string)).toBe('localhost');
  });

  it('sanitizeHost trims and collapses spaces', () => {
    expect(sanitizeHost('  moreton   bay  ')).toBe('moreton bay');
  });

  it('poemId is stable and looks IP-ish', () => {
    const a = poemId('localhost');
    const b = poemId('localhost');
    expect(a).toBe(b);
    expect(a).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
  });

  it('deriveExchange is stable for same host', () => {
    const a = deriveExchange('moreton bay');
    const b = deriveExchange('moreton bay');
    expect(a).toEqual(b);
    expect(MUSES).toContain(a.muse);
    expect(a.words).toHaveLength(4);
    expect(a.times).toHaveLength(4);
    for (const w of a.words) expect(WORDS).toContain(w);
  });

  it('pingPoem shapes like ICMP exchange', () => {
    const lines = pingPoem('localhost');
    expect(lines[0]).toMatch(/^PING localhost \([\d.]+\): 56\(84\) bytes of verse$/);
    expect(lines.some((l: string) => /icmp_seq=1/.test(l))).toBe(true);
    expect(lines.some((l: string) => /icmp_seq=4/.test(l))).toBe(true);
    const stats = lines.find((l: string) => /ping poetry statistics/.test(l));
    expect(stats).toBeDefined();
    expect(lines.some((l: string) => /0% packet loss/.test(l))).toBe(true);
    expect(lines.some((l: string) => /rtt min\/avg\/max/.test(l))).toBe(true);
  });

  it('formatPingExchange joins lines; accepts host string', () => {
    const text = formatPingExchange('softbit.local');
    expect(text).toContain('PING softbit.local');
    expect(text).toContain('--- softbit.local ping poetry statistics ---');
    expect(text.split('\n').length).toBeGreaterThan(5);
  });

  it('formatPingExchange accepts prebuilt lines array', () => {
    expect(formatPingExchange(['a', 'b'])).toBe('a\nb');
  });

  it('different hosts yield different poem ids', () => {
    expect(poemId('a')).not.toBe(poemId('b'));
  });
});
