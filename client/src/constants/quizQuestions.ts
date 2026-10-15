/**
 * Preference quiz content (SRS User Story 3).
 *
 * This file only holds DATA: the questions, their answer choices, and the
 * types that describe them. The quiz screen (components/PreferenceQuiz.tsx)
 * renders whatever is in QUIZ_QUESTIONS, so adding, removing, or rewording a
 * question here does not require touching any screen code.
 *
 * IMPORTANT: option `value`s for denomination and worship style must match the
 * strings used in constants/mockChurches.ts exactly (e.g. 'Christian Reformed'),
 * because utils/recommendChurches.ts compares them with ===. If a church's data
 * uses a new denomination or style, add a matching option here.
 */

/**
 * Sentinel value for "I don't care about this question".
 * A question answered with NO_PREFERENCE is ignored when recommending churches.
 */
export const NO_PREFERENCE = 'no-preference';

/**
 * One complete set of quiz answers. Every field is a string so all questions
 * can share the same radio-button UI; any field may be NO_PREFERENCE.
 */
export interface QuizAnswers {
  denomination: string;
  worshipStyle: string;
  /** Max miles from campus as a string: '3', '5' or '10'. */
  maxDistance: string;
}

/** One selectable answer: `label` is shown to the student, `value` is stored. */
export interface QuizOption {
  label: string;
  value: string;
}

/**
 * One quiz question. `id` must be a key of QuizAnswers so the selected
 * option's value is saved into the matching answer field.
 */
export interface QuizQuestion {
  id: keyof QuizAnswers;
  prompt: string;
  options: QuizOption[];
}

/** The questions, in the order they appear on screen (shown as Q1, Q2, Q3). */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'denomination',
    prompt: 'Which denomination are you looking for?',
    options: [
      { label: 'Catholic', value: 'Catholic' },
      { label: 'Christian Reformed', value: 'Christian Reformed' },
      { label: 'Congregational', value: 'Congregational' },
      { label: 'Nondenominational', value: 'Nondenominational' },
      { label: 'No preference', value: NO_PREFERENCE },
    ],
  },
  {
    id: 'worshipStyle',
    prompt: 'What worship style do you prefer?',
    options: [
      { label: 'Contemporary', value: 'Contemporary' },
      { label: 'Traditional', value: 'Traditional' },
      { label: 'Liturgical', value: 'Liturgical' },
      { label: 'Blended', value: 'Blended' },
      { label: 'No preference', value: NO_PREFERENCE },
    ],
  },
  {
    id: 'maxDistance',
    prompt: 'How far from campus are you willing to go?',
    // Values are miles; recommendChurches converts them with Number().
    options: [
      { label: 'Within 3 miles', value: '3' },
      { label: 'Within 5 miles', value: '5' },
      { label: 'Within 10 miles', value: '10' },
      { label: 'Distance doesn’t matter', value: NO_PREFERENCE },
    ],
  },
];
