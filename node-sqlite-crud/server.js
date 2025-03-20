const express = require("express");
const app = express();
const moviesRoutes = require("./routes/movies");

app.use(express.json());

app.use("/v1/api/movies", moviesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/v1/api/movies`);
});
