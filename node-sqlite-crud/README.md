Movie API 

Overview

This project provides a RESTful API for retrieving movie details  server with SQLite as the database. The API supports features like pagination, filtering by year and genre, and retrieving movie details with ratings.

Prerequisites

Node.js (>=14)

SQLite3

Express.js

Installation & Setup

Clone the repository:

Install dependencies:

Set up the database:

Start the server:

API Endpoints

1. Get All Movies (Paginated)

GET /v1/api/movies?page=1

Query Params:

page (optional, default: 1)

Response:

2. Get Movies By Year (Paginated)

GET /v1/api/movies/year?year=2005&page=1

Query Params:

year (required)

page (optional, default: 1)

Response:

3. Get Movies By Genre (Paginated)

GET /v1/api/movies/genre?genre=Action&page=1&size=50

Query Params:

genre (required)

page (optional, default: 1)

size (optional, default: 50)

Response:

Note: The genres field in the database is stored as a JSON array. The API filters using LIKE '%Action%', which may return movies with multiple genres.

4. Get Movie Details With Rating

GET /v1/api/movies/:id

Path Params:

id (Movie ID, required)

Response:

Database Schema

The movies table structure:

The ratings table structure:

Issues and Fixes

Issue: The genres column is stored as a JSON string in the database. Filtering by genre may include movies with multiple genres.

Fix: Use LIKE '%Action%' in SQL to match genres containing the keyword.

License

This project is open-source under the MIT License.

