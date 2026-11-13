// DATABASE ACCESS LAYER.
// The only file that talks to Supabase about churches. It returns rows exactly
// as stored (snake_case). Turning them into what the app needs is the job of
// the business logic layer (src/services/churchService.js).
const { getSupabase } = require("./supabaseClient");

// A church, its services, and the comments left on those services.
const CHURCH_SELECT =
  "id, name, address, city, state, zip, denomination, worship_style, " +
  "description, rating, distance_miles, " +
  "services(day_of_week, start_time, visits(comment))";

async function getAllChurches() {
  const { data, error } = await getSupabase()
    .from("churches")
    .select(CHURCH_SELECT)
    .order("id");

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return data;
}

async function getChurchById(id) {
  const { data, error } = await getSupabase()
    .from("churches")
    .select(CHURCH_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return data; // null when there is no church with that id
}

module.exports = { getAllChurches, getChurchById };