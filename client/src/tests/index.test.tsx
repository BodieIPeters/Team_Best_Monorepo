import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../app/index';

describe('PR4 Client App Tests', () => {
  test('renders auth landing page initially', () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen />);
    expect(getByText('Find Your Community')).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
  });

  test('switches to search directory screen after sign in', () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(<HomeScreen />);

    fireEvent.changeText(getByPlaceholderText('Username'), 'DemoUser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    // Select the button element specifically
    const signInButtons = getAllByText('Sign In');
    fireEvent.press(signInButtons[signInButtons.length - 1]);

    expect(getByText('Welcome, DemoUser!')).toBeTruthy();
    expect(getByPlaceholderText('Search by church name or ZIP code...')).toBeTruthy();
  });
});