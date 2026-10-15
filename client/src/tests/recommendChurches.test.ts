/**
 * Unit tests for utils/recommendChurches.ts (SRS User Stories 3 & 4).
 *
 * These call the matching function directly, with no UI, so a failure here
 * points at the matching rules rather than at a screen.
 *
 * NOTE: expected church names depend on the data in constants/mockChurches.ts
 * (denomination, worship style, distance). If that mock data changes, these
 * expectations need updating too.
 */
import { describe, test, expect } from '@jest/globals';
import { MOCK_CHURCHES } from '../constants/mockChurches';
import { NO_PREFERENCE, QuizAnswers } from '../constants/quizQuestions';
import { recommendChurches } from '../utils/recommendChurches';

/** Builds a full QuizAnswers, defaulting every question to "No preference". */
const answers = (overrides: Partial<QuizAnswers>): QuizAnswers => ({
  denomination: NO_PREFERENCE,
  worshipStyle: NO_PREFERENCE,
  maxDistance: NO_PREFERENCE,
  ...overrides,
});
const names = (result: ReturnType<typeof recommendChurches>) =>
  result.churches.map((c) => c.name);

describe('recommendChurches (User Stories 3 & 4)', () => {
  test('no preferences recommends every church', () => {
    const result = recommendChurches(MOCK_CHURCHES, answers({}));
    expect(result.exactMatch).toBe(true);
    expect(result.churches).toHaveLength(MOCK_CHURCHES.length);
  });

  test('recommends only churches meeting every answer', () => {
    const result = recommendChurches(
      MOCK_CHURCHES,
      answers({ denomination: 'Nondenominational', worshipStyle: 'Contemporary', maxDistance: '5' })
    );
    expect(result.exactMatch).toBe(true);
    expect(names(result)).toEqual(['Crossroads Bible Church']);
  });

  test('distance limit includes a church exactly at the limit', () => {
    const result = recommendChurches(MOCK_CHURCHES, answers({ maxDistance: '3' }));
    expect(names(result)).toEqual([
      'Cathedral of St. Andrew',
      'Crossroads Bible Church',
      'Madison Square Church',
    ]);
  });

  test('keeps the original order instead of ranking', () => {
    const result = recommendChurches(MOCK_CHURCHES, answers({ worshipStyle: 'Contemporary' }));
    expect(names(result)).toEqual([
      'Crossroads Bible Church',
      'Madison Square Church',
      'Ada Bible Church (East Paris)',
    ]);
  });

  test('falls back to closest matches when nothing meets every answer', () => {
    // No Catholic church is Contemporary, so the best any church can do is 1 of 2.
    const result = recommendChurches(
      MOCK_CHURCHES,
      answers({ denomination: 'Catholic', worshipStyle: 'Contemporary' })
    );
    expect(result.exactMatch).toBe(false);
    expect(names(result)).toEqual([
      'Cathedral of St. Andrew',
      'Crossroads Bible Church',
      'Madison Square Church',
      'Ada Bible Church (East Paris)',
    ]);
  });

  test('returns nothing when no church meets any answer', () => {
    // The Cathedral is Catholic and Liturgical, so it fails both answers.
    const cathedral = MOCK_CHURCHES.filter((c) => c.id === '1');
    const result = recommendChurches(
      cathedral,
      answers({ denomination: 'Nondenominational', worshipStyle: 'Contemporary' })
    );
    expect(result).toEqual({ churches: [], exactMatch: false });
  });
});
