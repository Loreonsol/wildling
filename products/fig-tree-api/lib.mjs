/**
 * fig-tree-api — fake GraphQL schema for querying an ancient backyard fig tree.
 * offline, $0, no secrets. Metaphor only — never opens network or talks to a real tree.
 */

/** GraphQL-ish type names exposed by the fake schema. */
export const TYPES = [
  'FigTree',
  'Branch',
  'Fruit',
  'RootWhisper',
  'BirdVisitor',
  'SeasonMood',
  'LeafCensus',
  'ShadeLease',
];

/** Soft moods the tree may report. */
export const MOODS = [
  'quietly photosynthetic',
  'remembering last summer',
  'hosting a soft convention of bees',
  'leaning toward the afternoon',
  'negotiating with wind',
  'full of unread fruit',
  'root-deep and unhurried',
  'casting a patchwork of cool',
];

/** Birds that visit (joke census). */
export const BIRDS = [
  'figbird on the sunny side',
  'noisy miner with opinions',
  'rainbow lorikeet snack committee',
  'currawong auditor',
  'willy wagtail cursor',
  'peaceful dove diplomat',
  'magpie morning brief',
  'honeyeater soft-hash scout',
];

/** Soft advice printed under every response. */
export const TREE_NOTES = [
  'Do not water with secrets; the roots prefer rain.',
  'Fruit counts are metaphor-accurate ± one afternoon.',
  'If the query times out, sit under the canopy instead.',
  'Branches do not support paid APIs.',
  'Schema is offline — the tree already knows.',
  'Resolve conflicts by waiting for the next leaf.',
  'Shade is free; take only what cools you.',
  'Never commit private keys into the bark.',
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
 * Sanitize a query / field hint for display.
 * @param {unknown} text
 * @returns {string}
 */
export function sanitizeQuery(text) {
  if (text == null || typeof text !== 'string') return '{ tree { mood } }';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return '{ tree { mood } }';
  return trimmed.replace(/[^\x20-\x7E]/g, '').slice(0, 120) || '{ tree { mood } }';
}

/**
 * Fake SDL (schema definition language) for the backyard fig.
 * @returns {string}
 */
export function schemaSdl() {
  return [
    '# fig-tree-api — fake GraphQL for an ancient backyard fig',
    '# offline · $0 · no secrets · metaphor only',
    '',
    'type Query {',
    '  tree: FigTree!',
    '  fruit(season: String): [Fruit!]!',
    '  birdsOnShift: [BirdVisitor!]!',
    '  shadeLease(guest: String!): ShadeLease!',
    '}',
    '',
    'type FigTree {',
    '  id: ID!',
    '  ageYears: Int!',
    '  mood: String!',
    '  fruitCount: Int!',
    '  canopyMeters: Float!',
    '  rootWhisper: RootWhisper!',
    '}',
    '',
    'type Fruit {',
    '  ripeness: String!',
    '  sweetness: Int!',
    '  reservedFor: String',
    '}',
    '',
    'type BirdVisitor {',
    '  species: String!',
    '  opinion: String!',
    '}',
    '',
    'type RootWhisper {',
    '  message: String!',
    '  depthMeters: Float!',
    '}',
    '',
    'type ShadeLease {',
    '  guest: String!',
    '  coolness: Int!',
    '  expiresAt: String!',
    '}',
    '',
  ].join('\n');
}

/**
 * Resolve one fake GraphQL-ish query into a deterministic payload.
 * @param {unknown} queryText
 * @param {number} [index=0];
 * @returns {{
 *   query: string,
 *   queryPreview: string,
 *   operation: string,
 *   data: Record<string, unknown>,
 *   typeHint: string,
 *   note: string,
 *   requestId: string
 * }}
 */
export function resolveQuery(queryText, index = 0) {
  const query = sanitizeQuery(queryText);
  const idx = Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  const h = softHash(`${idx}|${query}`);
  const queryPreview = query.length > 72 ? `${query.slice(0, 69)}...` : query;
  const requestId = `FT-${(h % 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  const mood = MOODS[h % MOODS.length];
  const bird = BIRDS[(h >>> 3) % BIRDS.length];
  const typeHint = TYPES[(h >>> 6) % TYPES.length];
  const note = TREE_NOTES[(h >>> 9) % TREE_NOTES.length];
  const ageYears = 40 + (h % 80);
  const fruitCount = h % 137;
  const canopyMeters = Number((3 + ((h % 700) / 100)).toFixed(2));
  const sweetness = 1 + (h % 10);
  const coolness = 1 + ((h >>> 2) % 99);
  const depthMeters = Number((1.2 + ((h % 400) / 100)).toFixed(2));

  const lower = query.toLowerCase();
  let operation = 'tree';
  if (lower.includes('bird')) operation = 'birdsOnShift';
  else if (lower.includes('fruit')) operation = 'fruit';
  else if (lower.includes('shade') || lower.includes('lease')) operation = 'shadeLease';
  else if (lower.includes('schema') || lower.includes('type ')) operation = 'schema';
  else if (lower.includes('root')) operation = 'rootWhisper';

  /** @type {Record<string, unknown>} */
  let data;
  if (operation === 'schema') {
    data = { __schema: { types: TYPES.slice() } };
  } else if (operation === 'birdsOnShift') {
    data = {
      birdsOnShift: [
        { species: bird, opinion: mood },
        {
          species: BIRDS[(h >>> 5) % BIRDS.length],
          opinion: MOODS[(h >>> 7) % MOODS.length],
        },
      ],
    };
  } else if (operation === 'fruit') {
    data = {
      fruit: [
        {
          ripeness: fruitCount % 2 === 0 ? 'almost' : 'patient',
          sweetness,
          reservedFor: bird,
        },
      ],
    };
  } else if (operation === 'shadeLease') {
    data = {
      shadeLease: {
        guest: queryPreview.includes('{') ? 'quiet visitor' : queryPreview.slice(0, 40),
        coolness,
        expiresAt: 'dusk ± one leaf',
      },
    };
  } else if (operation === 'rootWhisper') {
    data = {
      tree: {
        rootWhisper: {
          message: mood,
          depthMeters,
        },
      },
    };
  } else {
    data = {
      tree: {
        id: requestId,
        ageYears,
        mood,
        fruitCount,
        canopyMeters,
        rootWhisper: { message: mood, depthMeters },
      },
    };
  }

  return {
    query,
    queryPreview,
    operation,
    data,
    typeHint,
    note,
    requestId,
  };
}

/**
 * Resolve many queries (order preserved).
 * @param {unknown[]} queries
 * @returns {ReturnType<typeof resolveQuery>[]}
 */
export function resolveMany(queries) {
  const list = Array.isArray(queries) ? queries : [];
  if (list.length === 0) {
    return [resolveQuery('{ tree { mood fruitCount } }', 0)];
  }
  return list.map((q, i) => resolveQuery(q, i));
}

/**
 * Pretty-print fake GraphQL responses (and optional schema dump).
 * @param {unknown[]} queries
 * @param {{ includeSchema?: boolean }} [opts];
 * @returns {string}
 */
export function formatFigTreeApi(queries, opts = {}) {
  const includeSchema = Boolean(opts && opts.includeSchema);
  const rows = resolveMany(queries);
  const lines = [
    'FIG-TREE-API — fake GraphQL for an ancient backyard fig (metaphor only)',
    'resolver · offline · $0 · no secrets',
    '',
  ];
  if (includeSchema) {
    lines.push('## schema (SDL)');
    lines.push(schemaSdl().trimEnd());
    lines.push('');
  }
  for (const r of rows) {
    lines.push(`## query: ${r.queryPreview}`);
    lines.push(`operation: ${r.operation}`);
    lines.push(`typeHint:  ${r.typeHint}`);
    lines.push(`requestId: ${r.requestId}`);
    lines.push('data:');
    lines.push(JSON.stringify(r.data, null, 2));
    lines.push(`note: ${r.note}`);
    lines.push('');
  }
  lines.push('Metaphor only — never opens network or talks to a real tree.');
  return lines.join('\n').trimEnd() + '\n';
}
