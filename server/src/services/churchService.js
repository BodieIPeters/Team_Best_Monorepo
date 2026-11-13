// BUSINESS LOGIC LAYER.
// Takes database rows from the database access layer and turns them into the
// church objects the app uses. It never talks to Supabase directly.
const churchRepository = require("../db/churchRepository");

const DAYS = [
  ["Sunday", "Sun"],
  ["Monday", "Mon"],
  ["Tuesday", "Tue"],
  ["Wednesday", "Wed"],
  ["Thursday", "Thu"],
  ["Friday", "Fri"],
  ["Saturday", "Sat"]
];

// "10:45:00" -> "10:45 AM"
function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

// Service rows -> "Sun 9:00 AM & 10:45 AM"
function formatServiceTimes(services = []) {
  const parts = [];

  for (const [day, short] of DAYS) {
    const times = services
      .filter(service => service.day_of_week === day)
      .map(service => service.start_time)
      .sort()
      .map(formatTime);

    if (times.length === 0) continue;

    const joined =
      times.length === 2 ? times.join(" & ") : times.join(", ");

    parts.push(`${short} ${joined}`);
  }

  return parts.join("; ");
}

// Comments live on visits, and visits belong to services.
function collectComments(services = []) {
  return services
    .flatMap(service => service.visits || [])
    .map(visit => visit.comment)
    .filter(comment => typeof comment === "string" && comment.trim())
    .map(comment => comment.trim());
}

function toNumber(value) {
  return value === null || value === undefined ? 0 : Number(value);
}

// One database row -> one church object for the app.
function toChurch(row) {
  return {
    id: String(row.id),
    name: row.name,
    address: row.address,
    city: row.city,
    state: row.state,
    zipcode: row.zip,
    denomination: row.denomination,
    serviceTimes: formatServiceTimes(row.services),
    worshipStyle: row.worship_style,
    distanceMiles: toNumber(row.distance_miles),
    rating: toNumber(row.rating),
    description: row.description || "",
    userFeedback: collectComments(row.services)
  };
}

async function listChurches({ search, denomination, worshipStyle } = {}) {
  const rows = await churchRepository.getAllChurches();
  let churches = rows.map(toChurch);

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();

    churches = churches.filter(church =>
      church.name.toLowerCase().includes(term) ||
      church.denomination.toLowerCase().includes(term) ||
      church.city.toLowerCase().includes(term)
    );
  }

  if (denomination) {
    churches = churches.filter(church =>
      church.denomination.toLowerCase() === denomination.toLowerCase()
    );
  }

  if (worshipStyle) {
    churches = churches.filter(church =>
      church.worshipStyle.toLowerCase() === worshipStyle.toLowerCase()
    );
  }

  return churches;
}

// Returns null when the id is not a number or no church has it.
async function getChurch(id) {
  if (!/^\d+$/.test(String(id))) {
    return null;
  }

  const row = await churchRepository.getChurchById(Number(id));

  return row ? toChurch(row) : null;
}

module.exports = {
  listChurches,
  getChurch,
  toChurch,
  formatServiceTimes
};