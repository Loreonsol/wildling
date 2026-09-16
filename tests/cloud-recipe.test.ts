import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'products', 'cloud-recipe', 'lib.mjs')).href;

const {
  sanitizeSky,
  pickCloud,
  isAfternoonIsh,
  bakeRecipe,
  bakeMany,
  formatCloudRecipe,
  CLOUDS,
  METHODS,
  FLAVORS,
  SERVINGS,
  RECIPE_NOTES,
} = await import(libUrl);

describe('cloud-recipe product', () => {
  it('sanitizeSky defaults empty / non-string to afternoon sky', () => {
    expect(sanitizeSky('')).toBe('afternoon sky');
    expect(sanitizeSky('   ')).toBe('afternoon sky');
    expect(sanitizeSky(null as unknown as string)).toBe('afternoon sky');
    expect(sanitizeSky(42 as unknown as string)).toBe('afternoon sky');
  });

  it('sanitizeSky normalizes whitespace and strips non-printable', () => {
    expect(sanitizeSky('  soft   cumulus  ')).toBe('soft cumulus');
    expect(sanitizeSky('sky\x00puff')).toBe('skypuff');
  });

  it('pickCloud honors cumulus / cirrus / storm / stratus hints', () => {
    expect(pickCloud('afternoon cumulus', 0)).toBe('cumulus puff');
    expect(pickCloud('wispy cirrus thread', 1)).toBe('cirrus thread');
    expect(pickCloud('thunder storm anvil', 2)).toBe('anvil thunderhead');
    expect(pickCloud('fog sheet stratus', 3)).toBe('stratus sheet');
    expect(CLOUDS).toContain(pickCloud('generic blue', 4));
  });

  it('isAfternoonIsh is false for morning / night cues', () => {
    expect(isAfternoonIsh('morning fog')).toBe(false);
    expect(isAfternoonIsh('dawn mist')).toBe(false);
    expect(isAfternoonIsh('midnight sheet')).toBe(false);
    expect(isAfternoonIsh('afternoon cumulus')).toBe(true);
    expect(isAfternoonIsh('quiet porch')).toBe(true);
  });

  it('bakeRecipe is stable for same sky + index', () => {
    const a = bakeRecipe('afternoon cumulus', 0);
    const b = bakeRecipe('afternoon cumulus', 0);
    expect(a).toEqual(b);
    expect(a.ready).toBe(true);
    expect(a.cloud).toBe('cumulus puff');
    expect(METHODS).toContain(a.method);
    expect(FLAVORS).toContain(a.flavor);
    expect(SERVINGS).toContain(a.serving);
    expect(RECIPE_NOTES).toContain(a.note);
    expect(a.recipeId).toMatch(/^CR-[0-9A-F]{4}$/);
  });

  it('bakeRecipe waits when sky is morning / night', () => {
    const morning = bakeRecipe('morning fog', 0);
    expect(morning.ready).toBe(false);
    expect(morning.method.toLowerCase()).toMatch(/wait|afternoon|peaks/);
    expect(morning.cloud).toBe('stratus sheet');
  });

  it('bakeRecipe differs across distinct inputs', () => {
    const a = bakeRecipe('alpha fluff', 0);
    const b = bakeRecipe('beta storm', 1);
    expect(
      a.cloud !== b.cloud ||
        a.recipeId !== b.recipeId ||
        a.method !== b.method ||
        a.flavor !== b.flavor ||
        a.serving !== b.serving ||
        a.note !== b.note ||
        a.ready !== b.ready,
    ).toBe(true);
  });

  it('bakeMany defaults empty list to afternoon sky', () => {
    const rows = bakeMany([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.sky).toBe('afternoon sky');
  });

  it('bakeMany preserves order for multiple skies', () => {
    const rows = bakeMany(['alpha', 'beta', 'gamma']);
    expect(rows.map((r) => r.sky)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('formatCloudRecipe includes key markers and joke footer', () => {
    const out = formatCloudRecipe(['afternoon cumulus', 'morning fog']);
    expect(out).toContain('CLOUD-RECIPE');
    expect(out).toContain('CR-');
    expect(out).toContain('→ method:');
    expect(out).toContain('→ flavor:');
    expect(out).toContain('→ note:');
    expect(out).toMatch(/Joke recipe only/);
    expect(out).toMatch(/never opens network/i);
  });

  it('banks are non-empty', () => {
    expect(CLOUDS.length).toBeGreaterThan(0);
    expect(METHODS.length).toBeGreaterThan(0);
    expect(FLAVORS.length).toBeGreaterThan(0);
    expect(SERVINGS.length).toBeGreaterThan(0);
    expect(RECIPE_NOTES.length).toBeGreaterThan(0);
  });
});
