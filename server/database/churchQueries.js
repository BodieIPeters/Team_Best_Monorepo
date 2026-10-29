const db = require("./db");
function searchChurches(name) {
  const query = `
    SELECT *
    FROM churches
    WHERE LOWER(name) LIKE LOWER(?)
    ORDER BY name
  `;

  return db.prepare(query).all(`%${name}%`);
}
