import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../app/index';

describe('PR4 Client App Tests', () => {
  // --- LANDING PAGE TESTS (2 Tests) ---

  test('1. [Landing Page] renders auth landing page initially with Sign In and Register options', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<HomeScreen />);
    expect(getByText('Find Your Community')).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();

    // Verify Tab Switching works on Landing Page
    fireEvent.press(getByTestId('tab-register'));
    expect(getByText('Register & Continue')).toBeTruthy();
  });

  test('2. Navigates from landing page to directory screen upon successful sign in', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<HomeScreen />);

    fireEvent.changeText(getByPlaceholderText('Username'), 'DemoUser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByTestId('btn-auth'));

    expect(getByText('Welcome, DemoUser!')).toBeTruthy();
    expect(getByPlaceholderText('Search by church name or ZIP code...')).toBeTruthy();
  });

  // CHURCH DIRECTORY & USER STORIES TESTS 

  test('3. [User Story 2: Search] filters churches by ZIP code', () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId } = render(<HomeScreen />);

    // Login first
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));

    // Search by specific ZIP code 
    const searchInput = getByPlaceholderText('Search by church name or ZIP code...');
    fireEvent.changeText(searchInput, '49504');

    expect(getByText('Crossroads Bible Church')).toBeTruthy();
    expect(queryByText('Cathedral of St. Andrew')).toBeNull();
  });

  test('4. [User Story 3: Favorites] toggles favorite status and filters saved churches', () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId } = render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));

    // Save Cathedral of St. Andrew (id: 1)
    const favoriteBtn = getByTestId('favorite-button-1');
    fireEvent.press(favoriteBtn);

    // Toggle filter to show favorites only
    const filterFavoritesBtn = getByTestId('btn-toggle-favorites');
    fireEvent.press(filterFavoritesBtn);

    // Cathedral of St. Andrew should remain, while non-favorite churches are hidden
    expect(getByText('Cathedral of St. Andrew')).toBeTruthy();
    expect(queryByText('Crossroads Bible Church')).toBeNull();
  });

  test('5. [User Story 3: Feedback] allows users to submit custom feedback on a church', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));

    // Open feedback input on Church 1
    fireEvent.press(getByTestId('toggle-feedback-1'));

    // Write and submit feedback
    const feedbackInput = getByTestId('feedback-input-1');
    fireEvent.changeText(feedbackInput, 'Great choir music on Sunday morning!');
    fireEvent.press(getByTestId('submit-feedback-1'));

    // Verify feedback is added to the UI
    expect(getByText('• Great choir music on Sunday morning!')).toBeTruthy();
  });
});