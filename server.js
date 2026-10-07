const express = require("express");
const cors = require("cors");
const path = require("path");

const { getMatches } = require("./services/recipeMatcher");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   LOAD RECIPES
========================= */

const recipesPath = path.join(
  __dirname,
  "data",
  "recipes.json"
);

const recipes = require(recipesPath);

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Smart Recipe DSA Backend is running!"
  });
});

/* =========================
   RECIPE SEARCH
========================= */

app.post("/api/recipes/search", (req, res) => {
  try {
    const selectedIngredients = Array.isArray(
      req.body.ingredients
    )
      ? req.body.ingredients
      : [];

    if (selectedIngredients.length === 0) {
      return res.status(400).json({
        count: 0,
        results: [],
        message: "Please select at least one ingredient."
      });
    }

    // Only lunch recipes
    const lunchRecipes = recipes.filter((recipe) => {
      return (
        !recipe.meal ||
        String(recipe.meal).toLowerCase() === "lunch"
      );
    });

    // Use KMP + Dynamic Programming + pantry logic
    const results = getMatches(
      lunchRecipes,
      selectedIngredients
    );

    res.json({
      count: results.length,
      results: results
    });

  } catch (error) {
    console.error(
      "Recipe search error:",
      error
    );

    res.status(500).json({
      count: 0,
      results: [],
      message: "Error while searching recipes.",
      error: error.message
    });
  }
});

/* =========================
   START SERVER
========================= */
app.get("/api/recipes/category/:category", (req, res) => {

  const category = decodeURIComponent(req.params.category);

  const categoryRecipes = recipes.filter(
    (recipe) => recipe.category === category
  );

  res.json({
    results: categoryRecipes
  });

});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});