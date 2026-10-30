/**
 * Screen-level tests for the preference quiz flow (SRS User Stories 3 & 4).
 *
 * These render the real HomeScreen and press buttons the way a student would,
 * checking navigation: sign in -> quiz -> results -> directory, plus Skip.
 * Buttons and options are found by testID (e.g. `option-maxDistance-5`,
 * `btn-submit-quiz`), which are set in components/PreferenceQuiz.tsx and
 * components/QuizResults.tsx.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../app/index';
import { getChurches } from '../api/churches';
import { MOCK_CHURCHES } from '../constants/mockChurches';

// Stand in for the server: getChurches resolves with the mock data instead of calling fetch.
jest.mock('../api/churches', () => ({ getChurches: jest.fn() }));
beforeEach(() => {
  jest.mocked(getChurches).mockResolvedValue(MOCK_CHURCHES);
});

/**
 * Renders the app, lets the (mocked) church load finish, and signs in, which
 * lands on the quiz. Returns the render helpers.
 */
const signIn = async () => {
  const utils = render(<HomeScreen />);
  await act(async () => {}); // flush the resolved getChurches promise
  fireEvent.changeText(utils.getByPlaceholderText('Username'), 'QuizUser');
  fireEvent.press(utils.getByTestId('btn-auth'));
  return utils;
};

type Utils = Awaited<ReturnType<typeof signIn>>;

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
  test('shows the quiz right after sign-in', async () => {
    const { getByText, getByTestId } = await signIn();
    expect(getByText('Church Quiz')).toBeTruthy();
    expect(getByText(/Which denomination/)).toBeTruthy();
    expect(getByTestId('btn-submit-quiz')).toBeTruthy();
  });

  test('Submit stays disabled until every question is answered', async () => {
    const utils = await signIn();
    const { getByTestId, queryByText } = utils;

    fireEvent.press(getByTestId('option-denomination-Catholic'));
    fireEvent.press(getByTestId('option-worshipStyle-Liturgical'));
    fireEvent.press(getByTestId('btn-submit-quiz'));
    expect(queryByText('Your Recommendations')).toBeNull();

    fireEvent.press(getByTestId('option-maxDistance-3'));
    fireEvent.press(getByTestId('btn-submit-quiz'));
    expect(queryByText('Your Recommendations')).toBeTruthy();
  });

  test('selecting an option marks it checked', async () => {
    const { getByTestId } = await signIn();
    const option = getByTestId('option-worshipStyle-Blended');
    expect(option.props.accessibilityState).toEqual({ checked: false });
    fireEvent.press(option);
    expect(getByTestId('option-worshipStyle-Blended').props.accessibilityState).toEqual({
      checked: true,
    });
  });

  test('submitting shows only the recommended churches', async () => {
    const utils = await signIn();
    answerQuiz(utils, 'Nondenominational', 'Contemporary', '5');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));

    expect(utils.getByText('Your Recommendations')).toBeTruthy();
    expect(utils.getByText('These churches fit everything you told us.')).toBeTruthy();
    expect(utils.getByText('Crossroads Bible Church')).toBeTruthy();
    expect(utils.queryByText('Cathedral of St. Andrew')).toBeNull();
    expect(utils.queryByText('Ada Bible Church (East Paris)')).toBeNull();
  });

  test('explains when it is showing closest matches instead', async () => {
    const utils = await signIn();
    answerQuiz(utils, 'Catholic', 'Contemporary', 'no-preference');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));

    expect(utils.getByText(/closest matches/)).toBeTruthy();
    expect(utils.getByText('Cathedral of St. Andrew')).toBeTruthy();
  });

  test('Return Home goes to the full directory', async () => {
    const utils = await signIn();
    answerQuiz(utils, 'Nondenominational', 'Contemporary', '5');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));
    fireEvent.press(utils.getByTestId('btn-return-home'));

    expect(utils.getByPlaceholderText('Search by church name or ZIP code...')).toBeTruthy();
    expect(utils.getByText('Cathedral of St. Andrew')).toBeTruthy();
  });

  test('Skip for now goes straight to the directory', async () => {
    const { getByTestId, getByPlaceholderText, queryByText } = await signIn();
    fireEvent.press(getByTestId('btn-skip-quiz'));

    expect(getByPlaceholderText('Search by church name or ZIP code...')).toBeTruthy();
    expect(queryByText('Church Quiz')).toBeNull();
  });

  test('saving a church from the results carries over to the directory', async () => {
    const utils = await signIn();
    answerQuiz(utils, 'Nondenominational', 'Contemporary', '5');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));
    fireEvent.press(utils.getByTestId('favorite-button-2'));
    fireEvent.press(utils.getByTestId('btn-return-home'));
    fireEvent.press(utils.getByTestId('btn-toggle-favorites'));

    expect(utils.getByText('Crossroads Bible Church')).toBeTruthy();
    expect(utils.queryByText('Cathedral of St. Andrew')).toBeNull();
  });

  test('logging out and back in starts at the quiz again', async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId('btn-skip-quiz'));
    fireEvent.press(utils.getByText('Log Out'));
    fireEvent.changeText(utils.getByPlaceholderText('Username'), 'QuizUser');
    fireEvent.press(utils.getByTestId('btn-auth'));

    expect(utils.getByText('Church Quiz')).toBeTruthy();
  });
});

describe('Retake / update preferences (User Stories 15 & 26)', () => {
  test('results screen offers Update Preferences, which reopens the quiz pre-filled', async () => {
    const utils = await signIn();
    answerQuiz(utils, 'Nondenominational', 'Contemporary', '5');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));

    // Results screen shows the retake button.
    expect(utils.getByTestId('btn-retake-quiz')).toBeTruthy();

    // Pressing it reopens the quiz in "update" mode with answers pre-filled.
    fireEvent.press(utils.getByTestId('btn-retake-quiz'));
    expect(utils.getByText('Update Your Preferences')).toBeTruthy();

    // Previous answers are already selected.
    expect(utils.getByTestId('option-denomination-Nondenominational').props.accessibilityState).toEqual({
      checked: true,
    });
    expect(utils.getByTestId('option-worshipStyle-Contemporary').props.accessibilityState).toEqual({
      checked: true,
    });
    expect(utils.getByTestId('option-maxDistance-5').props.accessibilityState).toEqual({
      checked: true,
    });

    // Submit button is enabled immediately (nothing to answer) and says "Update Preferences".
    const submit = utils.getByTestId('btn-submit-quiz');
    expect(submit.props.accessibilityState).toEqual({ disabled: false });
    expect(utils.getByText('Update Preferences')).toBeTruthy();
  });

  test('changing an answer on retake updates the recommendations', async () => {
    const utils = await signIn();
    answerQuiz(utils, 'Nondenominational', 'Contemporary', '5');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));
    expect(utils.getByText('Crossroads Bible Church')).toBeTruthy();

    // Retake and switch to Catholic + Liturgical (Cathedral of St. Andrew).
    fireEvent.press(utils.getByTestId('btn-retake-quiz'));
    fireEvent.press(utils.getByTestId('option-denomination-Catholic'));
    fireEvent.press(utils.getByTestId('option-worshipStyle-Liturgical'));
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));

    expect(utils.getByText('Cathedral of St. Andrew')).toBeTruthy();
    expect(utils.queryByText('Crossroads Bible Church')).toBeNull();
  });

  test('directory offers Update Preferences, which reopens the quiz pre-filled', async () => {
    const utils = await signIn();
    answerQuiz(utils, 'Nondenominational', 'Contemporary', '5');
    fireEvent.press(utils.getByTestId('btn-submit-quiz'));
    fireEvent.press(utils.getByTestId('btn-return-home'));

    // Directory shows the update button.
    expect(utils.getByTestId('btn-update-preferences')).toBeTruthy();

    fireEvent.press(utils.getByTestId('btn-update-preferences'));
    expect(utils.getByText('Update Your Preferences')).toBeTruthy();
    expect(utils.getByTestId('option-denomination-Nondenominational').props.accessibilityState).toEqual({
      checked: true,
    });
  });
});
