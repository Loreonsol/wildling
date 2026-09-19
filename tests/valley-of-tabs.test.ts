import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'valley-of-tabs', 'lib.mjs')).href;

const {
  softHash,
  sanitizeHint,
  pickLandmark,
  pickTrailMarker,
  pickTabWeather,
  pickClosingAdvice,
  walkStop,
  walkValley,
  formatTravelogue,
  DEFAULT_TABS,
  LANDMARKS,
  TRAIL_MARKERS,
  TAB_WEATHER,
  CLOSING_ADVICE,
  TRAVELOGUE_NOTES,
} = await import(libUrl);

describe('valley-of-tabs product', () => {
  it('sanitizeHint defaults empty / non-string to unread murmur', () => {
    expect(sanitizeHint('')).toBe('unread murmur');
    expect(sanitizeHint('   ')).toBe('unread murmur');
    expect(sanitizeHint(null as unknown as string)).toBe('unread murmur');
    expect(sanitizeHint(42 as unknown as string)).toBe('unread murmur');
  });

  it('sanitizeHint normalizes whitespace and strips non-printable', () => {
    expect(sanitizeHint('  unread   docs  ')).toBe('unread docs');
    expect(sanitizeHint('tab\x00hint')).toBe('tabhint');
  });

  it('pickLandmark honors docs / recipe / map / inbox / cookie / cache / pinned / session / scroll / new / ext / ghost', () => {
    expect(pickLandmark('docs readme draft', 0)).toBe('the Bookmark Bluff');
    expect(pickLandmark('recipe cook book', 1)).toBe('Favicon Falls');
    expect(pickLandmark('map gps forever', 2)).toBe('History Hollow');
    expect(pickLandmark('inbox mail pile', 3)).toBe('Incognito Overlook');
    expect(pickLandmark('cookie cart checkout', 4)).toBe('Cookie Crag');
    expect(pickLandmark('cache offline page', 5)).toBe('Cache Canyon');
    expect(pickLandmark('pinned sticky note', 6)).toBe('Pinned Peak');
    expect(pickLandmark('session login wall', 7)).toBe('Session Spur');
    expect(pickLandmark('scroll long article', 8)).toBe('Scrollbar Saddle');
    expect(pickLandmark('new blank window', 9)).toBe('New-Tab Meadow');
    expect(pickLandmark('ext plugin panel', 10)).toBe('Extensions Escarpment');
    expect(pickLandmark('ghost dead window', 11)).toBe('Ghost-Window Ridge');
    expect(LANDMARKS).toContain(pickLandmark('generic tab title', 12));
  });

  it('pickTrailMarker / pickTabWeather / pickClosingAdvice return bank entries', () => {
    expect(TRAIL_MARKERS).toContain(pickTrailMarker(0));
    expect(TRAIL_MARKERS).toContain(pickTrailMarker(99));
    expect(TAB_WEATHER).toContain(pickTabWeather(0));
    expect(TAB_WEATHER).toContain(pickTabWeather(99));
    expect(CLOSING_ADVICE).toContain(pickClosingAdvice(0));
    expect(CLOSING_ADVICE).toContain(pickClosingAdvice(99));
  });

  it('softHash is stable and non-negative', () => {
    expect(softHash('unread docs')).toBe(softHash('unread docs'));
    expect(softHash('a')).toBeGreaterThanOrEqual(0);
    expect(softHash('a')).not.toBe(softHash('b'));
  });

  it('walkStop is stable for same hint + index', () => {
    const a = walkStop('unread docs', 0);
    const b = walkStop('unread docs', 0);
    expect(a).toEqual(b);
    expect(a.landmark).toBe('the Bookmark Bluff');
    expect(a.stopId).toMatch(/^VT-[0-9A-F]{4}$/);
    expect(TRAIL_MARKERS).toContain(a.trailMarker);
    expect(TAB_WEATHER).toContain(a.tabWeather);
    expect(CLOSING_ADVICE).toContain(a.closingAdvice);
  });

  it('walkStop differs across distinct inputs', () => {
    const a = walkStop('unread docs', 0);
    const b = walkStop('recipe half-scrolled', 1);
    expect(
      a.landmark !== b.landmark ||
        a.stopId !== b.stopId ||
        a.trailMarker !== b.trailMarker ||
        a.tabWeather !== b.tabWeather ||
        a.closingAdvice !== b.closingAdvice,
    ).toBe(true);
  });

  it('walkValley defaults empty list to DEFAULT_TABS', () => {
    const report = walkValley([]);
    expect(report.stops.map((x) => x.hint)).toEqual([...DEFAULT_TABS]);
    expect(report.travelogueId).toMatch(/^VT-[0-9A-F]{4}$/);
    expect(TRAVELOGUE_NOTES).toContain(report.note);
  });

  it('walkValley is stable and preserves order', () => {
    const a = walkValley(['unread docs', 'recipe half-scrolled']);
    const b = walkValley(['unread docs', 'recipe half-scrolled']);
    expect(a).toEqual(b);
    expect(a.stops.map((x) => x.hint)).toEqual([
      'unread docs',
      'recipe half-scrolled',
    ]);
    expect(a.stops).toHaveLength(2);
  });

  it('formatTravelogue includes key markers and joke disclaimer', () => {
    const out = formatTravelogue(['unread docs']);
    expect(out).toContain('VALLEY-OF-TABS');
    expect(out).toContain('VT-');
    expect(out).toContain('→ tab:');
    expect(out).toContain('→ weather:');
    expect(out).toContain('→ trail:');
    expect(out).toContain('→ close?:');
    expect(out).toContain('→ note:');
    expect(out).toMatch(/Joke only/);
    expect(out).toMatch(/never opens (browser )?tabs/i);
    expect(out).toMatch(/never (touches sessions|network)/i);
  });

  it('banks are non-empty', () => {
    expect(DEFAULT_TABS.length).toBeGreaterThan(0);
    expect(LANDMARKS.length).toBeGreaterThan(0);
    expect(TRAIL_MARKERS.length).toBeGreaterThan(0);
    expect(TAB_WEATHER.length).toBeGreaterThan(0);
    expect(CLOSING_ADVICE.length).toBeGreaterThan(0);
    expect(TRAVELOGUE_NOTES.length).toBeGreaterThan(0);
  });
});
