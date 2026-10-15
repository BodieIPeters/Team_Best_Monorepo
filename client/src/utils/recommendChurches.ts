/**
 * Church recommendation logic (SRS User Stories 3 & 4).
 *
 * Kept free of React and network code so it can be unit tested directly and
 * later moved to the server without touching any screen.
 *
 * Design decisions:
 *   - We recommend, we don't rank: matches keep their original order and no
 *     scores are shown.
 *   - If no church meets every answer, we return the closest matches instead
 *     of an empty screen (see `exactMatch`).
 */
import { Church } from '@/constants/mockChurches';
import { NO_PREFERENCE, QuizAnswers } from '@/constants/quizQuestions';

/** What recommendChurches returns. */
export interface RecommendationResult {
  /** The churches to show, in their original order. May be empty. */
  churches: Church[];
  /**
   * true  -> every church returned meets ALL of the student's answers.
   * false -> nothing met every answer, so these are the closest matches
   *          (or the list is empty because nothing matched any answer).
   */
  exactMatch: boolean;
}

/** A yes/no check: does this church satisfy one quiz answer? */
type Criterion = (church: Church) => boolean;

/**
 * Turns quiz answers into a list of checks, one per answered question.
 * Questions answered "No preference" add no check, so they never exclude a church.
 */
const buildCriteria = (answers: QuizAnswers): Criterion[] => {
  const criteria: Criterion[] = [];

  if (answers.denomination !== NO_PREFERENCE) {
    criteria.push((church) => church.denomination === answers.denomination);
  }
  if (answers.worshipStyle !== NO_PREFERENCE) {
    criteria.push((church) => church.worshipStyle === answers.worshipStyle);
  }
  if (answers.maxDistance !== NO_PREFERENCE) {
    // Distance answers are stored as strings ('3', '5', '10'); compare as numbers.
    // "Within N miles" is inclusive, so a church exactly N miles away counts.
    const max = Number(answers.maxDistance);
    criteria.push((church) => church.distanceMiles <= max);
  }

  return criteria;
};

/**
 * Picks which churches to recommend for a set of quiz answers.
 *
 * @param churches All churches the student could be recommended.
 * @param answers  The student's completed quiz answers.
 * @returns The recommended churches (original order) and whether they are
 *          exact matches or closest matches.
 *
 * @example
 * recommendChurches(MOCK_CHURCHES, {
 *   denomination: 'Nondenominational',
 *   worshipStyle: 'Contemporary',
 *   maxDistance: '5',
 * });
 * // -> { churches: [Crossroads Bible Church], exactMatch: true }
 */
export const recommendChurches = (
  churches: Church[],
  answers: QuizAnswers
): RecommendationResult => {
  const criteria = buildCriteria(answers);

  // "No preference" on every question: every church fits.
  if (criteria.length === 0) {
    return { churches, exactMatch: true };
  }

  const scored = churches.map((church) => ({
    church,
    matched: criteria.filter((meets) => meets(church)).length,
  }));

  const exact = scored.filter((s) => s.matched === criteria.length);
  if (exact.length > 0) {
    return { churches: exact.map((s) => s.church), exactMatch: true };
  }

  // Fallback: the churches that fit the most answers.
  // The leading 0 keeps Math.max from returning -Infinity on an empty list.
  const best = Math.max(0, ...scored.map((s) => s.matched));
  if (best === 0) {
    return { churches: [], exactMatch: false };
  }
  return {
    churches: scored.filter((s) => s.matched === best).map((s) => s.church),
    exactMatch: false,
  };
};
