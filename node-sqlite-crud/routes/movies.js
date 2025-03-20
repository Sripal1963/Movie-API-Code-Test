const express = require("express");
const router = express.Router();
const { moviesDB, ratingsDB } = require("../database");

router.get("/", (req, res) => {
    let { page = 1 } = req.query;
    const limit = 50;
    const offset = (page - 1) * limit;
  
    moviesDB.all(
      `SELECT imdbid, title, genres, releasedate, budget FROM movies LIMIT ? OFFSET ?`,
      [limit, offset],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
  
        // Format budget as a string with a dollar sign
        const movies = rows.map(movie => ({
          ...movie,
          budget: movie.budget ? `$${parseFloat(movie.budget).toFixed(2)}` : "$0"
        }));
  
        res.json({ page: parseInt(page), movies });
      }
    );
  });
  


// ✅ Get movies by year (paginated & sorted)
router.get("/year", (req, res) => {
  let { year, page = 1, order = "asc" } = req.query;
  const limit = 50;
  const offset = (page - 1) * limit;

  // Validate input
  if (!year || isNaN(year)) {
    return res.status(400).json({ error: "Invalid or missing year parameter" });
  }

  if (order !== "asc" && order !== "desc") {
    return res.status(400).json({ error: "Invalid sort order, use 'asc' or 'desc'" });
  }

  // ✅ Corrected: Use moviesDB instead of db
  const query = `
    SELECT imdbid, title, genres, releasedate, budget
    FROM movies
    WHERE SUBSTR(releasedate, 1, 4) = ?
    ORDER BY releasedate ${order.toUpperCase()}
    LIMIT ? OFFSET ?`;

  moviesDB.all(query, [year, limit, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ page: parseInt(page), year, movies: rows });
  });
});


router.get("/genre", (req, res) => {
    let { genre, page = 1, size = 50 } = req.query;
    page = Math.max(1, parseInt(page)); // Ensure page is at least 1
    size = Math.max(1, parseInt(size)); // Ensure a positive size

    const offset = (page - 1) * size;

    if (!genre) {
        return res.status(400).json({ error: "Genre parameter is required" });
    }

    // ✅ Correct way to filter genre stored as JSON
    const query = `
      SELECT imdbid, title, genres, releasedate, budget
      FROM movies
      WHERE EXISTS (
          SELECT 1 FROM json_each(movies.genres) 
          WHERE json_each.value LIKE ?
      )
      LIMIT ? OFFSET ?`;

    moviesDB.all(query, [`%${genre}%`, size, offset], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "No movies found for this genre" });
        }

        // ✅ Parse JSON before returning response
        rows.forEach(row => {
            row.genres = JSON.parse(row.genres);
        });

        res.json({ page, genre, movies: rows });
    });
});


  // Get movie details with rating
// ✅ Get movie details with rating
router.get("/:id", (req, res) => {
    const { id } = req.params;
  
    moviesDB.get(
      `SELECT imdbid, title, overview  as description, releasedate, budget, runtime, genres, language as original_language,  productioncompanies
       FROM movies WHERE movieid = ?`,
      [id],
      (err, movie) => {
        if (err || !movie) return res.status(404).json({ error: "Movie not found" });
  
        // Format budget in dollars
        movie.budget = movie.budget ? `$${parseFloat(movie.budget).toFixed(2)}` : "$0";
  
        // Fetch the average rating from the ratingsDB
        ratingsDB.get(
          `SELECT AVG(rating) AS average_rating FROM ratings WHERE movieid = ?`,
          [id],
          (err, ratingData) => {
            if (err) return res.status(500).json({ error: err.message });
  
            movie.average_rating = ratingData && ratingData.average_rating
              ? parseFloat(ratingData.average_rating).toFixed(2)
              : "N/A";
  
            res.json(movie);
          }
        );
      }
    );
  });
  
  
  
  
  

module.exports = router;
