import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'west-end-oracle', 'lib.mjs')).href;

const {
  sanitizeQuestion,
  pickShop,
  pickBooth,
  pickMood,
  consultOracle,
  consultMany,
  formatOracle,
  SHOPS,
  BOOTHS,
  MOODS,
  ORACLE_NOTES,
} = await import(libUrl);

describe('west-end-oracle product', () => {
  it('sanitizeQuestion defaults empty / non-string to west end murmur', () => {
    expect(sanitizeQuestion('')).toBe('west end murmur');
    expect(sanitizeQuestion('   ')).toBe('west end murmur');
    expect(sanitizeQuestion(null as unknown as string)).toBe('west end murmur');
    expect(sanitizeQuestion(42 as unknown as string)).toBe('west end murmur');
  });

  it('sanitizeQuestion normalizes whitespace and strips non-printable', () => {
    expect(sanitizeQuestion('  need   coffee  ')).toBe('need coffee');
    expect(sanitizeQuestion('ask\x00shop')).toBe('askshop');
  });

  it('pickShop honors coffee / book / market / bakery / vinyl / thrift / juice / dumpling / picnic / bike / plant', () => {
    expect(pickShop('need coffee please', 0)).toBe('The Gunshop Café');
    expect(pickShop('read a book tonight', 1)).toBe('Archive Bookshop');
    expect(pickShop('saturday market stall', 2)).toBe('West End Markets stall #7');
    expect(pickShop('davies park stroll', 3)).toBe('Davies Park coffee cart');
    expect(pickShop('fresh bakery bread', 4)).toBe('Boundary Street bakery');
    expect(pickShop('vinyl record music', 5)).toBe('Hardgrove Street record shop');
    expect(pickShop('thrift vintage find', 6)).toBe('Vulture Street thrift loft');
    expect(pickShop('smoothie juice stop', 7)).toBe('Musselmann Road juice hut');
    expect(pickShop('dumpling noodle lunch', 8)).toBe('Jane Street dumpling window');
    expect(pickShop('orleigh picnic blanket', 9)).toBe('Orleigh Park picnic kiosk');
    expect(pickShop('bike cycle repair', 10)).toBe('Montague Road bike shed');
    expect(pickShop('plant nursery pot', 11)).toBe('Mellon Street plant nursery');
    expect(SHOPS).toContain(pickShop('generic murmur', 12));
  });

  it('pickBooth honors canvas / fig / cardboard / coffee / davies / sticky / ferry / twilight', () => {
    expect(pickBooth('canvas tent market', 0)).toBe('canvas tent behind the markets');
    expect(pickBooth('under the fig tree', 1)).toBe('folding table under the fig');
    expect(pickBooth('cardboard boundary lean', 2)).toBe('cardboard lean-to on Boundary St');
    expect(pickBooth('coffee cart stool', 3)).toBe('stool beside the coffee cart');
    expect(pickBooth('awning davies shade', 4)).toBe('awning nook near Davies Park');
    expect(pickBooth('sticky jane shrine', 5)).toBe('sticky-note shrine on Jane St');
    expect(pickBooth('ferry queue whisper', 6)).toBe('ferry-queue whisper booth');
    expect(pickBooth('twilight dusk orleigh', 7)).toBe('twilight stall by Orleigh Park');
    expect(BOOTHS).toContain(pickBooth('generic booth', 8));
  });

  it('pickMood honors coffee / storm / buzz / thrift / sun / jacaranda / ibis / ferry', () => {
    expect(pickMood('coffee flat white paper', 0)).toBe('smells like flat whites and old paper');
    expect(pickMood('afternoon storm rain', 1)).toBe('slightly damp from afternoon storm');
    expect(pickMood('buzz chatter market', 2)).toBe('buzzing with market chatter');
    expect(pickMood('quiet thrift hush', 3)).toBe('quiet after the thrift rush');
    expect(pickMood('sun bleach optimistic', 4)).toBe('sun-bleached and optimistic');
    expect(pickMood('jacaranda petal soft', 5)).toBe('jacaranda-petal soft');
    expect(pickMood('ibis bin chicken', 6)).toBe('bin-chicken adjacent but kind');
    expect(pickMood('late ferry night', 7)).toBe('late-ferry hush');
    expect(MOODS).toContain(pickMood('generic mood', 8));
  });

  it('consultOracle is stable for same question + index', () => {
    const a = consultOracle('need coffee please', 0);
    const b = consultOracle('need coffee please', 0);
    expect(a).toEqual(b);
    expect(a.shop).toBe('The Gunshop Café');
    expect(BOOTHS).toContain(a.booth);
    expect(MOODS).toContain(a.mood);
    expect(ORACLE_NOTES).toContain(a.note);
    expect(a.oracleId).toMatch(/^WE-[0-9A-F]{4}$/);
  });

  it('consultOracle differs across distinct inputs', () => {
    const a = consultOracle('alpha coffee cafe', 0);
    const b = consultOracle('beta thrift vintage', 1);
    expect(
      a.shop !== b.shop ||
        a.oracleId !== b.oracleId ||
        a.booth !== b.booth ||
        a.mood !== b.mood ||
        a.note !== b.note,
    ).toBe(true);
  });

  it('consultMany defaults empty list to west end murmur', () => {
    const rows = consultMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.question).toBe('west end murmur');
  });

  it('consultMany preserves order for multiple questions', () => {
    const rows = consultMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.question)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatOracle includes key markers and joke footer', () => {
    const out = formatOracle(['need coffee', 'read a book']);
    expect(out).toContain('WEST-END-ORACLE');
    expect(out).toContain('WE-');
    expect(out).toContain('→ booth:');
    expect(out).toContain('→ mood:');
    expect(out).toContain('→ answer:');
    expect(out).toContain('→ note:');
    expect(out).toMatch(/Joke oracle only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(SHOPS.length).toBeGreaterThan(0);
    expect(BOOTHS.length).toBeGreaterThan(0);
    expect(MOODS.length).toBeGreaterThan(0);
    expect(ORACLE_NOTES.length).toBeGreaterThan(0);
  });
});
