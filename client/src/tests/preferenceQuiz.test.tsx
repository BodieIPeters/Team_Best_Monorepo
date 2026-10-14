/**
 * Screen-level tests for the preference quiz flow (SRS User Stories 3 & 4).
 *
 * These render the real HomeScreen and press buttons the way a student would,
 * checking navigation: sign in -> quiz -> results -> directory, plus Skip.
 * Buttons and options are found by testID (e.g. `option-maxDistance-5`,
 * `btn-submit-quiz`), which are set in components/PreferenceQuiz.tsx and
 * components/QuizResults.tsx.
 */
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../app/index';

/** Renders the app and signs in, which lands on the quiz. Returns the render helpers. */
const signIn = () => {
  const utils = render(<HomeScreen />);
  fireEvent.changeText(utils.getByPlaceholderText('Username'), 'QuizUser');
  fireEvent.press(utils.getByTestId('btn-auth'));
  return utils;
};

type Utils = ReturnType<typeof signIn>;

/** Picks one option per question. Pass option values, e.g. 'Catholic', '5', 'no-preference'. */
const answerQuiz = (
  { getByTestId }: Utils,
  denomination: string,
  worshipStyle: string,
  maxDistance: string
) => {
  fireEvent.press(getByTestId(`option-denomination-${denomination}`));
  fireEvent.press(getByTestId(`option-worshipStyle-${worshipStyle}`));
  fireEvent.press(getByTestId(`option-maxDistance-${maxDistance}`));
};

describe('Preference quiz flow (User Stories 3 & 4)', () => {
  test('shows the quiz right after sign-in', () => {
    const { getByText, getByTestId } = signIn();
    expect(getByText('Church Quiz')).toBeTruthy();
    expect(getByText(/Which denomination/)).toBeTruthy();
    expect(getByTestId('btn-submit-quiz')).toBeTruthy();
  });

  test('Submit stays disabled until every question is answered', () => {
    const utils = signIn();
    const { getByTestId, queryByText } = utils;

    fireEvent.press(getByTestId('option-denomination-Catholic'));
    fireEvent.press(getByTestId('option-worshipStyle-Liturgical'));
    fireEvent.press(getByTestId('btn-submit-quiz'));
    expect(queryByText('Your Recommendations')).toBeNull();

    fireEvent.press(getByTestId('option-maxDistance-3'));
    fireEvent.press(getByTestId('btn-submit-quiz'));
    expect(queryByText('Your Recommendations')).toBeTruthy();
  });

  test('selecting an option marks it checked', () => {
    const { getByTestId } = signIn();
    const option = getByTestId('option-worshipStyle-Blended');
    expect(option.props.accessibilityState).toEqual({ checked: false });
    fireEvent.press(option);
    expect(getByTestId('option-worshipStyle-Blended').props.accessibilityState).toEqual({
      checked: true,
    });
  });

  test('submitting shows only the recommended churches', () => {
    const utils = signIn();
    answerQuiz(utils, 'Nondenominational', 'Contemporary', '5');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));

    expect(utils.getByText('Your Recommendations')).toBeTruthy();
    expect(utils.getByText('These churches fit everything you told us.')).toBeTruthy();
    expect(utils.getByText('Crossroads Bible Church')).toBeTruthy();
    expect(utils.queryByText('Cathedral of St. Andrew')).toBeNull();
    expect(utils.queryByText('Ada Bible Church (East Paris)')).toBeNull();
  });

  test('explains when it is showing closest matches instead', () => {
    const utils = signIn();
    answerQuiz(utils, 'Catholic', 'Contemporary', 'no-preference');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));

    expect(utils.getByText(/closest matches/)).toBeTruthy();
    expect(utils.getByText('Cathedral of St. Andrew')).toBeTruthy();
  });

  test('Return Home goes to the full directory', () => {
    const utils = signIn();
    answerQuiz(utils, 'Nondenominational', 'Contemporary', '5');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));
    fireEvent.press(utils.getByTestId('btn-return-home'));

    expect(utils.getByPlaceholderText('Search by church name or ZIP code...')).toBeTruthy();
    expect(utils.getByText('Cathedral of St. Andrew')).toBeTruthy();
  });

  test('Skip for now goes straight to the directory', () => {
    const { getByTestId, getByPlaceholderText, queryByText } = signIn();
    fireEvent.press(getByTestId('btn-skip-quiz'));

    expect(getByPlaceholderText('Search by church name or ZIP code...')).toBeTruthy();
    expect(queryByText('Church Quiz')).toBeNull();
  });

  test('saving a church from the results carries over to the directory', () => {
    const utils = signIn();
    answerQuiz(utils, 'Nondenominational', 'Contemporary', '5');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));
    fireEvent.press(utils.getByTestId('favorite-button-2'));
    fireEvent.press(utils.getByTestId('btn-return-home'));
    fireEvent.press(utils.getByTestId('btn-toggle-favorites'));

    expect(utils.getByText('Crossroads Bible Church')).toBeTruthy();
    expect(utils.queryByText('Cathedral of St. Andrew')).toBeNull();
  });

  test('logging out and back in starts at the quiz again', () => {
    const utils = signIn();
    fireEvent.press(utils.getByTestId('btn-skip-quiz'));
    fireEvent.press(utils.getByText('Log Out'));
    fireEvent.changeText(utils.getByPlaceholderText('Username'), 'QuizUser');
    fireEvent.press(utils.getByTestId('btn-auth'));

    expect(utils.getByText('Church Quiz')).toBeTruthy();
  });
});
