
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "churchmatch.db");

const db = new Database(dbPath);

// Enable foreign key checks
db.pragma("foreign_keys = ON");

module.exports = db;
