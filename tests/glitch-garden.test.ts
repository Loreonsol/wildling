import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'glitch-garden', 'lib.mjs')).href;

const {
  sanitizeHint,
  pickPlant,
  pickBed,
  pickSoil,
  plantSpecimen,
  plantMany,
  formatGarden,
  PLANTS,
  BEDS,
  SOILS,
  GARDEN_NOTES,
} = await import(libUrl);

describe('glitch-garden product', () => {
  it('sanitizeHint defaults empty / non-string to 404 murmur', () => {
    expect(sanitizeHint('')).toBe('404 murmur');
    expect(sanitizeHint('   ')).toBe('404 murmur');
    expect(sanitizeHint(null as unknown as string)).toBe('404 murmur');
    expect(sanitizeHint(42 as unknown as string)).toBe('404 murmur');
  });

  it('sanitizeHint normalizes whitespace and strips non-printable', () => {
    expect(sanitizeHint('  missing   route  ')).toBe('missing route');
    expect(sanitizeHint('path\x00lost')).toBe('pathlost');
  });

  it('pickPlant honors 404 / ivy / fern / moss / daisy / lily / vine / teapot / bookmark / weed / cache / gone', () => {
    expect(pickPlant('null 404 bloom page', 0)).toBe('Nullia 404-bloom');
    expect(pickPlant('soft link ivy crawl', 1)).toBe('Softlink ivy');
    expect(pickPlant('broken anchor fern', 2)).toBe('Broken-anchor fern');
    expect(pickPlant('missing route moss', 3)).toBe('Missing-route moss');
    expect(pickPlant('orphan path daisy', 4)).toBe('Orphaned-path daisy');
    expect(pickPlant('ghost href lily', 5)).toBe('Ghost-href lily');
    expect(pickPlant('redirect loop vine', 6)).toBe('Redirect-loop vine');
    expect(pickPlant('teapot 418 thistle', 7)).toBe('Teapot-status thistle');
    expect(pickPlant('dead bookmark clover', 8)).toBe('Dead-bookmark clover');
    expect(pickPlant('white space weed', 9)).toBe('Whitespace-weed');
    expect(pickPlant('cache miss marigold', 10)).toBe('Cache-miss marigold');
    expect(pickPlant('gone forever sunflower', 11)).toBe('Gone-forever sunflower');
    expect(PLANTS).toContain(pickPlant('generic murmur', 12));
  });

  it('pickBed honors sidebar / footer / breadcrumb / nav / sitemap / robots / cdn / empty', () => {
    expect(pickBed('cracked sidebar planter', 0)).toBe('cracked sidebar planter');
    expect(pickBed('footer mulch strip', 1)).toBe('footer mulch strip');
    expect(pickBed('breadcrumb compost heap', 2)).toBe('breadcrumb compost heap');
    expect(pickBed('nav gap window box', 3)).toBe('nav-gap window box');
    expect(pickBed('sitemap shadow bed', 4)).toBe('sitemap shadow bed');
    expect(pickBed('robots txt verge', 5)).toBe('robots.txt verge');
    expect(pickBed('cdn edge basket', 6)).toBe('cdn-edge hanging basket');
    expect(pickBed('empty search trough', 7)).toBe('empty-search trough');
    expect(BEDS).toContain(pickBed('generic bed', 8));
  });

  it('pickSoil honors 404 / 410 / stale / orphan / redirect / white / teapot / bookmark', () => {
    expect(pickSoil('404 clay bed', 0)).toBe('compacted 404 clay');
    expect(pickSoil('410 silt soft', 1)).toBe('soft 410 silt');
    expect(pickSoil('stale cache loam', 2)).toBe('stale-cache loam');
    expect(pickSoil('orphan peat link', 3)).toBe('orphan-link peat');
    expect(pickSoil('redirect ash compost', 4)).toBe('redirect-ash compost');
    expect(pickSoil('white sand space', 5)).toBe('whitespace sand');
    expect(pickSoil('teapot gravel status', 6)).toBe('teapot-status gravel');
    expect(pickSoil('bookmark dust humus', 7)).toBe('bookmark-dust humus');
    expect(SOILS).toContain(pickSoil('generic soil', 8));
  });

  it('plantSpecimen is stable for same hint + index', () => {
    const a = plantSpecimen('missing route moss', 0);
    const b = plantSpecimen('missing route moss', 0);
    expect(a).toEqual(b);
    expect(a.plant).toBe('Missing-route moss');
    expect(BEDS).toContain(a.bed);
    expect(SOILS).toContain(a.soil);
    expect(GARDEN_NOTES).toContain(a.note);
    expect(a.plotId).toMatch(/^GG-[0-9A-F]{4}$/);
  });

  it('plantSpecimen differs across distinct inputs', () => {
    const a = plantSpecimen('alpha 404 bloom', 0);
    const b = plantSpecimen('beta ghost href', 1);
    expect(
      a.plant !== b.plant ||
        a.plotId !== b.plotId ||
        a.bed !== b.bed ||
        a.soil !== b.soil ||
        a.note !== b.note,
    ).toBe(true);
  });

  it('plantMany defaults empty list to 404 murmur', () => {
    const rows = plantMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.hint).toBe('404 murmur');
  });

  it('plantMany preserves order for multiple hints', () => {
    const rows = plantMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.hint)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatGarden includes key markers and joke footer', () => {
    const out = formatGarden(['missing route', 'ghost href']);
    expect(out).toContain('GLITCH-GARDEN');
    expect(out).toContain('GG-');
    expect(out).toContain('→ bed:');
    expect(out).toContain('→ soil:');
    expect(out).toContain('→ plant:');
    expect(out).toContain('→ note:');
    expect(out).toMatch(/Joke garden only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(PLANTS.length).toBeGreaterThan(0);
    expect(BEDS.length).toBeGreaterThan(0);
    expect(SOILS.length).toBeGreaterThan(0);
    expect(GARDEN_NOTES.length).toBeGreaterThan(0);
  });
});
