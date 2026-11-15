import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/index';
import { ForgotPassword } from '@/components/ForgotPassword';
import { getChurches } from '@/api/churches';
import { MOCK_CHURCHES } from '@/constants/mockChurches';

jest.mock('@/api/churches');

describe('ForgotPassword screen (story #60)', () => {
  test('asks for a username or email', () => {
    const { getByTestId, getByText } = render(<ForgotPassword onBack={jest.fn()} />);

    expect(getByText('Reset your password')).toBeTruthy();
    expect(getByTestId('input-reset-identifier')).toBeTruthy();
  });

  test('does nothing when the field is empty', () => {
    const { getByTestId, queryByTestId } = render(<ForgotPassword onBack={jest.fn()} />);

    fireEvent.press(getByTestId('btn-send-reset'));

    expect(queryByTestId('reset-confirmation')).toBeNull();
  });

  test('shows a confirmation after a username is entered', () => {
    const { getByTestId } = render(<ForgotPassword onBack={jest.fn()} />);

    fireEvent.changeText(getByTestId('input-reset-identifier'), 'ama');
    fireEvent.press(getByTestId('btn-send-reset'));

    expect(getByTestId('reset-confirmation')).toBeTruthy();
  });

  test('Back to Sign In calls onBack', () => {
    const onBack = jest.fn();
    const { getByTestId } = render(<ForgotPassword onBack={onBack} />);

    fireEvent.press(getByTestId('btn-back-to-signin'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('Forgot password link on the sign-in screen (story #60)', () => {
  beforeEach(() => {
    (getChurches as jest.Mock).mockResolvedValue(MOCK_CHURCHES);
  });

  test('opens the reset screen and goes back to sign in', async () => {
    const { getByTestId, queryByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getChurches).toHaveBeenCalled());

    fireEvent.press(getByTestId('btn-forgot-password'));

    expect(getByTestId('forgot-password')).toBeTruthy();
    expect(queryByTestId('btn-auth')).toBeNull();

    fireEvent.press(getByTestId('btn-back-to-signin'));

    expect(getByTestId('btn-auth')).toBeTruthy();
  });
});