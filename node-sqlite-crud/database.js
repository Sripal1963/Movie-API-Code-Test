const sqlite3 = require("sqlite3").verbose();

// Connect to the movies database
const moviesDB = new sqlite3.Database("./db/movies.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error("Movies DB Connection Error:", err.message);
  else console.log("🎬 Connected to the Movies database.");
});

// Connect to the ratings database
const ratingsDB = new sqlite3.Database("./db/ratings.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error("Ratings DB Connection Error:", err.message);
  else console.log("⭐ Connected to the Ratings database.");
});

module.exports = { moviesDB, ratingsDB };
