# Recipe Explorer

A full-stack recipe browsing application with a Node.js/Express REST API and a JavaScript frontend. Users can browse recipes in a photo card grid, search/filter by title, cuisine, rating, and time, view full recipe details in a slide-out panel, and page through results.

## Features

- **REST API** built with Express
  - `GET /api/recipes` — paginated list of recipes, sorted by rating (descending)
  - `GET /api/recipes/search` — filter recipes by title, cuisine, rating, or total time
- **Data cleaning**: invalid or missing numeric fields (rating, prep/cook/total time) are detected during parsing and safely stored as `null` instead of crashing the app or storing bad data
- **Frontend**
  - Photo card grid layout with star ratings
  - Live search by title and cuisine
  - Pagination with adjustable results-per-page (15/20/30/50)
  - Click any recipe to open a detail panel with description, an expandable time breakdown (prep/cook time), and a full nutrition table
  - Graceful empty-state message when no recipes match a search

## Tech stack

- **Backend:** Node.js, Express
- **Data storage:** JSON file (chosen for simplicity and zero external dependencies — see note below)
- **Frontend:** HTML, CSS, vanilla JavaScript (no framework)

## Project structure