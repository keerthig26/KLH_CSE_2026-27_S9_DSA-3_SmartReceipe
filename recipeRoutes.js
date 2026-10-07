const express = require("express");
const router = express.Router();

const recipes = require("../data/recipes.json");
const { getMatches } = require("../services/recipeMatcher");

router.get("/", (req, res) => {
    res.json(recipes);
});

router.get("/:id", (req, res) => {
    const recipe = recipes.find(
        r => r.id === Number(req.params.id)
    );

    if (!recipe) {
        return res.status(404).json({
            message: "Recipe not found"
        });
    }

    res.json(recipe);
});

router.post("/search", (req, res) => {
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({
            message: "Please provide ingredients as an array."
        });
    }

    const results = getMatches(ingredients, recipes);

    res.json({
        count: results.length,
        results: results
    });
});

module.exports = router;