// app.js
// This file fetches recipes from our backend API and displays them as photo cards.

const API_BASE = 'https://recipe-explorer-api.onrender.com';

// Grabs references to the HTML elements we'll need to update.
const recipeGrid = document.getElementById('recipeGrid');
const titleFilterInput = document.getElementById('titleFilter');
const cuisineFilterInput = document.getElementById('cuisineFilter');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const limitSelect = document.getElementById('limitSelect');

// Drawer elements
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const drawerImage = document.getElementById('drawerImage');
const drawerTitle = document.getElementById('drawerTitle');
const drawerCuisine = document.getElementById('drawerCuisine');
const drawerDescription = document.getElementById('drawerDescription');
const drawerTotalTime = document.getElementById('drawerTotalTime');
const drawerPrepTime = document.getElementById('drawerPrepTime');
const drawerCookTime = document.getElementById('drawerCookTime');
const expandTimeBtn = document.getElementById('expandTimeBtn');
const timeDetails = document.getElementById('timeDetails');
const nutritionTable = document.getElementById('nutritionTable');

let currentPage = 1;
let currentLimit = 15;
let totalRecipes = 0;

async function loadAllRecipes() {
  const url = `${API_BASE}/api/recipes?page=${currentPage}&limit=${currentLimit}`;
  const response = await fetch(url);
  const result = await response.json();

  totalRecipes = result.total;
  renderGrid(result.data);
  updatePaginationDisplay();
}

async function searchRecipes() {
  const title = titleFilterInput.value.trim();
  const cuisine = cuisineFilterInput.value.trim();

  let url = `${API_BASE}/api/recipes/search?`;
  if (title) url += `title=${encodeURIComponent(title)}&`;
  if (cuisine) url += `cuisine=${encodeURIComponent(cuisine)}&`;

  const response = await fetch(url);
  const result = await response.json();

  renderGrid(result.data);
}

// Builds a photo card for each recipe and adds it to the grid.
function renderGrid(recipes) {
  recipeGrid.innerHTML = '';

  if (recipes.length === 0) {
    recipeGrid.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const ratingText = recipe.rating !== null ? '⭐ ' + recipe.rating : 'No rating';
    const timeText = recipe.total_time !== null ? recipe.total_time + ' min' : '—';

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <div class="recipe-card-body">
        <p class="recipe-card-title">${recipe.title || ''}</p>
        <p class="recipe-card-meta">${recipe.cuisine || ''}</p>
        <p class="recipe-card-meta">${ratingText} · ${timeText}</p>
      </div>
    `;

    card.addEventListener('click', () => openDrawer(recipe));

    recipeGrid.appendChild(card);
  });
}

function openDrawer(recipe) {
  drawerImage.src = recipe.image || '';
  drawerTitle.textContent = recipe.title || '';
  drawerCuisine.textContent = recipe.cuisine || '';
  drawerDescription.textContent = recipe.description || '—';
  drawerTotalTime.textContent = recipe.total_time !== null ? recipe.total_time + ' min' : '—';
  drawerPrepTime.textContent = recipe.prep_time !== null ? recipe.prep_time + ' min' : '—';
  drawerCookTime.textContent = recipe.cook_time !== null ? recipe.cook_time + ' min' : '—';

  timeDetails.style.display = 'none';
  expandTimeBtn.textContent = '▸';

  const nutrients = recipe.nutrients || {};
  nutritionTable.innerHTML = `
    <tr><td>Calories</td><td>${nutrients.calories || '—'}</td></tr>
    <tr><td>Carbohydrates</td><td>${nutrients.carbohydrateContent || '—'}</td></tr>
    <tr><td>Cholesterol</td><td>${nutrients.cholesterolContent || '—'}</td></tr>
    <tr><td>Fiber</td><td>${nutrients.fiberContent || '—'}</td></tr>
    <tr><td>Protein</td><td>${nutrients.proteinContent || '—'}</td></tr>
    <tr><td>Saturated Fat</td><td>${nutrients.saturatedFatContent || '—'}</td></tr>
    <tr><td>Sodium</td><td>${nutrients.sodiumContent || '—'}</td></tr>
    <tr><td>Sugar</td><td>${nutrients.sugarContent || '—'}</td></tr>
    <tr><td>Fat</td><td>${nutrients.fatContent || '—'}</td></tr>
  `;

  drawer.style.display = 'block';
  drawerOverlay.style.display = 'block';
}

function closeDrawer() {
  drawer.style.display = 'none';
  drawerOverlay.style.display = 'none';
}

function updatePaginationDisplay() {
  const totalPages = Math.max(Math.ceil(totalRecipes / currentLimit), 1);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

searchBtn.addEventListener('click', searchRecipes);

clearBtn.addEventListener('click', () => {
  titleFilterInput.value = '';
  cuisineFilterInput.value = '';
  currentPage = 1;
  loadAllRecipes();
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    loadAllRecipes();
  }
});

nextBtn.addEventListener('click', () => {
  currentPage += 1;
  loadAllRecipes();
});

limitSelect.addEventListener('change', () => {
  currentLimit = parseInt(limitSelect.value);
  currentPage = 1;
  loadAllRecipes();
});

closeDrawerBtn.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

expandTimeBtn.addEventListener('click', () => {
  const isHidden = timeDetails.style.display === 'none';
  timeDetails.style.display = isHidden ? 'block' : 'none';
  expandTimeBtn.textContent = isHidden ? '▾' : '▸';
});

loadAllRecipes();