// server.js
// This file starts our web server and defines our API endpoints.

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { parseFilter } = require('./helpers');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Simple test route
app.get('/', (req, res) => {
  res.send('Hello! The recipe server is running.');
});

// This route returns recipes, paginated and sorted by rating.
app.get('/api/recipes', (req, res) => {
  const rawData = fs.readFileSync('database.json', 'utf-8');
  const recipes = JSON.parse(rawData);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const sorted = recipes.slice().sort((a, b) => {
    if (a.rating === null) return 1;
    if (b.rating === null) return -1;
    return b.rating - a.rating;
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pageOfRecipes = sorted.slice(startIndex, endIndex);

  res.json({
    page: page,
    limit: limit,
    total: recipes.length,
    data: pageOfRecipes
  });
});

// This route searches/filters recipes based on query parameters.
app.get('/api/recipes/search', (req, res) => {
  const rawData = fs.readFileSync('database.json', 'utf-8');
  let recipes = JSON.parse(rawData);

  // Filter by title (partial match, case-insensitive)
  if (req.query.title) {
    const searchText = req.query.title.toLowerCase();
    recipes = recipes.filter(r =>
      r.title && r.title.toLowerCase().includes(searchText)
    );
  }

  // Filter by cuisine (partial match, case-insensitive)
  if (req.query.cuisine) {
    const searchText = req.query.cuisine.toLowerCase();
    recipes = recipes.filter(r =>
      r.cuisine && r.cuisine.toLowerCase().includes(searchText)
    );
  }

  // Filter by rating using our parseFilter helper (e.g. ">=4.5")
  if (req.query.rating) {
    const filter = parseFilter(req.query.rating);
    if (filter) {
      recipes = recipes.filter(r => matchesFilter(r.rating, filter));
    }
  }

  // Filter by total_time (e.g. "<=60")
  if (req.query.total_time) {
    const filter = parseFilter(req.query.total_time);
    if (filter) {
      recipes = recipes.filter(r => matchesFilter(r.total_time, filter));
    }
  }

  res.json({
    total: recipes.length,
    data: recipes
  });
});

// Small helper used above: checks if a value passes a filter like {operator: ">=", value: 4.5}
function matchesFilter(actualValue, filter) {
  if (actualValue === null || actualValue === undefined) return false;

  if (filter.operator === '>=') return actualValue >= filter.value;
  if (filter.operator === '<=') return actualValue <= filter.value;
  if (filter.operator === '>') return actualValue > filter.value;
  if (filter.operator === '<') return actualValue < filter.value;
  return actualValue === filter.value; // "=" or no operator
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});