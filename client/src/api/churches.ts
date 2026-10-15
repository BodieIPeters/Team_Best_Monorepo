/**
 * Client for the church endpoints on the Express server (server/src/app.js).
 * Follows the same pattern as api/items.ts: one async function per request,
 * throwing an Error on a non-2xx response so screens can show an error state.
 *
 * The church API runs from server/src/index.js on port 5000
 * (`node src/index.js` inside server/). server.js on port 3000 is a separate,
 * older server with no church routes.
 *
 * localhost only works on web and simulators. A physical phone needs the
 * Mac's LAN IP here instead (e.g. http://192.168.1.20:5000/api).
 */
import { Church } from '@/constants/mockChurches';

const API_URL = 'http://localhost:5000/api';

/** GET /api/churches: every church on the server. */
export async function getChurches(): Promise<Church[]> {
  const response = await fetch(`${API_URL}/churches`);

  if (!response.ok) {
    throw new Error('Failed to fetch churches');
  }

  return response.json();
}
