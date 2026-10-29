import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Share } from 'react-native';
import HomeScreen from '../app/index';
import { getChurches } from '../api/churches';
import { MOCK_CHURCHES } from '../constants/mockChurches';

// Stand in for the server: getChurches resolves with the mock data instead of calling fetch.
jest.mock('../api/churches', () => ({ getChurches: jest.fn() }));
const mockGetChurches = jest.mocked(getChurches);

// Mock the native Share API so we can assert the share menu is opened with the right content.
jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction } as any);
const mockShare = jest.mocked(Share.share);

beforeEach(() => {
  mockGetChurches.mockReset();
  mockGetChurches.mockResolvedValue(MOCK_CHURCHES);
  mockShare.mockClear();
});

const SEARCH_PLACEHOLDER = 'Search by church name or ZIP code...';

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

  // NOTE: sign-in opens the preference quiz first. Tests 2-5 press "Skip for now"
  // (btn-skip-quiz) to reach the directory, then wait for churches to load;
  // the quiz itself is tested in preferenceQuiz.test.tsx.
  test('2. Navigates from landing page to directory screen upon successful sign in', async () => {
    const { getByText, getByPlaceholderText, getByTestId, findByPlaceholderText } = render(<HomeScreen />);

    fireEvent.changeText(getByPlaceholderText('Username'), 'DemoUser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));

    expect(await findByPlaceholderText(SEARCH_PLACEHOLDER)).toBeTruthy();
    expect(getByText('Welcome, DemoUser!')).toBeTruthy();
  });

  // CHURCH DIRECTORY & USER STORIES TESTS 

  test('3. [User Story 2: Search] filters churches by ZIP code', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login first
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));

    // Search by specific ZIP code (once churches have loaded)
    const searchInput = await findByPlaceholderText(SEARCH_PLACEHOLDER);
    fireEvent.changeText(searchInput, '49504');

    expect(getByText('Crossroads Bible Church')).toBeTruthy();
    expect(queryByText('Cathedral of St. Andrew')).toBeNull();
  });

  test('4. [User Story 3: Favorites] toggles favorite status and filters saved churches', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

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

  test('5. [User Story 3: Feedback] allows users to submit custom feedback on a church', async () => {
    const { getByText, getByPlaceholderText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Open feedback input on Church 1
    fireEvent.press(getByTestId('toggle-feedback-1'));

    // Write and submit feedback
    const feedbackInput = getByTestId('feedback-input-1');
    fireEvent.changeText(feedbackInput, 'Great choir music on Sunday morning!');
    fireEvent.press(getByTestId('submit-feedback-1'));

    // Verify feedback is added to the UI
    expect(getByText('• Great choir music on Sunday morning!')).toBeTruthy();
  });

  test('5b. [User Story 28: Share] opens the share menu with the church info when Share is pressed', async () => {
    const { getByPlaceholderText, getByTestId, findByPlaceholderText } = render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Every church card should expose a share button
    expect(getByTestId('share-button-1')).toBeTruthy();
    expect(getByTestId('share-button-2')).toBeTruthy();

    // Pressing Share should open the native share menu with the church's info
    fireEvent.press(getByTestId('share-button-1'));
    expect(mockShare).toHaveBeenCalledTimes(1);

    const sharedContent = mockShare.mock.calls[0][0];
    expect(sharedContent.message).toContain('Cathedral of St. Andrew');
    expect(sharedContent.message).toContain('Catholic');
    expect(sharedContent.message).toContain('301 Sheldon Blvd SE');
    expect(sharedContent.message).toContain('Sun 8:30 AM, 10:30 AM, 5:30 PM');
  });

  // --- SERVER CONNECTION ---

  test('6. shows an error with Retry when the server is unreachable, and recovers on Retry', async () => {
    mockGetChurches.mockRejectedValueOnce(new Error('Network request failed'));
    jest.spyOn(console, 'error').mockImplementation(() => {}); // expected error, keep output clean

    const { getByPlaceholderText, getByTestId, findByTestId, findByPlaceholderText } =
      render(<HomeScreen />);
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));

    expect(await findByTestId('load-error')).toBeTruthy();

    fireEvent.press(getByTestId('btn-retry')); // second call uses the default: resolves with churches
    expect(await findByPlaceholderText(SEARCH_PLACEHOLDER)).toBeTruthy();
    expect(mockGetChurches).toHaveBeenCalledTimes(2);
  });
});
