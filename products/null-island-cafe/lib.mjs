/**
 * null-island-cafe — menu for a cafe at Null Island that serves coordinates as coffee.
 * offline, $0, no secrets. Metaphor only — never opens network or geocodes the real world.
 */

/** Coordinate blends (espresso metaphors). */
export const BLENDS = [
  '0°0′ flat white',
  'meridian macchiato',
  'prime-meridian pour-over',
  'equator espresso',
  'antipode affogato',
  'longitude latte',
  'grid-north cortado',
  'datum-shift dirty chai',
];

/** Pastries / sides. */
export const PASTRIES = [
  'bearing croissant (buttery ±0.001°)',
  'WGS84 scone with jam of both hemispheres',
  'rhumb-line danish',
  'geodesic muffin',
  'null-island biscotti (points nowhere)',
  'tide-table tart',
  'charted banana bread',
  'soft-hash shortbread',
];

/** Baristas on shift. */
export const BARISTAS = [
  'Cartographa',
  'Meridio',
  'Equatoria',
  'Datum',
  'Rhumb',
  'Azimuth',
  'Loxodrome',
  'Nulla',
];

/** Soft advice printed on the receipt. */
export const RECEIPT_NOTES = [
  'Tip the equator; it holds the whole menu up.',
  'If your cup drifts west, stir clockwise once.',
  'Coordinates are served hot — cool before plotting.',
  'Zero, zero is not empty; it is the house blend.',
  'Leave the saucer for the next lost sailor.',
  'No Wi-Fi: the cafe is already at every origin.',
  'Ask for foam art shaped like a tiny compass rose.',
  'Refunds paid only in unused lat/lon pairs.',
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
 * Sanitize a guest / place / order hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeGuest(text) {
  if (text == null || typeof text !== 'string') return 'anonymous sailor';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'anonymous sailor';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 80) || 'anonymous sailor';
}

/**
 * Parse optional "lat,lon" pair from a string; otherwise invent soft coords from hash.
 * @param {string} guest
 * @returns {{ lat: number, lon: number, invented: boolean }}
 */
export function resolveCoords(guest) {
  const m = guest.match(
    /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/,
  );
  if (m) {
    let lat = Number(m[1]);
    let lon = Number(m[2]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      const seed = softHash(guest);
      return {
        lat: Number((((seed % 18001) / 100) - 90).toFixed(2)),
        lon: Number(((((seed >>> 8) % 36001) / 100) - 180).toFixed(2)),
        invented: true,
      };
    }
    lat = Math.max(-90, Math.min(90, lat));
    lon = Math.max(-180, Math.min(180, lon));
    return {
      lat: Number(lat.toFixed(4)),
      lon: Number(lon.toFixed(4)),
      invented: false,
    };
  }
  const seed = softHash(guest);
  return {
    lat: Number((((seed % 18001) / 100) - 90).toFixed(2)),
    lon: Number(((((seed >>> 8) % 36001) / 100) - 180).toFixed(2)),
    invented: true,
  };
}

/**
 * Brew one deterministic cafe order for a guest.
 * @param {unknown} guestText
 * @param {number} [index]
 * @returns {{ guest: string, lat: number, lon: number, invented: boolean, blend: string, pastry: string, barista: string, note: string, ticketId: string, steamPsi: number }}
 */
export function brewOrder(guestText, index = 0) {
  const guest = sanitizeGuest(guestText);
  const coords = resolveCoords(guest);
  const seed = softHash(`${guest}|${coords.lat}|${coords.lon}|${index}`);
  const blend = BLENDS[seed % BLENDS.length];
  const pastry = PASTRIES[(seed >>> 3) % PASTRIES.length];
  const barista = BARISTAS[(seed >>> 6) % BARISTAS.length];
  const note = RECEIPT_NOTES[(seed >>> 9) % RECEIPT_NOTES.length];
  const steamPsi = 8 + (seed % 13); // 8–20 metaphor
  const ticketId = `NIL-${(seed % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  return {
    guest,
    lat: coords.lat,
    lon: coords.lon,
    invented: coords.invented,
    blend,
    pastry,
    barista,
    note,
    ticketId,
    steamPsi,
  };
}

/**
 * Brew many orders (one per guest string).
 * @param {unknown[]} guests
 * @returns {ReturnType<typeof brewOrder>[]}
 */
export function brewMany(guests) {
  const list = Array.isArray(guests) ? guests : [];
  if (list.length === 0) return [brewOrder('', 0)];
  return list.map((g, i) => brewOrder(g, i));
}

/**
 * Pretty-print one or more cafe tickets.
 * @param {unknown[]} guests
 * @returns {string}
 */
export function formatCafeMenu(guests) {
  const orders = brewMany(guests);
  const lines = [
    'null-island-cafe — coordinates served as coffee (metaphor only)',
    'location: 0°N 0°E · open whenever you are lost',
    '',
  ];
  for (const o of orders) {
    const coordLabel = o.invented
      ? `invented ${o.lat}, ${o.lon}`
      : `plotted ${o.lat}, ${o.lon}`;
    lines.push(`## guest: ${o.guest}`);
    lines.push(`coords:   ${coordLabel}`);
    lines.push(`blend:    ${o.blend}`);
    lines.push(`pastry:   ${o.pastry}`);
    lines.push(`barista:  ${o.barista}`);
    lines.push(`steam:    ${o.steamPsi} psi (metaphor)`);
    lines.push(`ticket:   ${o.ticketId}`);
    lines.push(`note:     ${o.note}`);
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}
