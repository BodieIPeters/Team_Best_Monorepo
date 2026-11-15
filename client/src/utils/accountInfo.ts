import { QUIZ_QUESTIONS, QuizAnswers } from "@/constants/quizQuestions";

// One row on the account page: what the detail is, and the student's value for it.
export interface AccountDetail {
  label: string;
  value: string;
}

// Shown for every preference when the student skipped the quiz.
export const NOT_SET = "Not set";

// Short names for each quiz question, used as row labels on the account page.
const PREFERENCE_LABELS: Record<keyof QuizAnswers, string> = {
  denomination: "Denomination",
  worshipStyle: "Worship style",
  maxDistance: "Distance from campus",
};

// Turns the student's quiz answers into readable rows for the account page.
// Takes the saved quiz answers, or null if the student skipped the quiz.
// Returns one row per quiz question, in quiz order, using the same wording the quiz showed.
export function describePreferences(answers: QuizAnswers | null): AccountDetail[] {
  return QUIZ_QUESTIONS.map((question) => {
    const label = PREFERENCE_LABELS[question.id];
    if (!answers) {
      return { label, value: NOT_SET };
    }
    const answer = answers[question.id];
    // Show the option's label ("Within 5 miles"), not its stored value ("5").
    // If the value no longer matches any option, show it as-is rather than hiding it.
    const option = question.options.find((choice) => choice.value === answer);
    return { label, value: option ? option.label : answer };
  });
}
