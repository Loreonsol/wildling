import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'subway-constellation', 'lib.mjs')).href;

const {
  sanitizeStation,
  pickStar,
  pickTransferLine,
  pickGlyph,
  chartStation,
  buildChart,
  buildAsciiChart,
  formatConstellation,
  DEFAULT_STATIONS,
  STAR_NAMES,
  TRANSFER_LINES,
  STAR_GLYPHS,
  CHART_NOTES,
} = await import(libUrl);

describe('subway-constellation product', () => {
  it('sanitizeStation defaults empty / non-string to platform murmur', () => {
    expect(sanitizeStation('')).toBe('platform murmur');
    expect(sanitizeStation('   ')).toBe('platform murmur');
    expect(sanitizeStation(null as unknown as string)).toBe('platform murmur');
    expect(sanitizeStation(42 as unknown as string)).toBe('platform murmur');
  });

  it('sanitizeStation normalizes whitespace and strips non-printable', () => {
    expect(sanitizeStation('  Central   Station  ')).toBe('Central Station');
    expect(sanitizeStation('Roma\x00Street')).toBe('RomaStreet');
  });

  it('pickStar honors central / roma / south / park / ferry / airport / ticket / whistle / oyster / metro / seven / ghost', () => {
    expect(pickStar('Central city hub', 0)).toBe('Transferia Major');
    expect(pickStar('Roma Street platform', 1)).toBe('Platformis');
    expect(pickStar('South Bank river', 2)).toBe('Railuxe');
    expect(pickStar('Park Road stop', 3)).toBe('Timetable Minor');
    expect(pickStar('ferry riverside dock', 4)).toBe('Carriagea');
    expect(pickStar('airport domestic terminal', 5)).toBe('Signalux');
    expect(pickStar('ticket gate booth', 6)).toBe('Ticketis');
    expect(pickStar('whistle horn blast', 7)).toBe('Whistleborne');
    expect(pickStar('oyster card tap', 8)).toBe('Oysterra');
    expect(pickStar('metro subway line', 9)).toBe('Metroline');
    expect(pickStar('platform 7 seven', 10)).toBe('Platform Seven');
    expect(pickStar('ghost unused siding', 11)).toBe('Ghost Platform');
    expect(STAR_NAMES).toContain(pickStar('generic halt', 12));
  });

  it('pickTransferLine honors amber / midnight / spiral / quiet / cross / late / gate / escalator / under / timetable / whistle / spare', () => {
    expect(pickTransferLine('amber peak', 'hub', 0)).toBe('the Amber Transfer Arc');
    expect(pickTransferLine('midnight night', 'yard', 1)).toBe('Midnight Platform Chord');
    expect(pickTransferLine('peak-hour spiral', 'loop', 2)).toBe('Peak-Hour Spiral');
    expect(pickTransferLine('quiet carriage', 'car', 3)).toBe('Quiet Carriage Filament');
    expect(pickTransferLine('cross platform change', 'bay', 4)).toBe('Cross-Platform Meridian');
    expect(pickTransferLine('late train', 'express', 5)).toBe('Late-Train Zigzag');
    expect(pickTransferLine('gate change', 'booth', 6)).toBe('Gate-Change Ribbon');
    expect(pickTransferLine('escalator elbow', 'stair', 7)).toBe('Escalator Elbow');
    expect(pickTransferLine('under pass umbra', 'tunnel', 8)).toBe('Underpass Umbra');
    expect(pickTransferLine('timetable tangent', 'clock', 9)).toBe('Timetable Tangent');
    expect(pickTransferLine('soft whistle', 'tone', 10)).toBe('Soft Whistle Vector');
    expect(pickTransferLine('spare seat diagonal', 'bench', 11)).toBe('Spare-Seat Diagonal');
    expect(TRANSFER_LINES).toContain(pickTransferLine('alpha', 'beta', 12));
  });

  it('pickGlyph returns a bank glyph', () => {
    expect(STAR_GLYPHS).toContain(pickGlyph(0));
    expect(STAR_GLYPHS).toContain(pickGlyph(99));
  });

  it('chartStation is stable for same station + index', () => {
    const a = chartStation('Central', 0);
    const b = chartStation('Central', 0);
    expect(a).toEqual(b);
    expect(a.star).toBe('Transferia Major');
    expect(a.starId).toMatch(/^SC-[0-9A-F]{4}$/);
    expect(STAR_GLYPHS).toContain(a.glyph);
  });

  it('chartStation differs across distinct inputs', () => {
    const a = chartStation('Central', 0);
    const b = chartStation('Airport', 1);
    expect(
      a.star !== b.star ||
        a.starId !== b.starId ||
        a.glyph !== b.glyph ||
        a.x !== b.x ||
        a.y !== b.y,
    ).toBe(true);
  });

  it('buildChart defaults empty list to DEFAULT_STATIONS', () => {
    const chart = buildChart([]);
    expect(chart.stations.map((s) => s.station)).toEqual([...DEFAULT_STATIONS]);
    expect(chart.transfers.length).toBe(DEFAULT_STATIONS.length - 1);
    expect(chart.chartId).toMatch(/^SC-[0-9A-F]{4}$/);
    expect(CHART_NOTES).toContain(chart.note);
    expect(chart.ascii).toContain('+');
  });

  it('buildChart is stable and preserves order', () => {
    const a = buildChart(['Central', 'Roma Street', 'South Bank']);
    const b = buildChart(['Central', 'Roma Street', 'South Bank']);
    expect(a).toEqual(b);
    expect(a.stations.map((s) => s.station)).toEqual([
      'Central',
      'Roma Street',
      'South Bank',
    ]);
    expect(a.transfers).toHaveLength(2);
    expect(a.transfers[0]!.from).toBe('Central');
    expect(a.transfers[0]!.to).toBe('Roma Street');
  });

  it('buildAsciiChart includes border and star glyphs', () => {
    const ascii = buildAsciiChart(
      [
        { label: 'A', glyph: '*', x: 3, y: 2 },
        { label: 'B', glyph: '+', x: 20, y: 6 },
      ],
      [{ fromIdx: 0, toIdx: 1 }],
    );
    expect(ascii).toContain('+----------------------------+');
    expect(ascii).toContain('*');
    expect(ascii).toContain('+');
  });

  it('formatConstellation includes key markers and joke footer', () => {
    const out = formatConstellation(['Central', 'Roma Street']);
    expect(out).toContain('SUBWAY-CONSTELLATION');
    expect(out).toContain('SC-');
    expect(out).toContain('→ glyph:');
    expect(out).toContain('transfers (constellation lines):');
    expect(out).toContain('→ ascii:');
    expect(out).toContain('→ note:');
    expect(out).toMatch(/Joke chart only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(DEFAULT_STATIONS.length).toBeGreaterThan(0);
    expect(STAR_NAMES.length).toBeGreaterThan(0);
    expect(TRANSFER_LINES.length).toBeGreaterThan(0);
    expect(STAR_GLYPHS.length).toBeGreaterThan(0);
    expect(CHART_NOTES.length).toBeGreaterThan(0);
  });
});
