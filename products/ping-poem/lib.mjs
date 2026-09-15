/**
 * ping-poem — poem structured exactly like an ICMP ping exchange.
 * offline, $0, no secrets. Pure local string helpers (no network, no sockets, no real ICMP).
 */

/** Soft nature / Brisbane / soft-tech muse names (ttl / "from"). */
const MUSES = [
  'moreton',
  'mangrove',
  'ibis',
  'stormcloud',
  'ferry',
  'jasmine',
  'pebble',
  'creek',
  'lorikeet',
  'moonpool',
  'softbit',
  'dewdrop',
];

/** Payload word bank — nature / Brisbane / soft tech. */
const WORDS = [
  'tide',
  'breeze',
  'moss',
  'echo',
  'quill',
  'lantern',
  'ripple',
  'harbour',
  'story',
  'byte',
  'whisper',
  'mango',
  'rain',
  'glow',
  'nest',
  'packet',
  'verse',
  'shore',
  'ember',
  'cloud',
  'leaf',
  'signal',
  'quiet',
  'drift',
];

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
 * Sanitize host hint into a display name.
 * @param {unknown} hostHint
 * @returns {string}
 */
export function sanitizeHost(hostHint) {
  if (hostHint == null || typeof hostHint !== 'string') return 'localhost';
  const trimmed = hostHint.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'localhost';
  // Keep printable-ish; collapse odd control chars
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 64) || 'localhost';
}

/**
 * Build a stable poem id from host (looks like an IP-ish id).
 * @param {string} name
 * @returns {string}
 */
export function poemId(name) {
  const h = softHash(name);
  const a = (h >>> 24) & 0xff;
  const b = (h >>> 16) & 0xff;
  const c = (h >>> 8) & 0xff;
  const d = h & 0xff;
  return `${a}.${b}.${c}.${d}`;
}

/**
 * Pick muse + payload words + rtt numbers from hash of host.
 * @param {string} name
 * @param {{ count?: number }} [opts]
 * @returns {{ muse: string, words: string[], times: number[], ttl: number, count: number }}
 */
export function deriveExchange(name, opts = {}) {
  const count =
    typeof opts.count === 'number' && opts.count > 0
      ? Math.min(8, Math.floor(opts.count))
      : 4;
  const h = softHash(name);
  const muse = MUSES[h % MUSES.length];
  const ttl = 48 + (h % 16); // 48–63
  const words = [];
  const times = [];
  let seed = h;
  for (let i = 0; i < count; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    words.push(WORDS[seed % WORDS.length]);
    // fabricated ms: 0.4–12.7 range-ish, one decimal
    const ms = ((seed % 124) + 4) / 10;
    times.push(ms);
  }
  return { muse, words, times, ttl, count };
}

/**
 * Core: build ping-poem exchange lines for a host hint.
 * @param {string} hostHint
 * @param {{ count?: number }} [opts]
 * @returns {string[]}
 */
export function pingPoem(hostHint, opts = {}) {
  const name = sanitizeHost(hostHint);
  const id = poemId(name);
  const { muse, words, times, ttl, count } = deriveExchange(name, opts);

  const lines = [];
  lines.push(`PING ${name} (${id}): 56(84) bytes of verse`);
  for (let i = 0; i < count; i++) {
    const payload = words[i];
    const ms = times[i].toFixed(1);
    lines.push(
      `64 bytes from ${muse}: icmp_seq=${i + 1} ttl=${ttl} time=${ms} ms  # ${payload}`,
    );
  }

  const min = Math.min(...times);
  const max = Math.max(...times);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;

  lines.push(`--- ${name} ping poetry statistics ---`);
  lines.push(
    `${count} verses transmitted, ${count} verses received, 0% packet loss (all soft returns)`,
  );
  lines.push(
    `rtt min/avg/max = ${min.toFixed(1)}/${avg.toFixed(1)}/${max.toFixed(1)} ms`,
  );
  return lines;
}

/**
 * Format full exchange as a single string.
 * Accepts a host string, or prebuilt lines array.
 * @param {string | string[]} linesOrHost
 * @param {{ count?: number }} [opts]
 * @returns {string}
 */
export function formatPingExchange(linesOrHost, opts = {}) {
  if (Array.isArray(linesOrHost)) {
    return linesOrHost.join('\n');
  }
  return pingPoem(linesOrHost, opts).join('\n');
}

export { MUSES, WORDS, softHash };
