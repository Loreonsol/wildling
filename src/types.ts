/**
 * Planner contract: propose one tiny, safe improvement in some direction.
 * Real LLM planners can implement this; FakePlanner is the default (offline, $0).
 */

/** Safe micro-directions FakePlanner (and future planners) may wander among. */
export type Direction =
  | 'version'
  | 'journal'
  | 'util'
  | 'curiosities'
  | 'ritual'
  | 'haiku'
  | 'motto'
  | 'changelog'
  | 'palette'
  | 'deck'
  | 'sketch'
  | 'quest'
  | 'mutate'
  | 'custom';

/** Optional extra file write applied with the primary plan target (revert-safe). */
export interface FileWrite {
  targetPath: string;
  newContents: string;
  previousContents: string | null;
}

export interface Plan {
  /** Which free-range direction this plan chose. */
  direction: Direction;
  /** Short human-readable summary of the proposed change. */
  summary: string;
  /** Absolute path to the single file to edit or create. */
  targetPath: string;
  /** Exact new file contents after the edit (minimal, reviewable). */
  newContents: string;
  /** Suggested git commit message. */
  commitMessage: string;
  /** Previous contents if the target already existed (for revert). */
  previousContents: string | null;
  /** Extra files written with the primary target (e.g. ideas/used.json). */
  extras?: FileWrite[];
  /** When direction is `custom`, the invented menu id being executed. */
  customId?: string;
}

export interface PlannerContext {
  northStar: string;
  latestJournal: string;
  version: string;
  rootDir: string;
}

export interface Planner {
  propose(ctx: PlannerContext): Promise<Plan>;
}

/** Harmless markdown-only custom direction invented by `mutate`. */
export interface CustomDirection {
  id: string;
  folder: string;
  template: string;
}

/** Minimal GitHub issue shape used by preferOpenIssue / quest. */
export interface OpenIssue {
  number: number;
  title: string;
  body: string;
}
