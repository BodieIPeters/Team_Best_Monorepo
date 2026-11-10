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

  test('3b. filters churches by denomination', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    fireEvent.press(getByTestId('btn-denomination-Catholic'));

    expect(getByText('Cathedral of St. Andrew')).toBeTruthy();
    expect(queryByText('Crossroads Bible Church')).toBeNull();

    fireEvent.press(getByTestId('btn-denomination-All'));
    expect(getByText('Crossroads Bible Church')).toBeTruthy();
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

    test('5l. [Story 54: Edit comment] lets a user change an existing comment', async () => {
    const { getByText, queryByText, getByPlaceholderText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Church 1 starts with one comment, so press Edit on it (comment number 0)
    fireEvent.press(getByTestId('edit-feedback-1-0'));

    // Change the text and save
    fireEvent.changeText(getByTestId('edit-input-1'), 'Updated comment text');
    fireEvent.press(getByTestId('save-edit-1'));

    // The new text shows and the old text is gone
    expect(getByText('• Updated comment text')).toBeTruthy();
    expect(
      queryByText('• Welcoming community with active young adult and college groups.')
    ).toBeNull();
  });

  test('5m. [Story 54: Delete comment] lets a user delete an existing comment', async () => {
    const { queryByText, getByPlaceholderText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // The seeded comment is there at first
    expect(
      queryByText('• Welcoming community with active young adult and college groups.')
    ).toBeTruthy();

    // Delete it
    fireEvent.press(getByTestId('delete-feedback-1-0'));

    // It is gone
    expect(
      queryByText('• Welcoming community with active young adult and college groups.')
    ).toBeNull();
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

  
  // --- DIRECTORY FILTERS (User Stories 47 & 48) ---

  test('5c. [User Story 47: Filter by denomination] shows only churches of the chosen denomination', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Pick Nondenominational
    fireEvent.press(getByTestId('btn-denomination-Nondenominational'));

    // Nondenominational churches stay, everything else is hidden
    expect(getByText('Crossroads Bible Church')).toBeTruthy();
    expect(getByText('Calvary Church')).toBeTruthy();
    expect(getByText('Ada Bible Church (East Paris)')).toBeTruthy();
    expect(queryByText('Cathedral of St. Andrew')).toBeNull();
    expect(queryByText('Madison Square Church')).toBeNull();
    expect(queryByText('Mayflower Congregational Church')).toBeNull();
  });

  test('5d. [User Story 48: Filter by worship style] shows only churches with the chosen worship style', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Pick Contemporary
    fireEvent.press(getByTestId('btn-worship-Contemporary'));

    // Contemporary churches stay, the others are hidden
    expect(getByText('Crossroads Bible Church')).toBeTruthy();
    expect(getByText('Madison Square Church')).toBeTruthy();
    expect(getByText('Ada Bible Church (East Paris)')).toBeTruthy();
    expect(queryByText('Cathedral of St. Andrew')).toBeNull();
  });

  test('5e. [User Story 47: Filter by denomination] pressing all clears the denomination filter', async () => {
    const { getByText, getByPlaceholderText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Turn the filter on, then press All to turn it off
    fireEvent.press(getByTestId('btn-denomination-Catholic'));
    fireEvent.press(getByTestId('btn-denomination-All'));

    // All churches are back
    expect(getByText('Cathedral of St. Andrew')).toBeTruthy();
    expect(getByText('Crossroads Bible Church')).toBeTruthy();
    expect(getByText('Mayflower Congregational Church')).toBeTruthy();
  });

  test('5f. [User Stories 47 & 48] denomination and worship style filters work together', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Nondenominational AND Contemporary
    fireEvent.press(getByTestId('btn-denomination-Nondenominational'));
    fireEvent.press(getByTestId('btn-worship-Contemporary'));

    // Only churches that match both stay
    expect(getByText('Crossroads Bible Church')).toBeTruthy();
    expect(getByText('Ada Bible Church (East Paris)')).toBeTruthy();
    expect(queryByText('Calvary Church')).toBeNull();
    expect(queryByText('Madison Square Church')).toBeNull();
  });

  
  // --- DISTANCE FILTER (User Story 46) ---

  test('5i. [User Story 46: Filter by distance] Within 3 mi shows only nearby churches', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Pick Within 3 mi
    fireEvent.press(getByTestId('btn-distance-3'));

    // 1.8, 2.3 and 3.0 miles stay. 3.8, 5.1 and 6.2 miles are hidden.
    expect(getByText('Cathedral of St. Andrew')).toBeTruthy();
    expect(getByText('Crossroads Bible Church')).toBeTruthy();
    expect(getByText('Madison Square Church')).toBeTruthy();
    expect(queryByText('Mayflower Congregational Church')).toBeNull();
    expect(queryByText('Calvary Church')).toBeNull();
    expect(queryByText('Ada Bible Church (East Paris)')).toBeNull();
  });

  test('5j. [User Story 46: Filter by distance] Within 5 mi, and Any distance brings everything back', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Pick Within 5 mi: Mayflower (3.8) is in, Calvary (5.1) is out
    fireEvent.press(getByTestId('btn-distance-5'));
    expect(getByText('Mayflower Congregational Church')).toBeTruthy();
    expect(queryByText('Calvary Church')).toBeNull();
    expect(queryByText('Ada Bible Church (East Paris)')).toBeNull();

    // Any distance shows every church again
    fireEvent.press(getByTestId('btn-distance-any'));
    expect(getByText('Calvary Church')).toBeTruthy();
    expect(getByText('Ada Bible Church (East Paris)')).toBeTruthy();
  });

  test('5k. [User Stories 46 & 47] distance and denomination filters work together', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByPlaceholderText } =
      render(<HomeScreen />);

    // Login
    fireEvent.changeText(getByPlaceholderText('Username'), 'TestUser');
    fireEvent.press(getByTestId('btn-auth'));
    fireEvent.press(getByTestId('btn-skip-quiz'));
    await findByPlaceholderText(SEARCH_PLACEHOLDER);

    // Nondenominational AND within 5 mi
    fireEvent.press(getByTestId('btn-denomination-Nondenominational'));
    fireEvent.press(getByTestId('btn-distance-5'));

    // Only Crossroads (2.3 mi) matches both. Calvary is 5.1 mi and Ada is 6.2 mi.
    expect(getByText('Crossroads Bible Church')).toBeTruthy();
    expect(queryByText('Calvary Church')).toBeNull();
    expect(queryByText('Ada Bible Church (East Paris)')).toBeNull();
    expect(queryByText('Cathedral of St. Andrew')).toBeNull();
  });
  
  // --- HOW THE APP WORKS (User Story 62) ---

  test('5g. [User Story 62: How it works] shows the steps when the button is pressed', () => {
    const { getByText, getByTestId, queryByTestId } = render(<HomeScreen />);

    // Steps are hidden at first
    expect(queryByTestId('how-it-works-box')).toBeNull();
    expect(getByText('How does this app work?')).toBeTruthy();

    // Press the button to show the steps
    fireEvent.press(getByTestId('btn-how-it-works'));

    expect(getByTestId('how-it-works-box')).toBeTruthy();
    expect(getByText(/Create an account or sign in/)).toBeTruthy();
    expect(getByText(/See churches that match your answers/)).toBeTruthy();
    expect(getByText('Hide how it works')).toBeTruthy();
  });

  test('5h. [User Story 62: How it works] pressing the button again hides the steps', () => {
    const { getByTestId, queryByTestId } = render(<HomeScreen />);

    // Show, then hide
    fireEvent.press(getByTestId('btn-how-it-works'));
    fireEvent.press(getByTestId('btn-how-it-works'));

    expect(queryByTestId('how-it-works-box')).toBeNull();
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
