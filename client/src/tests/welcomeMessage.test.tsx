import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/index';
import { getChurches } from '@/api/churches';
import { MOCK_CHURCHES } from '@/constants/mockChurches';

jest.mock('@/api/churches');

describe('Welcome screen (story #37)', () => {
  beforeEach(() => {
    (getChurches as jest.Mock).mockResolvedValue(MOCK_CHURCHES);
  });

  test('shows the welcome screen first, with a title, a short explanation and Continue', async () => {
    const { getByTestId, getByText } = render(<HomeScreen />);
    await waitFor(() => expect(getChurches).toHaveBeenCalled());

    expect(getByTestId('welcome-screen')).toBeTruthy();
    expect(getByText('Welcome to Church Match!')).toBeTruthy();
    expect(getByText(/We help college students find a church near campus/)).toBeTruthy();
    expect(getByTestId('btn-continue')).toBeTruthy();
  });

  test('does not show the sign-in form until Continue is pressed', async () => {
    const { queryByText, queryByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getChurches).toHaveBeenCalled());

    expect(queryByText('Find Your Community')).toBeNull();
    expect(queryByTestId('input-username')).toBeNull();
  });

  test('Continue goes to the sign-in screen and hides the welcome screen', async () => {
    const { getByTestId, getByText, queryByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getChurches).toHaveBeenCalled());

    fireEvent.press(getByTestId('btn-continue'));

    expect(getByText('Find Your Community')).toBeTruthy();
    expect(getByTestId('input-username')).toBeTruthy();
    expect(queryByTestId('welcome-screen')).toBeNull();
  });

  test('after signing in, the welcome screen does not come back', async () => {
    const { getByTestId, queryByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getChurches).toHaveBeenCalled());

    fireEvent.press(getByTestId('btn-continue'));
    fireEvent.changeText(getByTestId('input-username'), 'tester');
    fireEvent.press(getByTestId('btn-auth'));

    expect(queryByTestId('welcome-screen')).toBeNull();
  });
});