// seed.js
// This file reads recipes.json, cleans up bad values,
// and saves a cleaned version we can use later.

const fs = require('fs');           // built into Node.js, lets us read/write files
const { cleanNumber } = require('./helpers');

// Read the raw recipes.json file as text, then convert it into
// a real JavaScript array of objects.
const rawData = fs.readFileSync('recipes.json', 'utf-8');
const recipes = JSON.parse(rawData);

// Go through every recipe and clean up its numeric fields.
const cleanedRecipes = recipes.map((recipe, index) => {
  return {
    id: index + 1,
    cuisine: recipe.cuisine,
    title: recipe.title,
    rating: cleanNumber(recipe.rating),
    prep_time: cleanNumber(recipe.prep_time),
    cook_time: cleanNumber(recipe.cook_time),
    total_time: cleanNumber(recipe.total_time),
    description: recipe.description,
    image: recipe.image,
    nutrients: recipe.nutrients,
    serves: recipe.serves
  };
});

// Save the cleaned data into a new file, our "database".
fs.writeFileSync('database.json', JSON.stringify(cleanedRecipes, null, 2));

console.log(`Done! Cleaned ${cleanedRecipes.length} recipes and saved to database.json`);