// Creates the one connection to Supabase. The URL and secret key come from
// server/.env (never from the code), so they are not committed to GitHub.
const { createClient } = require("@supabase/supabase-js");

let client;

function getSupabase() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;

    if (!url || !key) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in server/.env");
    }

    client = createClient(url, key, { auth: { persistSession: false } });
  }

  return client;
}

module.exports = { getSupabase };