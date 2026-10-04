import { useState } from "react";
import "./App.css";

const ingredientOptions = [
  "rice",
  "basmati rice",
  "toor dal",
  "moong dal",
  "masoor dal",
  "chana dal",
  "gram flour",
  "semolina",
  "poha",
  "tomato",
  "onion",
  "potato",
  "carrot",
  "peas",
  "beans",
  "spinach",
  "cauliflower",
  "capsicum",
  "cabbage",
  "brinjal",
  "mushroom",
  "corn",
  "drumstick",
  "fenugreek leaves",
  "bottle gourd",
  "okra",
  "gongura leaves",
  "pumpkin",
  "raw mango",
  "coconut",
  "mint",
  "coriander leaves",
  "green chilli",
  "lemon",
  "tamarind",
  "ginger",
  "garlic",
  "peanuts",
  "sesame seeds",
  "egg",
  "chicken",
  "paneer",
  "yogurt",
  "curd",
  "black pepper",
  "cumin"
];

function getSubstitution(ingredient) {
  const substitutions = {
    brinjal: "zucchini",
    tomato: "tamarind",
    onion: "shallots",
    potato: "sweet potato",
    peas: "corn or beans",
    spinach: "fenugreek leaves",
    cauliflower: "cabbage",
    cabbage: "cauliflower",
    capsicum: "beans",
    carrot: "peas",
    beans: "peas",
    corn: "peas",
    mint: "coriander leaves",
    "coriander leaves": "mint",
    "green chilli": "red chilli powder",
    lemon: "tamarind",
    tamarind: "lemon",
    ginger: "ginger paste",
    garlic: "garlic paste",
    coconut: "coconut milk",
    "toor dal": "moong dal",
    "moong dal": "toor dal",
    "masoor dal": "moong dal",
    "chana dal": "toor dal",
    semolina: "rice flour",
    poha: "rice",
    "basmati rice": "regular rice",
    "gram flour": "rice flour",
    yogurt: "curd",
    curd: "yogurt",
    paneer: "tofu",
    mushroom: "paneer",
    egg: "paneer",
    chicken: "paneer",
    drumstick: "beans",
    "fenugreek leaves": "spinach",
    "black pepper": "red chilli powder",
    cumin: "coriander powder",
    "bottle gourd": "pumpkin",
    okra: "brinjal",
    "gongura leaves": "spinach",
    pumpkin: "bottle gourd",
    "raw mango": "lemon",
    peanuts: "cashews",
    "sesame seeds": "peanuts"
  };

  return substitutions[ingredient] || "a similar ingredient";
}

function RecipeCard({ recipe, onView, categoryMode }) {
  return (
    <div className="recipe-card">
      <div className="match-badge">
        {categoryMode
          ? "Category Recipe"
          : `${recipe.matchPercentage || 0}% Match`}
      </div>

      <div className="recipe-card-body">
        <p className="recipe-category">
          {recipe.category || "Indian Lunch"}
        </p>

        <h3>{recipe.name}</h3>

        <p className="recipe-region">
          {recipe.region || "Indian"}
        </p>

        <div className="recipe-info">
          <span>⏱ {recipe.cookingTime || 0} min</span>
          <span>{recipe.difficulty || "Easy"}</span>
          <span>👥 {recipe.servings || 2}</span>
        </div>

        <div className="recipe-ingredients">
          <strong>Ingredients matched:</strong>

          <div className="mini-tags">
            {categoryMode ? (
              <span>Category recipe</span>
            ) : recipe.matchedIngredients &&
              recipe.matchedIngredients.length > 0 ? (
              recipe.matchedIngredients.map((ingredient, index) => (
                <span key={index}>{ingredient}</span>
              ))
            ) : (
              <span>None</span>
            )}
          </div>
        </div>

        {!categoryMode &&
        recipe.missingIngredients &&
        recipe.missingIngredients.length > 0 ? (
          <div className="missing-box">
            <strong>Missing:</strong>{" "}
            {recipe.missingIngredients.join(", ")}
          </div>
        ) : null}

        <button
          type="button"
          className="details-button"
          onClick={onView}
        >
          View Recipe
        </button>
      </div>
    </div>
  );
}

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [categoryMode, setCategoryMode] = useState(false);

  function toggleIngredient(ingredient) {
    setSelectedIngredients((current) => {
      if (current.includes(ingredient)) {
        return current.filter((item) => item !== ingredient);
      }

      return [...current, ingredient];
    });

    setError("");
  }

  function clearAll() {
    setSelectedIngredients([]);
    setRecipes([]);
    setSearched(false);
    setError("");
    setSelectedRecipe(null);
    setCategoryMode(false);
  }

  async function findRecipes(
    ingredientsToSearch = selectedIngredients
  ) {
    setCategoryMode(false);

    if (ingredientsToSearch.length === 0) {
      setError("Please select at least one ingredient.");
      setRecipes([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    setError("");
    setRecipes([]);
    setSelectedRecipe(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/recipes/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ingredients: ingredientsToSearch
          })
        }
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      if (Array.isArray(data.results)) {
        setRecipes(data.results);
      } else {
        setRecipes([]);
        setError("No recipe results were returned.");
      }
    } catch (err) {
      console.error(err);
      setRecipes([]);
      setError(
        "Could not connect to the backend. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  async function searchCategoryByName(category) {
    setCategoryMode(true);
    setLoading(true);
    setSearched(true);
    setError("");
    setRecipes([]);
    setSelectedRecipe(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/category/${encodeURIComponent(
          category
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to load category recipes");
      }

      const data = await response.json();

      setRecipes(data.results || []);

      setTimeout(() => {
        document
          .getElementById("recipes")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setRecipes([]);
      setError("Could not load category recipes.");
    } finally {
      setLoading(false);
    }
  }

  const canCookRecipes = recipes.filter(
    (recipe) =>
      !recipe.missingIngredients ||
      recipe.missingIngredients.length === 0
  );

  const missingRecipes = recipes.filter(
    (recipe) =>
      recipe.missingIngredients &&
      recipe.missingIngredients.length > 0
  );

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span>Smart Recipe DSA</span>

          <small
            style={{
              display: "block",
              fontSize: "11px",
              marginTop: "3px"
            }}
          >
            Dish Selection Assistant
          </small>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#finder">Recipe Finder</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="small-title">
            SMART INDIAN LUNCH FINDER
          </p>

          <h1>
            Find the perfect
            <br />
            lunch from what
            <br />
            you already have.
          </h1>

          <p className="hero-text">
            Select the ingredients available in your kitchen and
            discover delicious Indian lunch recipes.
          </p>

          <a href="#finder" className="hero-button">
            Find My Lunch
          </a>
        </div>

        <div className="hero-image-container">
          <img
           src="/biryani.png"
  alt="Biryani"
          />
        </div>
      </section>

      <section className="search-section" id="finder">
        <div className="section-heading">
          <p className="small-title">RECIPE FINDER</p>

          <h2>What ingredients do you have?</h2>

          <p>
            Click the ingredients available in your kitchen.
            No typing is required.
          </p>
        </div>

        <div className="ingredient-selection">
          <h3>Select Ingredients</h3>

          <div className="ingredient-grid">
            {ingredientOptions.map((ingredient) => {
              const isSelected =
                selectedIngredients.includes(ingredient);

              return (
                <button
                  key={ingredient}
                  type="button"
                  className={
                    isSelected
                      ? "ingredient-button selected"
                      : "ingredient-button"
                  }
                  onClick={() => toggleIngredient(ingredient)}
                >
                  {isSelected ? "✓ " : ""}
                  {ingredient}
                </button>
              );
            })}
          </div>
        </div>

        <div className="selected-box">
          <h3>Your Selected Ingredients</h3>

          {selectedIngredients.length === 0 ? (
            <p className="empty-text">
              No ingredients selected yet. Click the ingredients above.
            </p>
          ) : (
            <div className="selected-list">
              {selectedIngredients.map((ingredient) => (
                <span className="selected-chip" key={ingredient}>
                  {ingredient}

                  <button
                    type="button"
                    onClick={() => toggleIngredient(ingredient)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="ingredient-help">
          Oil, butter, salt and common pantry spices are already
          considered available.
        </p>

        {error && (
          <div className="message-box error-box">
            <p>{error}</p>
          </div>
        )}

        <div className="search-actions">
          <button
            type="button"
            className="find-button"
            onClick={() => findRecipes()}
            disabled={
              loading || selectedIngredients.length === 0
            }
          >
            {loading ? "Finding Recipes..." : "Find My Lunch"}
          </button>

          <button
            type="button"
            className="clear-button"
            onClick={clearAll}
          >
            Clear All
          </button>
        </div>
      </section>

      {searched && (
        <section className="results-section" id="recipes">
          <div className="section-heading">
            <p className="small-title">
              {categoryMode ? "EXPLORE RECIPES" : "YOUR RESULTS"}
            </p>

            <h2>
              {categoryMode
                ? "Category Recipes"
                : "Recipes for You"}
            </h2>

            {!loading && !error && recipes.length > 0 && (
              <p className="result-count">
                {recipes.length} recipes found
              </p>
            )}
          </div>

          {loading && (
            <div className="message-box">
              <h3>Finding recipes...</h3>
              <p>Matching your selected ingredients.</p>
            </div>
          )}

          {!loading && !error && recipes.length === 0 && (
            <div className="message-box">
              <h3>No matching recipes found</h3>

              <p>
                Try selecting a few more ingredients and search again.
              </p>
            </div>
          )}

          {!loading &&
            !categoryMode &&
            canCookRecipes.length > 0 && (
              <div className="recipe-result-group">
                <div className="result-group-heading">
                  <h3>✅ Can Cook Now</h3>

                  <p>
                    You already have everything needed for these recipes.
                  </p>
                </div>

                <div className="recipe-grid">
                  {canCookRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      categoryMode={false}
                      onView={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              </div>
            )}

          {!loading &&
            !categoryMode &&
            missingRecipes.length > 0 && (
              <div className="recipe-result-group missing-results">
                <div className="result-group-heading">
                  <h3>🟡 Missing Ingredients</h3>

                  <p>
                    These recipes need a few additional ingredients.
                  </p>
                </div>

                <div className="recipe-grid">
                  {missingRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      categoryMode={false}
                      onView={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              </div>
            )}

          {!loading && categoryMode && recipes.length > 0 && (
            <div className="recipe-result-group">
              <div className="recipe-grid">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    categoryMode={true}
                    onView={() => setSelectedRecipe(recipe)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="info-section" id="categories">
        <p className="small-title">EXPLORE</p>

        <h2>Lunch Categories</h2>

        <div className="category-grid">
          <button
            type="button"
            className="category-card"
            onClick={() =>
              searchCategoryByName("Rice & Pulao")
            }
          >
            Rice Recipes
          </button>

          <button
            type="button"
            className="category-card"
            onClick={() =>
              searchCategoryByName("Dal, Sambar & Rasam")
            }
          >
            Dal Recipes
          </button>

          <button
            type="button"
            className="category-card"
            onClick={() =>
              searchCategoryByName("Vegetable Curries")
            }
          >
            Vegetable Recipes
          </button>

          <button
            type="button"
            className="category-card"
            onClick={() =>
              searchCategoryByName("Egg Recipes")
            }
          >
            Egg Recipes
          </button>

          <button
            type="button"
            className="category-card"
            onClick={() =>
              searchCategoryByName("Chicken Recipes")
            }
          >
            Chicken Recipes
          </button>

         
        </div>
      </section>

      <section className="about-section" id="about">
        <p className="small-title">ABOUT THE PROJECT</p>

        <h2>Smart Recipe DSA</h2>

        <p>
          Smart Recipe DSA helps users find Indian lunch recipes using
          the ingredients available in their kitchen.
        </p>

        <p>
          Users can select ingredients, explore suitable recipes, and
          see which ingredients are available or missing.
        </p>

        <p>
          The app makes recipe selection simple, quick, and convenient.
        </p>
      </section>

      <footer>
        Smart Recipe DSA © 2026
      </footer>

      {selectedRecipe && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="recipe-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close-button"
              onClick={() => setSelectedRecipe(null)}
            >
              ×
            </button>

            <p className="recipe-category">
              {selectedRecipe.category || "Indian Lunch"}
            </p>

            <h2>{selectedRecipe.name}</h2>

            <p className="recipe-region">
              {selectedRecipe.region || "Indian"}
            </p>

            <div className="modal-stats">
              <span>
                Match: {selectedRecipe.matchPercentage || 0}%
              </span>

              <span>
                ⏱ {selectedRecipe.cookingTime || 0} min
              </span>

              <span>
                {selectedRecipe.difficulty || "Easy"}
              </span>

              <span>
                👥 Serves {selectedRecipe.servings || 2}
              </span>
            </div>

            <div className="modal-section">
              <h3>Ingredients</h3>

              <div className="modal-ingredients">
                {selectedRecipe.ingredients &&
                  selectedRecipe.ingredients.map(
                    (ingredient, index) => (
                      <span key={index}>{ingredient}</span>
                    )
                  )}
              </div>
            </div>

            {!categoryMode &&
              selectedRecipe.missingIngredients &&
              selectedRecipe.missingIngredients.length > 0 && (
                <div className="modal-section">
                  <div className="missing-box">
                    <strong>Missing Ingredients:</strong>

                    <p>
                      {selectedRecipe.missingIngredients.join(", ")}
                    </p>
                  </div>
                </div>
              )}

            {!categoryMode &&
              selectedRecipe.missingIngredients &&
              selectedRecipe.missingIngredients.length > 0 && (
                <div className="modal-section">
                  <h3>Possible Substitutions</h3>

                  {selectedRecipe.missingIngredients.map(
                    (ingredient, index) => (
                      <div
                        className="substitution-row"
                        key={index}
                      >
                        <strong>{ingredient}</strong>

                        <span>→</span>

                        <span>
                          {getSubstitution(ingredient)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}

            {selectedRecipe.nutrition && (
              <div className="modal-section">
                <h3>Nutrition</h3>

                <div className="nutrition-grid">
                  {Object.entries(selectedRecipe.nutrition).map(
                    ([key, value]) => (
                      <div key={key}>
                        <strong>{key}</strong>
                        <span>{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {selectedRecipe.steps &&
              selectedRecipe.steps.length > 0 && (
                <div className="modal-section">
                  <h3>Cooking Steps</h3>

                  <ol className="steps-list">
                    {selectedRecipe.steps.map((step, index) => (
                      <li key={index}>
                        <span className="step-number">
                          {index + 1}
                        </span>

                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;