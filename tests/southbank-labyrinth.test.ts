import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'southbank-labyrinth', 'lib.mjs')).href;

const {
  sanitizeHint,
  pickWall,
  pickChamber,
  pickTurn,
  buildAsciiMap,
  mapChamber,
  mapMany,
  formatLabyrinth,
  STICKY_WALLS,
  CHAMBERS,
  TURNS,
  GRAFFITI,
  LABYRINTH_NOTES,
} = await import(libUrl);

describe('southbank-labyrinth product', () => {
  it('sanitizeHint defaults empty / non-string to South Bank murmur', () => {
    expect(sanitizeHint('')).toBe('South Bank murmur');
    expect(sanitizeHint('   ')).toBe('South Bank murmur');
    expect(sanitizeHint(null as unknown as string)).toBe('South Bank murmur');
    expect(sanitizeHint(42 as unknown as string)).toBe('South Bank murmur');
  });

  it('sanitizeHint normalizes whitespace and strips non-printable', () => {
    expect(sanitizeHint('  Quiet   Jetty  ')).toBe('Quiet Jetty');
    expect(sanitizeHint('note\x00wall')).toBe('notewall');
  });

  it('pickWall honors yellow / mint / coral / blue / lilac / peach / neon / cream hints', () => {
    expect(pickWall('lemon yellow river', 0)).toBe('lemon-yellow "don\'t forget the river"');
    expect(pickWall('mint green exit', 1)).toBe('mint "exit is a rumor"');
    expect(pickWall('coral meeting', 2)).toBe('coral "meeting in chamber B"');
    expect(pickWall('sky blue torch', 3)).toBe('sky-blue "bring a torch (metaphor)"');
    expect(pickWall('lilac purple standup', 4)).toBe('lilac "this wall was a standup"');
    expect(pickWall('peach sticky side', 5)).toBe('peach "sticky side faces inward"');
    expect(pickWall('neon todo daylight', 6)).toBe('neon-green "TODO: find daylight"');
    expect(pickWall('cream soft south bank', 7)).toBe('cream "South Bank soft underfoot"');
    expect(STICKY_WALLS).toContain(pickWall('generic scribble', 8));
  });

  it('pickChamber honors jetty / wheel / pagoda / bridge / beach / gallery / arbour / promenade', () => {
    expect(pickChamber('quiet jetty walk', 0)).toBe('the Quiet Jetty antechamber');
    expect(pickChamber('wheel of brisbane', 1)).toBe('Wheel of Brisbane echo room');
    expect(pickChamber('peace pagoda', 2)).toBe('Nepalese Peace Pagoda alcove');
    expect(pickChamber('goodwill bridge', 3)).toBe('Goodwill Bridge undercroft');
    expect(pickChamber('streets beach tide', 4)).toBe('Streets Beach tide cellar');
    expect(pickChamber('goma gallery art', 5)).toBe('Gallery of Modern Art basement (joke)');
    expect(pickChamber('arbour whisper', 6)).toBe('Arbour walk whisper vault');
    expect(pickChamber('clem promenade', 7)).toBe('Clem Jones Promenade dead-end');
    expect(CHAMBERS).toContain(pickChamber('generic hallway', 8));
  });

  it('pickTurn honors left / right / straight / spiral / backtrack / diagonal / pause / climb', () => {
    expect(pickTurn('left coffee fork', 0)).toBe('left at the coffee-ring fork');
    expect(pickTurn('right peel notes', 1)).toBe('right past three peeling Post-its');
    expect(pickTurn('straight fade ink', 2)).toBe('straight until the handwriting fades');
    expect(pickTurn('spiral meeting notes', 3)).toBe('down the spiral of meeting notes');
    expect(pickTurn('backtrack glue out', 4)).toBe('backtrack when the glue gives out');
    expect(pickTurn('diagonal brainstorm', 5)).toBe('diagonal through the brainstorm cluster');
    expect(pickTurn('pause neon exit', 6)).toBe('pause under the neon "EXIT?" scribble');
    expect(pickTurn('climb paper stairs', 7)).toBe('climb the paper stairs two notes at a time');
    expect(TURNS).toContain(pickTurn('generic corridor', 8));
  });

  it('buildAsciiMap returns a grid with S and X markers', () => {
    const map = buildAsciiMap(42);
    expect(map).toContain('+---+---+---+');
    expect(map).toContain('| S |');
    expect(map).toContain('| X |');
    expect(map.split('\n')).toHaveLength(7);
  });

  it('mapChamber is stable for same hint + index', () => {
    const a = mapChamber('Quiet Jetty neon', 0);
    const b = mapChamber('Quiet Jetty neon', 0);
    expect(a).toEqual(b);
    expect(a.chamber).toBe('the Quiet Jetty antechamber');
    expect(STICKY_WALLS).toContain(a.wall);
    expect(TURNS).toContain(a.turn);
    expect(GRAFFITI).toContain(a.graffiti);
    expect(LABYRINTH_NOTES).toContain(a.note);
    expect(a.ascii).toContain('S');
    expect(a.mapId).toMatch(/^SL-[0-9A-F]{4}$/);
  });

  it('mapChamber differs across distinct inputs', () => {
    const a = mapChamber('alpha quiet jetty', 0);
    const b = mapChamber('beta wheel climb', 1);
    expect(
      a.wall !== b.wall ||
        a.mapId !== b.mapId ||
        a.chamber !== b.chamber ||
        a.turn !== b.turn ||
        a.graffiti !== b.graffiti ||
        a.note !== b.note ||
        a.ascii !== b.ascii,
    ).toBe(true);
  });

  it('mapMany defaults empty list to South Bank murmur', () => {
    const rows = mapMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.hint).toBe('South Bank murmur');
  });

  it('mapMany preserves order for multiple hints', () => {
    const rows = mapMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.hint)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatLabyrinth includes key markers and joke footer', () => {
    const out = formatLabyrinth(['Quiet Jetty', 'neon EXIT?']);
    expect(out).toContain('SOUTHBANK-LABYRINTH');
    expect(out).toContain('SL-');
    expect(out).toContain('→ wall:');
    expect(out).toContain('→ turn:');
    expect(out).toContain('→ graffiti:');
    expect(out).toContain('→ note:');
    expect(out).toContain('→ ascii:');
    expect(out).toContain('+---+---+---+');
    expect(out).toMatch(/Joke map only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(STICKY_WALLS.length).toBeGreaterThan(0);
    expect(CHAMBERS.length).toBeGreaterThan(0);
    expect(TURNS.length).toBeGreaterThan(0);
    expect(GRAFFITI.length).toBeGreaterThan(0);
    expect(LABYRINTH_NOTES.length).toBeGreaterThan(0);
  });
});
