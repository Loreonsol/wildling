/**
 * subway-constellation — Connect train stations into a constellation chart of transfers.
 * offline, $0, no secrets. Metaphor / joke only — never opens network or books real fares.
 */

/** Default Brisbane-ish stations when argv is empty. */
export const DEFAULT_STATIONS = [
  'Central',
  'Roma Street',
  'South Bank',
  'Park Road',
];

/** Constellation star names assigned to stations. */
export const STAR_NAMES = [
  'Transferia Major',
  'Platformis',
  'Railuxe',
  'Timetable Minor',
  'Carriagea',
  'Signalux',
  'Ticketis',
  'Whistleborne',
  'Oysterra',
  'Metroline',
  'Platform Seven',
  'Ghost Platform',
];

/** Named transfer edges (constellation lines). */
export const TRANSFER_LINES = [
  'the Amber Transfer Arc',
  'Midnight Platform Chord',
  'Peak-Hour Spiral',
  'Quiet Carriage Filament',
  'Cross-Platform Meridian',
  'Late-Train Zigzag',
  'Gate-Change Ribbon',
  'Escalator Elbow',
  'Underpass Umbra',
  'Timetable Tangent',
  'Soft Whistle Vector',
  'Spare-Seat Diagonal',
];

/** Star glyphs for the ASCII chart. */
export const STAR_GLYPHS = ['*', '+', 'o', '.', 'x', '@', '#', '~'];

/** Soft notes printed under every chart. */
export const CHART_NOTES = [
  'Joke chart only — never opens network or books real fares.',
  'Offline, $0, no secrets — leave Opal cards in your pocket.',
  'Blank stations default to a soft platform murmur.',
  'If tests fail, rewind to the previous transfer hop.',
  'Metaphor constellation only — no paid APIs, no real rail ops.',
  'Transfers hold better when the stars are kind.',
  'Stations soften every wrong platform into a scenic hop.',
  'Exit when the whistle stops pretending to be Orion.',
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
 * Sanitize a station name for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeStation(text) {
  if (text == null || typeof text !== 'string') return 'platform murmur';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'platform murmur';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'platform murmur';
}

/**
 * Infer a constellation star name from a station (deterministic).
 * central / city → Transferia Major; roma / street → Platformis;
 * south / bank → Railuxe; park / road → Timetable Minor;
 * ferry / riverside → Carriagea; airport / domestic → Signalux;
 * ticket / gate → Ticketis; whistle / horn → Whistleborne;
 * oyster / card → Oysterra; metro / subway → Metroline;
 * seven / platform 7 → Platform Seven; ghost / unused → Ghost Platform;
 * else bank.
 * @param {string} station
 * @param {number} h
 * @returns {string}
 */
export function pickStar(station, h) {
  const lower = station.toLowerCase();
  if (lower.includes('central') || lower.includes('city')) {
    return 'Transferia Major';
  }
  if (lower.includes('roma') || lower.includes('street')) {
    return 'Platformis';
  }
  if (lower.includes('south') || lower.includes('bank')) {
    return 'Railuxe';
  }
  if (lower.includes('park') || lower.includes('road')) {
    return 'Timetable Minor';
  }
  if (lower.includes('ferry') || lower.includes('riverside')) {
    return 'Carriagea';
  }
  if (lower.includes('airport') || lower.includes('domestic')) {
    return 'Signalux';
  }
  if (lower.includes('ticket') || lower.includes('gate')) {
    return 'Ticketis';
  }
  if (lower.includes('whistle') || lower.includes('horn')) {
    return 'Whistleborne';
  }
  if (lower.includes('oyster') || lower.includes('card')) {
    return 'Oysterra';
  }
  if (lower.includes('metro') || lower.includes('subway')) {
    return 'Metroline';
  }
  if (lower.includes('seven') || lower.includes('platform 7')) {
    return 'Platform Seven';
  }
  if (lower.includes('ghost') || lower.includes('unused')) {
    return 'Ghost Platform';
  }
  return STAR_NAMES[h % STAR_NAMES.length];
}

/**
 * Infer a transfer line name from a hop (deterministic).
 * amber / peak → Amber; midnight / night → Midnight;
 * quiet / carriage → Quiet Carriage; cross+platform → Cross-Platform;
 * late / train → Late-Train; gate / change → Gate-Change;
 * escalator / elbow → Escalator; under / pass → Underpass;
 * timetable / tangent → Timetable; whistle / soft → Soft Whistle;
 * spare / seat → Spare-Seat; spiral → Peak-Hour Spiral; else bank.
 * @param {string} from
 * @param {string} to
 * @param {number} h
 * @returns {string}
 */
export function pickTransferLine(from, to, h) {
  const lower = `${from} ${to}`.toLowerCase();
  if (lower.includes('amber') || (lower.includes('peak') && !lower.includes('spiral'))) {
    return 'the Amber Transfer Arc';
  }
  if (lower.includes('midnight') || lower.includes('night')) {
    return 'Midnight Platform Chord';
  }
  if (lower.includes('spiral') || lower.includes('peak-hour')) {
    return 'Peak-Hour Spiral';
  }
  if (lower.includes('quiet') || lower.includes('carriage')) {
    return 'Quiet Carriage Filament';
  }
  if (lower.includes('cross') || (lower.includes('platform') && lower.includes('change'))) {
    return 'Cross-Platform Meridian';
  }
  if (lower.includes('late') || lower.includes('train')) {
    return 'Late-Train Zigzag';
  }
  if (lower.includes('gate') || lower.includes('change')) {
    return 'Gate-Change Ribbon';
  }
  if (lower.includes('escalator') || lower.includes('elbow')) {
    return 'Escalator Elbow';
  }
  if (lower.includes('under') || lower.includes('pass') || lower.includes('umbra')) {
    return 'Underpass Umbra';
  }
  if (lower.includes('timetable') || lower.includes('tangent')) {
    return 'Timetable Tangent';
  }
  if (lower.includes('whistle') || lower.includes('soft')) {
    return 'Soft Whistle Vector';
  }
  if (lower.includes('spare') || lower.includes('seat') || lower.includes('diagonal')) {
    return 'Spare-Seat Diagonal';
  }
  return TRANSFER_LINES[h % TRANSFER_LINES.length];
}

/**
 * Pick a star glyph from seed bits.
 * @param {number} h
 * @returns {string}
 */
export function pickGlyph(h) {
  return STAR_GLYPHS[h % STAR_GLYPHS.length];
}

/**
 * Place stations as stars on a small ASCII field; draw transfer hops as lines.
 * @param {{ label: string, glyph: string, x: number, y: number }[]} stars
 * @param {{ fromIdx: number, toIdx: number }[]} edges
 * @returns {string}
 */
export function buildAsciiChart(stars, edges) {
  const width = 28;
  const height = 9;
  /** @type {string[][]} */
  const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => ' '));

  const setCell = (x, y, ch) => {
    if (y < 0 || y >= height || x < 0 || x >= width) return;
    const cur = grid[y][x];
    if (cur === ' ' || cur === '.' || cur === '-' || cur === '|' || cur === '/' || cur === '\\') {
      grid[y][x] = ch;
    }
  };

  for (const e of edges) {
    const a = stars[e.fromIdx];
    const b = stars[e.toIdx];
    if (!a || !b) continue;
    const steps = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y), 1);
    for (let s = 1; s < steps; s++) {
      const x = Math.round(a.x + ((b.x - a.x) * s) / steps);
      const y = Math.round(a.y + ((b.y - a.y) * s) / steps);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      let ch = '.';
      if (Math.abs(dx) >= Math.abs(dy) * 2) ch = '-';
      else if (Math.abs(dy) >= Math.abs(dx) * 2) ch = '|';
      else if ((dx > 0 && dy > 0) || (dx < 0 && dy < 0)) ch = '\\';
      else ch = '/';
      setCell(x, y, ch);
    }
  }

  for (const star of stars) {
    setCell(star.x, star.y, star.glyph);
  }

  const border = '+' + '-'.repeat(width) + '+';
  const rows = [border];
  for (let y = 0; y < height; y++) {
    rows.push('|' + grid[y].join('') + '|');
  }
  rows.push(border);
  return rows.join('\n');
}

/**
 * Build one constellation star from a station name.
 * @param {unknown} stationText
 * @param {number} [index=0]
 * @returns {{
 *   station: string,
 *   stationPreview: string,
 *   star: string,
 *   glyph: string,
 *   x: number,
 *   y: number,
 *   starId: string
 * }}
 */
export function chartStation(stationText, index = 0) {
  const station = sanitizeStation(stationText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${station}`);
  const stationPreview = station.length > 56 ? `${station.slice(0, 53)}...` : station;
  const starId = `SC-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const star = pickStar(station, h);
  const glyph = pickGlyph(h);
  const x = 2 + (h % 24);
  const y = 1 + ((h >>> 8) % 7);

  return {
    station,
    stationPreview,
    star,
    glyph,
    x,
    y,
    starId,
  };
}

/**
 * Build a full constellation chart of transfers from station names.
 * @param {unknown[]} stations
 * @returns {{
 *   stations: ReturnType<typeof chartStation>[],
 *   transfers: { from: string, to: string, fromStar: string, toStar: string, line: string, hops: number }[],
 *   ascii: string,
 *   chartId: string,
 *   note: string
 * }}
 */
export function buildChart(stations) {
  const raw = Array.isArray(stations) ? stations : [];
  const list = raw.length === 0 ? [...DEFAULT_STATIONS] : raw;
  const plotted = list.map((s, i) => chartStation(s, i));

  for (let i = 0; i < plotted.length; i++) {
    for (let j = 0; j < i; j++) {
      if (plotted[i].x === plotted[j].x && plotted[i].y === plotted[j].y) {
        plotted[i].x = (plotted[i].x + 3 + i) % 24 + 2;
        plotted[i].y = (plotted[i].y + 1 + i) % 7 + 1;
      }
    }
  }

  /** @type {{ from: string, to: string, fromStar: string, toStar: string, line: string, hops: number }[]} */
  const transfers = [];
  for (let i = 0; i < plotted.length - 1; i++) {
    const a = plotted[i];
    const b = plotted[i + 1];
    const h = softHash(`${i}|${a.station}|${b.station}`);
    transfers.push({
      from: a.station,
      to: b.station,
      fromStar: a.star,
      toStar: b.star,
      line: pickTransferLine(a.station, b.station, h),
      hops: 1 + (h % 3),
    });
  }

  const edges = transfers.map((_, i) => ({ fromIdx: i, toIdx: i + 1 }));
  const ascii = buildAsciiChart(
    plotted.map((p) => ({ label: p.star, glyph: p.glyph, x: p.x, y: p.y })),
    edges,
  );

  const seed = plotted.map((p) => p.station).join('|');
  const chartHash = softHash(seed);
  const chartId = `SC-${(chartHash % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const note = CHART_NOTES[(chartHash >>> 4) % CHART_NOTES.length];

  return {
    stations: plotted,
    transfers,
    ascii,
    chartId,
    note,
  };
}

/**
 * Pretty-print a constellation chart of transfers.
 * @param {unknown[]} stations
 * @returns {string}
 */
export function formatConstellation(stations) {
  const chart = buildChart(stations);
  const lines = [
    'SUBWAY-CONSTELLATION — train stations as stars, transfers as lines (metaphor / joke only)',
    'chart · offline · $0 · no secrets',
    '',
    `chartId  ${chart.chartId}`,
    '',
    'starId  star                    station',
    '------  ----------------------  -------',
  ];
  for (const s of chart.stations) {
    const star = s.star.padEnd(22).slice(0, 22);
    lines.push(`${s.starId}  ${star}  ${s.stationPreview}`);
    lines.push(`  → glyph: ${s.glyph}  @ (${s.x},${s.y})`);
  }
  lines.push('');
  if (chart.transfers.length === 0) {
    lines.push('transfers: (lone star — add another station for a hop)');
  } else {
    lines.push('transfers (constellation lines):');
    for (const t of chart.transfers) {
      lines.push(`  ${t.fromStar} ──${t.line}──▶ ${t.toStar}  (${t.hops} hop${t.hops === 1 ? '' : 's'})`);
      lines.push(`    ${t.from} → ${t.to}`);
    }
  }
  lines.push('');
  lines.push('  → ascii:');
  for (const row of chart.ascii.split('\n')) {
    lines.push(`       ${row}`);
  }
  lines.push('');
  lines.push(`  → note: ${chart.note}`);
  lines.push('');
  lines.push('Joke chart only — never opens network or books real fares.');
  return lines.join('\n').trimEnd() + '\n';
}
