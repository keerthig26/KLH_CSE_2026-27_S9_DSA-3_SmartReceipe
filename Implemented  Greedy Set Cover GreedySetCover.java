
    
import java.util.*;

public class GreedySetCover {

    static class Recipe {
        int id;
        String name;
        Set<String> ingredients;

        Recipe(int id, String name, Set<String> ingredients) {
            this.id = id;
            this.name = name;
            this.ingredients = ingredients;
        }
    }

    static class SelectedRecipe {
        int id;
        String name;
        int gain;

        SelectedRecipe(int id, String name, int gain) {
            this.id = id;
            this.name = name;
            this.gain = gain;
        }
    }

    /*
     * Greedy Set Cover:
     *
     * 1. Start with all user-selected ingredients uncovered.
     * 2. Find the recipe covering the largest number of uncovered ingredients.
     * 3. Select that recipe.
     * 4. Mark those ingredients as covered.
     * 5. Repeat until everything is covered or no recipe can add coverage.
     */
    public static List<SelectedRecipe> greedySetCover(
            Set<String> userIngredients,
            List<Recipe> recipes) {

        Set<String> uncovered = new HashSet<>(userIngredients);

        List<SelectedRecipe> selectedRecipes = new ArrayList<>();

        Set<Integer> alreadySelected = new HashSet<>();

        while (!uncovered.isEmpty()) {

            Recipe bestRecipe = null;
            Set<String> bestCovered = new HashSet<>();

            // Find the recipe with the largest uncovered gain
            for (Recipe recipe : recipes) {

                if (alreadySelected.contains(recipe.id)) {
                    continue;
                }

                Set<String> coveredByRecipe = new HashSet<>(recipe.ingredients);

                coveredByRecipe.retainAll(uncovered);

                if (coveredByRecipe.size() > bestCovered.size()) {
                    bestCovered = coveredByRecipe;
                    bestRecipe = recipe;
                }
            }

            // No recipe can cover anything else
            if (bestRecipe == null || bestCovered.isEmpty()) {
                break;
            }

            // Select the best recipe
            selectedRecipes.add(
                    new SelectedRecipe(
                            bestRecipe.id,
                            bestRecipe.name,
                            bestCovered.size()
                    )
            );

            alreadySelected.add(bestRecipe.id);

            // Remove newly covered ingredients
            uncovered.removeAll(bestCovered);
        }

        return selectedRecipes;
    }

    public static void main(String[] args) {

        // Ingredients selected by the user
        Set<String> userIngredients = new HashSet<>(
                Arrays.asList(
                        "tomato",
                        "onion",
                        "potato",
                        "spinach"
                )
        );

        // Example recipes
        List<Recipe> recipes = new ArrayList<>();

        recipes.add(
                new Recipe(
                        1,
                        "Potato Fry",
                        new HashSet<>(
                                Arrays.asList(
                                        "potato",
                                        "onion",
                                        "tomato"
                                )
                        )
                )
        );

        recipes.add(
                new Recipe(
                        2,
                        "Spinach Curry",
                        new HashSet<>(
                                Arrays.asList(
                                        "spinach",
                                        "onion"
                                )
                        )
                )
        );

        recipes.add(
                new Recipe(
                        3,
                        "Tomato Curry",
                        new HashSet<>(
                                Arrays.asList(
                                        "tomato",
                                        "onion"
                                )
                        )
                )
        );

        // Run Greedy Set Cover
        List<SelectedRecipe> result =
                greedySetCover(userIngredients, recipes);

        System.out.println("Selected Recipes:");

        for (SelectedRecipe recipe : result) {
            System.out.println(
                    "Recipe: " + recipe.name +
                    " | ID: " + recipe.id +
                    " | Coverage Gain: " + recipe.gain
            );
        }
    }
}
