/**
 * biscuit-cipher — Encryption scheme that uses Anzac biscuits as key material.
 *
 * JOKE / METAPHOR ONLY.
 * - NOT real encryption. NOT cryptography. NOT secure.
 * - Never protects secrets; never stores keys; never network.
 * - Soft-hash printable garble for theatre — anyone can "decode" the echo.
 * - Offline, $0, no secrets.
 */

/** Friendly defaults when argv is empty. */
export const DEFAULT_MESSAGES = [
  'pass the tin',
  'oat murmur',
  'golden syrup hush',
  'Anzac picnic note',
];

/** Biscuit layer metaphors (joke cipher stages). */
export const BISCUIT_LAYERS = [
  'oat lattice crust',
  'golden-syrup glaze',
  'desiccated coconut veil',
  'brown-sugar crumb bed',
  'butter-melt underlayer',
  'bicarb whisper film',
  'rolled-oat braid',
  'treacle sheen',
  'crisp edge seal',
  'chewy centre fold',
  'picnic-tin liner',
  'dawn-bake skin',
];

/** Crumb runes stamped into the joke ciphertext. */
export const CRUMB_RUNES = [
  'ᚨ-oat',
  'ᛒ-syrup',
  'ᚲ-crumb',
  'ᛞ-tin',
  'ᛖ-bake',
  'ᚠ-butter',
  'ᚷ-golden',
  'ᚺ-Anzac',
  'ᛁ-picnic',
  'ᛃ-tray',
  'ᛚ-lattice',
  'ᛗ-murmur',
];

/** Tin seals for the biscuit cipher report. */
export const TIN_SEALS = [
  'red picnic tin seal',
  'waxed baking-paper clasp',
  'string-and-button latch',
  'grandmother-recipe sticker',
  'dawn-shift oven mark',
  'beach-blanket wax stamp',
  'ANZAC day ribbon clip',
  'soft crumb gasket',
  'treacle jar lid seal',
  'oat-dust fingerprint',
  'kitchen-drawer padlock (joke)',
  'tea-towel twist tie',
];

/** Baking advice (joke — never actual crypto advice). */
export const BAKING_ADVICE = [
  'Rotate the tin, not the key schedule.',
  'If it crumbles, that is the ciphertext working.',
  'Golden syrup holds better than AES jokes.',
  'Cool before opening — secrets are biscuits, not bits.',
  'Share the tin; never the myth of security.',
  'Undercooked layers decode as soft murmurs.',
  'A second bake is just another softHash pass.',
  'Leave one biscuit for the test suite.',
  'Crumb runes fade if you take this seriously.',
  'Picnic first; cryptography never.',
  'If it tastes secure, you baked the wrong thing.',
  'Exit when the tin stops pretending to be a vault.',
];

/** Soft notes printed under every cipher report. */
export const CIPHER_NOTES = [
  'JOKE ONLY — not real encryption, not cryptography, not secure.',
  'Offline, $0, no secrets — biscuits stay in stdout.',
  'Blank messages default to a golden syrup murmur.',
  'Blank keys default to an Anzac crumb.',
  'If tests fail, rewind; this cipher cannot protect anything.',
  'Metaphor tin only — no network, no key storage, no crypto.',
  'Decode returns theatre, not confidentiality.',
  'Real encryption would be harmful to joke about as safe — this is not safe.',
];

/**
 * Stable non-crypto hash → non-negative int.
 * @param {string} s
 * @returns {number}
 */
export function softHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Sanitize plaintext message for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeMessage(text) {
  if (text == null || typeof text !== 'string') return 'golden syrup murmur';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'golden syrup murmur';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 120) || 'golden syrup murmur';
}

/**
 * Sanitize key-material hint (Anzac biscuit joke key).
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeKeyMaterial(text) {
  if (text == null || typeof text !== 'string') return 'Anzac crumb';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'Anzac crumb';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'Anzac crumb';
}

/**
 * Pick a biscuit layer from seed bits.
 * @param {number} h
 * @returns {string}
 */
export function pickLayer(h) {
  return BISCUIT_LAYERS[h % BISCUIT_LAYERS.length];
}

/**
 * Pick a crumb rune from seed bits.
 * @param {number} h
 * @returns {string}
 */
export function pickCrumbRune(h) {
  return CRUMB_RUNES[h % CRUMB_RUNES.length];
}

/**
 * Pick a tin seal from seed bits.
 * @param {number} h
 * @returns {string}
 */
export function pickTinSeal(h) {
  return TIN_SEALS[h % TIN_SEALS.length];
}

/**
 * Pick baking advice from seed bits.
 * @param {number} h
 * @returns {string}
 */
export function pickBakingAdvice(h) {
  return BAKING_ADVICE[h % BAKING_ADVICE.length];
}

/**
 * Build joke printable garble from softHash (NOT encryption).
 * @param {string} message
 * @param {string} key
 * @param {number} h
 * @returns {string}
 */
export function jokeCiphertext(message, key, h) {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=._-~';
  const seed = softHash(`${h}|${message}|${key}|biscuit`);
  const len = 16 + (seed % 17);
  let out = '';
  let state = seed;
  for (let i = 0; i < len; i++) {
    state = (state * 1103515245 + 12345 + i) >>> 0;
    out += alphabet[state % alphabet.length];
  }
  const rune = pickCrumbRune(h >>> 4);
  return `BC{${out}}·${rune}`;
}

/**
 * Encode a message with Anzac-biscuit key theatre.
 * @param {unknown} messageText
 * @param {unknown} [keyHint]
 * @returns {{
 *   messageId: string,
 *   layer: string,
 *   crumbRune: string,
 *   tinSeal: string,
 *   bakingAdvice: string,
 *   ciphertext: string,
 *   plaintextEcho: string,
 *   keyMaterial: string,
 *   note: string
 * }}
 */
export function encodeBiscuit(messageText, keyHint) {
  const message = sanitizeMessage(messageText);
  const keyMaterial = sanitizeKeyMaterial(keyHint);
  const h = softHash(`${message}|${keyMaterial}`);
  const messageId = `BC-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const layer = pickLayer(h);
  const crumbRune = pickCrumbRune(h >>> 4);
  const tinSeal = pickTinSeal(h >>> 8);
  const bakingAdvice = pickBakingAdvice(h >>> 12);
  const ciphertext = jokeCiphertext(message, keyMaterial, h);
  const note = CIPHER_NOTES[(h >>> 16) % CIPHER_NOTES.length];
  return {
    messageId,
    layer,
    crumbRune,
    tinSeal,
    bakingAdvice,
    ciphertext,
    plaintextEcho: message,
    keyMaterial,
    note,
  };
}

/**
 * Joke "decode" — reveals theatre, never real crypto reverse.
 * Accepts either a ciphertext string or a prior encode result shape.
 * @param {unknown} ciphertextOrRecord
 * @param {unknown} [keyHint]
 * @returns {{
 *   mode: 'decode',
 *   messageId: string,
 *   recovered: string,
 *   layer: string,
 *   crumbRune: string,
 *   tinSeal: string,
 *   bakingAdvice: string,
 *   ciphertext: string,
 *   keyMaterial: string,
 *   note: string,
 *   disclaimer: string
 * }}
 */
export function decodeBiscuit(ciphertextOrRecord, keyHint) {
  let ciphertext = '';
  let plaintextHint = '';
  if (
    ciphertextOrRecord != null &&
    typeof ciphertextOrRecord === 'object' &&
    !Array.isArray(ciphertextOrRecord)
  ) {
    const rec = /** @type {Record<string, unknown>} */ (ciphertextOrRecord);
    ciphertext =
      typeof rec.ciphertext === 'string' ? rec.ciphertext : String(rec.ciphertext ?? '');
    plaintextHint =
      typeof rec.plaintextEcho === 'string'
        ? rec.plaintextEcho
        : typeof rec.message === 'string'
          ? rec.message
          : '';
  } else if (typeof ciphertextOrRecord === 'string') {
    ciphertext = ciphertextOrRecord;
  } else {
    ciphertext = String(ciphertextOrRecord ?? '');
  }

  const keyMaterial = sanitizeKeyMaterial(keyHint);
  const sanitizedCipher = sanitizeMessage(ciphertext);
  const h = softHash(`decode|${sanitizedCipher}|${keyMaterial}`);
  const messageId = `BC-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  // Joke recovery: if it looks like our garble, echo a soft murmur; else soft-hash theatre.
  const recovered =
    plaintextHint.length > 0
      ? sanitizeMessage(plaintextHint)
      : sanitizedCipher.startsWith('BC{')
        ? 'golden syrup murmur (joke recover — never real plaintext)'
        : `crumb-echo:${sanitizedCipher.slice(0, 40)}`;
  const layer = pickLayer(h);
  const crumbRune = pickCrumbRune(h >>> 4);
  const tinSeal = pickTinSeal(h >>> 8);
  const bakingAdvice = pickBakingAdvice(h >>> 12);
  const note = CIPHER_NOTES[(h >>> 16) % CIPHER_NOTES.length];
  return {
    mode: 'decode',
    messageId,
    recovered,
    layer,
    crumbRune,
    tinSeal,
    bakingAdvice,
    ciphertext: sanitizedCipher,
    keyMaterial,
    note,
    disclaimer:
      'JOKE ONLY — not real encryption; decode is theatre, not confidentiality.',
  };
}

/**
 * Encode one or more messages into a report payload.
 * @param {unknown[]} messages
 * @param {unknown} [keyHint]
 * @returns {{
 *   packets: ReturnType<typeof encodeBiscuit>[],
 *   batchId: string,
 *   keyMaterial: string,
 *   note: string
 * }}
 */
export function encodeMany(messages, keyHint) {
  const raw = Array.isArray(messages) ? messages : [];
  const list = raw.length === 0 ? [...DEFAULT_MESSAGES] : raw;
  const keyMaterial = sanitizeKeyMaterial(keyHint);
  const packets = list.map((m) => encodeBiscuit(m, keyMaterial));
  const seed = packets.map((p) => p.plaintextEcho).join('|') + '|' + keyMaterial;
  const reportHash = softHash(seed);
  const batchId = `BC-${(reportHash % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const note = CIPHER_NOTES[(reportHash >>> 4) % CIPHER_NOTES.length];
  return { packets, batchId, keyMaterial, note };
}

/**
 * Pretty-print a biscuit-cipher report (encode or decode).
 * @param {unknown[]} messages
 * @param {{ keyHint?: unknown, decodeText?: unknown }} [opts]
 * @returns {string}
 */
export function formatCipherReport(messages, opts = {}) {
  const keyHint = opts.keyHint;
  const decodeText = opts.decodeText;

  if (decodeText != null && String(decodeText).length > 0) {
    const decoded = decodeBiscuit(decodeText, keyHint);
    const lines = [
      'BISCUIT-CIPHER — Anzac biscuit key-material encryption (JOKE ONLY)',
      'NOT real encryption · offline · $0 · no secrets · not cryptography',
      '',
      `mode         decode`,
      `messageId    ${decoded.messageId}`,
      `keyMaterial  ${decoded.keyMaterial}`,
      `ciphertext   ${decoded.ciphertext}`,
      `recovered    ${decoded.recovered}`,
      `layer        ${decoded.layer}`,
      `crumbRune    ${decoded.crumbRune}`,
      `tinSeal      ${decoded.tinSeal}`,
      `advice       ${decoded.bakingAdvice}`,
      '',
      `  → note: ${decoded.note}`,
      '',
      decoded.disclaimer,
      'JOKE ONLY — never protects secrets; never stores keys; never network.',
    ];
    return lines.join('\n').trimEnd() + '\n';
  }

  const report = encodeMany(messages, keyHint);
  const lines = [
    'BISCUIT-CIPHER — Anzac biscuit key-material encryption (JOKE ONLY)',
    'NOT real encryption · offline · $0 · no secrets · not cryptography',
    '',
    `batchId      ${report.batchId}`,
    `keyMaterial  ${report.keyMaterial}`,
    '',
    'id      layer / rune → tin, advice & joke ciphertext',
    '------  -------------------------------------------',
  ];
  for (const p of report.packets) {
    lines.push(`${p.messageId}  ${p.layer}`);
    lines.push(`  → plain: ${p.plaintextEcho}`);
    lines.push(`  → cipher: ${p.ciphertext}`);
    lines.push(`  → rune: ${p.crumbRune}`);
    lines.push(`  → seal: ${p.tinSeal}`);
    lines.push(`  → bake?: ${p.bakingAdvice}`);
  }
  lines.push('');
  lines.push(`  → note: ${report.note}`);
  lines.push('');
  lines.push(
    'JOKE ONLY — not real encryption, not cryptography, not secure.',
  );
  lines.push(
    'Never protects secrets; never stores keys; never network.',
  );
  return lines.join('\n').trimEnd() + '\n';
}
