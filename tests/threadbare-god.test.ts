import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'threadbare-god', 'lib.mjs')).href;

const {
  sanitizeOffering,
  pickGod,
  pickTarget,
  pickTool,
  mendOffering,
  mendMany,
  formatMendReport,
  GODS,
  TARGETS,
  TOOLS,
  BLESSINGS,
} = await import(libUrl);

describe('threadbare-god product', () => {
  it('sanitizeOffering defaults empty / non-string to threadbare murmur', () => {
    expect(sanitizeOffering('')).toBe('threadbare murmur');
    expect(sanitizeOffering('   ')).toBe('threadbare murmur');
    expect(sanitizeOffering(null as unknown as string)).toBe('threadbare murmur');
    expect(sanitizeOffering(42 as unknown as string)).toBe('threadbare murmur');
  });

  it('sanitizeOffering normalizes whitespace and strips non-printable', () => {
    expect(sanitizeOffering('  worn   heel  ')).toBe('worn heel');
    expect(sanitizeOffering('flake\x00ci')).toBe('flakeci');
  });

  it('pickGod honors heel / flake / darn / soft / lint / retry / sole / green / wool / timeout / toe / snap', () => {
    expect(pickGod('heel sock stitch worn', 0)).toBe('Heel-stitch patron');
    expect(pickGod('flake ci mend suite', 1)).toBe('Flake-mender of CI');
    expect(pickGod('darn needle saint', 2)).toBe('Darning needle saint');
    expect(pickGod('soft assert deity', 3)).toBe('Soft-assert deity');
    expect(pickGod('lint thread guard', 4)).toBe('Lint-thread guardian');
    expect(pickGod('retry loop oracle', 5)).toBe('Retry-loop oracle');
    expect(pickGod('sole patch house', 6)).toBe('Sole-patch household god');
    expect(pickGod('green bar mendicant', 7)).toBe('Green-bar mendicant');
    expect(pickGod('wool whisper spirit', 8)).toBe('Wool-whisper spirit');
    expect(pickGod('timeout temper muse', 9)).toBe('Timeout-tempering muse');
    expect(pickGod('toe seam keep', 10)).toBe('Toe-seam keeper');
    expect(pickGod('snap heal nymph', 11)).toBe('Snapshot-heal nymph');
    expect(GODS).toContain(pickGod('generic murmur', 12));
  });

  it('pickTarget honors heel / flaky / elastic / race / toe / timing / laundry / webhook / ankle / order / ladder / clock', () => {
    expect(pickTarget('worn heel sock', 0)).toBe('worn sock heel');
    expect(pickTarget('flaky integration test', 1)).toBe('flaky integration test');
    expect(pickTarget('elastic cuff stretch', 2)).toBe('stretched elastic cuff');
    expect(pickTarget('race snapshot assert', 3)).toBe('racey snapshot assert');
    expect(pickTarget('thinning toe seam', 4)).toBe('thinning toe seam');
    expect(pickTarget('timing e2e suite', 5)).toBe('timing-sensitive e2e');
    expect(pickTarget('laundry label fray', 6)).toBe('frayed laundry label');
    expect(pickTarget('webhook intermittent stub', 7)).toBe('intermittent webhook stub');
    expect(pickTarget('ankle hole left', 8)).toBe('holey left ankle');
    expect(pickTarget('order suite depend', 9)).toBe('order-dependent suite');
    expect(pickTarget('ladder knit wear', 10)).toBe('laddered knit');
    expect(pickTarget('clock mock flake', 11)).toBe('flaky clock mock');
    expect(TARGETS).toContain(pickTarget('generic target', 12));
  });

  it('pickTool honors darn / soft / wool / seed / needle / fixture / pad / sleep / thimble / stub / reinforce / isolate', () => {
    expect(pickTool('darn mushroom patience', 0)).toBe('darning mushroom + patience');
    expect(pickTool('soft retry hug', 1)).toBe('soft retry with a hug');
    expect(pickTool('wool yarn drawer', 2)).toBe('wool yarn from a quiet drawer');
    expect(pickTool('seed rng breath', 3)).toBe('seeded RNG and a deep breath');
    expect(pickTool('needle lint kindness', 4)).toBe('needle threaded with lint kindness');
    expect(pickTool('fixture freeze tea', 5)).toBe('fixture freeze + tea');
    expect(pickTool('heel pad hope', 6)).toBe('heel pad of leftover hope');
    expect(pickTool('sleep joke determ', 7)).toBe('deterministic sleep joke');
    expect(pickTool('thimble green light', 8)).toBe('thimble of green-bar light');
    expect(pickTool('stub clock lullaby', 9)).toBe('stubbed clock and a lullaby');
    expect(pickTool('reinforce mercy stitch', 10)).toBe('reinforcing stitch of mercy');
    expect(pickTool('isolate name ritual', 11)).toBe('isolate-and-name ritual');
    expect(TOOLS).toContain(pickTool('generic tool', 12));
  });

  it('mendOffering is stable for same offering + index', () => {
    const a = mendOffering('worn heel sock', 0);
    const b = mendOffering('worn heel sock', 0);
    expect(a).toEqual(b);
    expect(a.god).toBe('Heel-stitch patron');
    expect(a.target).toBe('worn sock heel');
    expect(TOOLS).toContain(a.tool);
    expect(BLESSINGS).toContain(a.blessing);
    expect(a.mendId).toMatch(/^TG-[0-9A-F]{4}$/);
  });

  it('mendOffering differs across distinct inputs', () => {
    const a = mendOffering('alpha worn heel', 0);
    const b = mendOffering('beta flaky ci', 1);
    expect(
      a.god !== b.god ||
        a.mendId !== b.mendId ||
        a.target !== b.target ||
        a.tool !== b.tool ||
        a.blessing !== b.blessing,
    ).toBe(true);
  });

  it('mendMany defaults empty list to threadbare murmur', () => {
    const rows = mendMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.offering).toBe('threadbare murmur');
  });

  it('mendMany preserves order for multiple offerings', () => {
    const rows = mendMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.offering)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatMendReport includes key markers and joke footer', () => {
    const out = formatMendReport(['worn heel', 'flaky CI']);
    expect(out).toContain('THREADBARE-GOD');
    expect(out).toContain('TG-');
    expect(out).toContain('→ target:');
    expect(out).toContain('→ tool:');
    expect(out).toContain('→ god:');
    expect(out).toContain('→ blessing:');
    expect(out).toMatch(/Joke mend only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(GODS.length).toBeGreaterThan(0);
    expect(TARGETS.length).toBeGreaterThan(0);
    expect(TOOLS.length).toBeGreaterThan(0);
    expect(BLESSINGS.length).toBeGreaterThan(0);
  });
});
