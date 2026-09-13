/**
 * Planner contract: propose one tiny, safe improvement in some direction.
 * Real LLM planners can implement this; FakePlanner is the default (offline, $0).
 */

/** Safe micro-directions FakePlanner (and future planners) may wander among. */
export type Direction = 'version' | 'journal' | 'util' | 'curiosities';

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
