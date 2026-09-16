import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'fig-tree-api', 'lib.mjs')).href;

const {
  sanitizeQuery,
  resolveQuery,
  resolveMany,
  formatFigTreeApi,
  schemaSdl,
  TYPES,
  MOODS,
  BIRDS,
  TREE_NOTES,
} = await import(libUrl);

describe('fig-tree-api product', () => {
  it('sanitizeQuery defaults empty / non-string', () => {
    expect(sanitizeQuery('')).toBe('{ tree { mood } }');
    expect(sanitizeQuery('   ')).toBe('{ tree { mood } }');
    expect(sanitizeQuery(null as unknown as string)).toBe('{ tree { mood } }');
    expect(sanitizeQuery(42 as unknown as string)).toBe('{ tree { mood } }');
  });

  it('sanitizeQuery normalizes whitespace', () => {
    expect(sanitizeQuery('  { tree { mood } }  ')).toBe('{ tree { mood } }');
  });

  it('resolveQuery is stable for same query + index', () => {
    const a = resolveQuery('{ tree { mood } }', 0);
    const b = resolveQuery('{ tree { mood } }', 0);
    expect(a).toEqual(b);
    expect(TYPES).toContain(a.typeHint);
    expect(TREE_NOTES).toContain(a.note);
    expect(a.requestId).toMatch(/^FT-[0-9A-F]{4}$/);
    expect(a.operation).toBe('tree');
    expect(a.data).toHaveProperty('tree');
  });

  it('resolveQuery picks fruit / birds / shade operations from hints', () => {
    expect(resolveQuery('fruit season', 0).operation).toBe('fruit');
    expect(resolveQuery('birds on shift', 1).operation).toBe('birdsOnShift');
    expect(resolveQuery('shade lease please', 2).operation).toBe('shadeLease');
    expect(resolveQuery('--schema dump', 3).operation).toBe('schema');
  });

  it('resolveQuery differs across distinct inputs', () => {
    const a = resolveQuery('{ tree { mood } }', 0);
    const b = resolveQuery('fruit', 1);
    expect(
      a.operation !== b.operation ||
        a.requestId !== b.requestId ||
        a.typeHint !== b.typeHint ||
        a.note !== b.note,
    ).toBe(true);
  });

  it('resolveMany defaults empty list to a tree mood query', () => {
    const rows = resolveMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.query).toContain('tree');
  });

  it('resolveMany preserves order for multiple queries', () => {
    const rows = resolveMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.query)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('schemaSdl includes core types', () => {
    const sdl = schemaSdl();
    expect(sdl).toContain('type Query');
    expect(sdl).toContain('type FigTree');
    expect(sdl).toContain('type Fruit');
  });

  it('formatFigTreeApi includes key markers and metaphor footer', () => {
    const out = formatFigTreeApi(['{ tree { mood } }', 'fruit'], { includeSchema: true });
    expect(out).toContain('FIG-TREE-API');
    expect(out).toContain('## schema (SDL)');
    expect(out).toContain('type FigTree');
    expect(out).toContain('fruit');
    expect(out).toContain('requestId:');
    expect(out).toContain('FT-');
    expect(out).toMatch(/Metaphor only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('mood and bird banks are non-empty', () => {
    expect(MOODS.length).toBeGreaterThan(0);
    expect(BIRDS.length).toBeGreaterThan(0);
  });
});
