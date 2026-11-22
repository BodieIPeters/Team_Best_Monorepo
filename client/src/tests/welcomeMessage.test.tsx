import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/index';
import { getChurches } from '@/api/churches';
import { MOCK_CHURCHES } from '@/constants/mockChurches';

jest.mock('@/api/churches');

describe('Welcome message (story #37)', () => {
  beforeEach(() => {
    (getChurches as jest.Mock).mockResolvedValue(MOCK_CHURCHES);
  });

  test('shows what the app is for on the first screen', async () => {
    const { getByTestId, getByText } = render(<HomeScreen />);
    await waitFor(() => expect(getChurches).toHaveBeenCalled());

    expect(getByTestId('welcome-message')).toBeTruthy();
    expect(getByText('Welcome to Church Match!')).toBeTruthy();
  });

  test('is not shown once the student is signed in', async () => {
    const { getByTestId, queryByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getChurches).toHaveBeenCalled());

    fireEvent.changeText(getByTestId('input-username'), 'tester');
    fireEvent.press(getByTestId('btn-auth'));

    expect(queryByTestId('welcome-message')).toBeNull();
  });
});