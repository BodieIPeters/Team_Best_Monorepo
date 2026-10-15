/**
 * Unit tests for api/churches.ts. global.fetch is replaced with a mock, so no
 * server needs to be running.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals';
import { getChurches } from '../api/churches';
import { MOCK_CHURCHES } from '../constants/mockChurches';

const mockFetch = (ok: boolean, body: unknown) =>
  jest.fn(async () => ({ ok, json: async () => body }) as Response);

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getChurches', () => {
  test('requests /api/churches and returns the parsed list', async () => {
    const fetchMock = mockFetch(true, MOCK_CHURCHES);
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(getChurches()).resolves.toEqual(MOCK_CHURCHES);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5000/api/churches');
  });

  test('throws when the server responds with an error status', async () => {
    global.fetch = mockFetch(false, { error: 'boom' }) as unknown as typeof fetch;

    await expect(getChurches()).rejects.toThrow('Failed to fetch churches');
  });
});
