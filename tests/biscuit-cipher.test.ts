import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'biscuit-cipher', 'lib.mjs')).href;

const {
  softHash,
  sanitizeMessage,
  sanitizeKeyMaterial,
  pickLayer,
  pickCrumbRune,
  pickTinSeal,
  pickBakingAdvice,
  jokeCiphertext,
  encodeBiscuit,
  decodeBiscuit,
  encodeMany,
  formatCipherReport,
  DEFAULT_MESSAGES,
  BISCUIT_LAYERS,
  CRUMB_RUNES,
  TIN_SEALS,
  BAKING_ADVICE,
  CIPHER_NOTES,
} = await import(libUrl);

describe('biscuit-cipher product', () => {
  it('sanitizeMessage defaults empty / non-string to golden syrup murmur', () => {
    expect(sanitizeMessage('')).toBe('golden syrup murmur');
    expect(sanitizeMessage('   ')).toBe('golden syrup murmur');
    expect(sanitizeMessage(null as unknown as string)).toBe('golden syrup murmur');
    expect(sanitizeMessage(42 as unknown as string)).toBe('golden syrup murmur');
  });

  it('sanitizeKeyMaterial defaults empty / non-string to Anzac crumb', () => {
    expect(sanitizeKeyMaterial('')).toBe('Anzac crumb');
    expect(sanitizeKeyMaterial('   ')).toBe('Anzac crumb');
    expect(sanitizeKeyMaterial(null as unknown as string)).toBe('Anzac crumb');
    expect(sanitizeKeyMaterial(42 as unknown as string)).toBe('Anzac crumb');
  });

  it('sanitizeMessage / sanitizeKeyMaterial normalize whitespace and strip non-printable', () => {
    expect(sanitizeMessage('  pass   the  tin  ')).toBe('pass the tin');
    expect(sanitizeMessage('oat\x00murmur')).toBe('oatmurmur');
    expect(sanitizeKeyMaterial('  oat   tin  ')).toBe('oat tin');
    expect(sanitizeKeyMaterial('Anzac\x00crumb')).toBe('Anzaccrumb');
  });

  it('pickLayer / pickCrumbRune / pickTinSeal / pickBakingAdvice return bank entries', () => {
    expect(BISCUIT_LAYERS).toContain(pickLayer(0));
    expect(BISCUIT_LAYERS).toContain(pickLayer(99));
    expect(CRUMB_RUNES).toContain(pickCrumbRune(0));
    expect(CRUMB_RUNES).toContain(pickCrumbRune(99));
    expect(TIN_SEALS).toContain(pickTinSeal(0));
    expect(TIN_SEALS).toContain(pickTinSeal(99));
    expect(BAKING_ADVICE).toContain(pickBakingAdvice(0));
    expect(BAKING_ADVICE).toContain(pickBakingAdvice(99));
  });

  it('softHash is stable and non-negative', () => {
    expect(softHash('pass the tin')).toBe(softHash('pass the tin'));
    expect(softHash('a')).toBeGreaterThanOrEqual(0);
    expect(softHash('a')).not.toBe(softHash('b'));
  });

  it('encodeBiscuit is stable for same message + key', () => {
    const a = encodeBiscuit('pass the tin', 'oat tin');
    const b = encodeBiscuit('pass the tin', 'oat tin');
    expect(a).toEqual(b);
    expect(a.messageId).toMatch(/^BC-[0-9A-F]{4}$/);
    expect(BISCUIT_LAYERS).toContain(a.layer);
    expect(CRUMB_RUNES).toContain(a.crumbRune);
    expect(TIN_SEALS).toContain(a.tinSeal);
    expect(BAKING_ADVICE).toContain(a.bakingAdvice);
    expect(a.plaintextEcho).toBe('pass the tin');
    expect(a.keyMaterial).toBe('oat tin');
    expect(a.ciphertext).toMatch(/^BC\{/);
  });

  it('encodeBiscuit differs across distinct inputs', () => {
    const a = encodeBiscuit('pass the tin', 'oat tin');
    const b = encodeBiscuit('picnic note', 'syrup key');
    expect(
      a.messageId !== b.messageId ||
        a.layer !== b.layer ||
        a.ciphertext !== b.ciphertext ||
        a.crumbRune !== b.crumbRune,
    ).toBe(true);
  });

  it('encodeBiscuit defaults blank message / key', () => {
    const a = encodeBiscuit('', '');
    expect(a.plaintextEcho).toBe('golden syrup murmur');
    expect(a.keyMaterial).toBe('Anzac crumb');
  });

  it('jokeCiphertext is printable garble from softHash', () => {
    const h = softHash('seed');
    const c = jokeCiphertext('hello', 'key', h);
    expect(c).toMatch(/^BC\{[A-Za-z0-9+/=._\-~]+\}·/);
    expect(c).toBe(jokeCiphertext('hello', 'key', h));
  });

  it('encodeMany defaults empty list to DEFAULT_MESSAGES', () => {
    const report = encodeMany([]);
    expect(report.packets.map((x) => x.plaintextEcho)).toEqual([
      ...DEFAULT_MESSAGES,
    ]);
    expect(report.batchId).toMatch(/^BC-[0-9A-F]{4}$/);
    expect(CIPHER_NOTES).toContain(report.note);
  });

  it('encodeMany is stable and preserves order', () => {
    const a = encodeMany(['pass the tin', 'oat murmur'], 'Anzac crumb');
    const b = encodeMany(['pass the tin', 'oat murmur'], 'Anzac crumb');
    expect(a).toEqual(b);
    expect(a.packets.map((x) => x.plaintextEcho)).toEqual([
      'pass the tin',
      'oat murmur',
    ]);
    expect(a.packets).toHaveLength(2);
  });

  it('decodeBiscuit smoke — theatre recover with disclaimer', () => {
    const encoded = encodeBiscuit('pass the tin', 'oat tin');
    const fromRecord = decodeBiscuit(encoded, 'oat tin');
    expect(fromRecord.mode).toBe('decode');
    expect(fromRecord.recovered).toBe('pass the tin');
    expect(fromRecord.disclaimer).toMatch(/JOKE ONLY/i);
    expect(fromRecord.disclaimer).toMatch(/not real encryption/i);

    const fromCipher = decodeBiscuit(encoded.ciphertext, 'oat tin');
    expect(fromCipher.mode).toBe('decode');
    expect(fromCipher.recovered).toMatch(/golden syrup murmur|joke recover/i);
    expect(fromCipher.messageId).toMatch(/^BC-[0-9A-F]{4}$/);
  });

  it('formatCipherReport includes key markers and joke disclaimer', () => {
    const out = formatCipherReport(['pass the tin'], { keyHint: 'oat tin' });
    expect(out).toContain('BISCUIT-CIPHER');
    expect(out).toContain('BC-');
    expect(out).toContain('→ plain:');
    expect(out).toContain('→ cipher:');
    expect(out).toContain('→ rune:');
    expect(out).toContain('→ seal:');
    expect(out).toContain('→ bake?:');
    expect(out).toContain('→ note:');
    expect(out).toMatch(/JOKE ONLY/i);
    expect(out).toMatch(/not real encryption/i);
    expect(out).toMatch(/not (cryptography|secure)/i);
  });

  it('formatCipherReport decode path includes disclaimer', () => {
    const out = formatCipherReport([], {
      decodeText: 'BC{abc123}·ᚨ-oat',
      keyHint: 'Anzac crumb',
    });
    expect(out).toContain('BISCUIT-CIPHER');
    expect(out).toContain('mode         decode');
    expect(out).toMatch(/JOKE ONLY/i);
    expect(out).toMatch(/not real encryption/i);
  });

  it('banks are non-empty', () => {
    expect(DEFAULT_MESSAGES.length).toBeGreaterThan(0);
    expect(BISCUIT_LAYERS.length).toBeGreaterThan(0);
    expect(CRUMB_RUNES.length).toBeGreaterThan(0);
    expect(TIN_SEALS.length).toBeGreaterThan(0);
    expect(BAKING_ADVICE.length).toBeGreaterThan(0);
    expect(CIPHER_NOTES.length).toBeGreaterThan(0);
  });
});
