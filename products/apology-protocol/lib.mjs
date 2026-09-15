/**
 * apology-protocol — wire protocol for sending sincere apologies between services.
 * offline, $0, no secrets. Metaphor only — never opens a socket or sends traffic.
 */

/** Protocol verbs (handshake of remorse). */
export const VERBS = [
  'APOLOGIZE',
  'ACKNOWLEDGE',
  'REGRET',
  'REPAIR',
  'FORGIVE',
  'LISTEN',
  'AMENDS',
  'SOFTEN',
];

/** Fault classes (what went wrong, gently named). */
export const FAULT_CLASSES = [
  'timeout-of-kindness',
  'dropped-empathy-frame',
  'stale-promise-cache',
  'partial-truth-payload',
  'unbounded-retry-of-hurt',
  'missing-context-header',
  'race-on-assumptions',
  'silent-500-of-the-heart',
];

/** Tone codecs (how the apology is encoded). */
export const TONE_CODECS = [
  'sincerity/1.0',
  'humility+plain',
  'warmth/chunked',
  'accountability-json',
  'quiet-binary-of-care',
  'no-excuse/utf-8',
  'repair-oriented/ndjson',
  'listen-first/stream',
];

/** Next-step amends (what the sender commits to). */
export const AMENDS = [
  'Will document the edge case before the next deploy.',
  'Will reply within one human breath, not one SLA day.',
  'Will add a test that catches this kindness regression.',
  'Will stop retrying the same hurtful path.',
  'Will name the assumption that failed in the runbook.',
  'Will leave a porch light on for the other service.',
  'Will prefer a soft assert over a hard blame.',
  'Will reopen the conversation when the tide turns green.',
];

/** Closing seals (protocol trailers). */
export const SEALS = [
  'END-OF-REGRET',
  'CRC:care',
  'NO-SECRETS-ATTACHED',
  'OFFLINE-ONLY',
  'METAPHOR/OK',
  'HUMILITY-CHECKSUM',
  'LISTEN-WINDOW:open',
  'FORGIVENESS-OPTIONAL',
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
 * Sanitize a service / peer name for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizePeer(text) {
  if (text == null || typeof text !== 'string') return 'unknown-service';
  const trimmed = text.trim().replace(/\s+/g, '-').toLowerCase();
  if (trimmed.length === 0) return 'unknown-service';
  return trimmed.replace(/[^a-z0-9._-]/g, '').slice(0, 64) || 'unknown-service';
}

/**
 * Sanitize apology reason / incident note.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeReason(text) {
  if (text == null || typeof text !== 'string') return 'an unnamed hiccup';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'an unnamed hiccup';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 160) || 'an unnamed hiccup';
}

/**
 * Encode a deterministic apology frame between two peers.
 * @param {unknown} fromPeer
 * @param {unknown} toPeer
 * @param {unknown} [reason]
 * @returns {{
 *   from: string,
 *   to: string,
 *   reason: string,
 *   reasonPreview: string,
 *   verb: string,
 *   fault: string,
 *   codec: string,
 *   amends: string,
 *   seal: string,
 *   frameId: string,
 *   sequence: number
 * }}
 */
export function encodeApology(fromPeer, toPeer, reason) {
  const from = sanitizePeer(fromPeer);
  const to = sanitizePeer(toPeer);
  const why = sanitizeReason(reason);
  const h = softHash(`${from}|${to}|${why}`);
  const reasonPreview = why.length > 72 ? `${why.slice(0, 69)}...` : why;
  const frameId = `AP-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  return {
    from,
    to,
    reason: why,
    reasonPreview,
    verb: VERBS[h % VERBS.length],
    fault: FAULT_CLASSES[(h >>> 4) % FAULT_CLASSES.length],
    codec: TONE_CODECS[(h >>> 8) % TONE_CODECS.length],
    amends: AMENDS[(h >>> 12) % AMENDS.length],
    seal: SEALS[(h >>> 16) % SEALS.length],
    frameId,
    sequence: (h % 9000) + 1000,
  };
}

/**
 * Format a printable wire-style apology frame.
 * @param {unknown} fromPeer
 * @param {unknown} toPeer
 * @param {unknown} [reason]
 * @returns {string}
 */
export function formatApologyFrame(fromPeer, toPeer, reason) {
  const f = encodeApology(fromPeer, toPeer, reason);
  const width = 56;
  const line = '='.repeat(width);
  const row = (k, v) => {
    const label = String(k).padEnd(10);
    const body = String(v).slice(0, width - 14);
    return `${label}: ${body}`;
  };
  return [
    line,
    'APOLOGY-PROTOCOL / 0.1  (metaphor wire; no sockets)',
    line,
    row('FRAME', f.frameId),
    row('SEQ', f.sequence),
    row('VERB', f.verb),
    row('FROM', f.from),
    row('TO', f.to),
    row('FAULT', f.fault),
    row('CODEC', f.codec),
    row('REASON', f.reasonPreview),
    row('AMENDS', f.amends),
    row('SEAL', f.seal),
    line,
    'Trailer: Content-Length: sincerity; Connection: still-here',
    '(Metaphor only — never transmits. Offline, $0, no secrets.)',
  ].join('\n');
}
