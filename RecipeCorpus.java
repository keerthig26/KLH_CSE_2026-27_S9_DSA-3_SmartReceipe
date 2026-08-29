/**
 * RecipeCorpus.java
 * Sample recipe dataset standing in for your project's real corpus.
 * Swap getSampleRecipes() out for a file/DB loader once you wire in
 * your actual data -- everything downstream (KMPMatcher, SmartRecipeSearch)
 * only depends on the Recipe[] shape, so nothing else needs to change.
 */
public class RecipeCorpus {

    /**
     * Basic pantry items assumed to always be on hand (so the user doesn't
     * have to type "salt, oil, water" every time). These count as "have"
     * automatically when checking a recipe's requirements.
     */
    public static String[] getPantryStaples() {
        return new String[]{"salt", "oil", "olive oil", "water", "pepper", "sugar", "spices"};
    }

    public static Recipe[] getSampleRecipes() {
        Recipe[] recipes = new Recipe[15];

        recipes[0] = new Recipe(
            "Margherita Pizza",
            new String[]{"flour", "tomato", "mozzarella", "basil", "olive oil", "salt"},
            "Knead the dough, spread tomato sauce, top with mozzarella and basil, bake at 250C for 12 minutes."
        );
        recipes[1] = new Recipe(
            "Paneer Butter Masala",
            new String[]{"paneer", "tomato", "butter", "cream", "onion", "garlic", "spices"},
            "Saute onion and garlic, add tomato puree and spices, simmer, stir in cream, add paneer cubes."
        );
        recipes[2] = new Recipe(
            "Egg Fried Rice",
            new String[]{"rice", "egg", "soy sauce", "spring onion", "garlic", "oil"},
            "Scramble egg, saute garlic, add cooked rice and soy sauce, toss with spring onion."
        );
        recipes[3] = new Recipe(
            "Classic Tomato Pasta",
            new String[]{"pasta", "tomato", "garlic", "olive oil", "basil", "salt"},
            "Boil pasta, saute garlic in olive oil, add tomato, simmer into a sauce, toss with pasta and basil."
        );
        recipes[4] = new Recipe(
            "Chocolate Chip Cookies",
            new String[]{"flour", "sugar", "butter", "egg", "chocolate", "baking soda"},
            "Cream butter and sugar, mix in egg, fold in flour and chocolate chips, bake at 180C for 10 minutes."
        );
        recipes[5] = new Recipe(
            "Vegetable Stir Fry",
            new String[]{"broccoli", "carrot", "bell pepper", "soy sauce", "garlic", "oil"},
            "Heat oil, stir fry garlic then vegetables on high heat, finish with soy sauce."
        );
        recipes[6] = new Recipe(
            "Caprese Salad",
            new String[]{"tomato", "mozzarella", "basil", "olive oil", "salt"},
            "Slice tomato and mozzarella, layer with basil leaves, drizzle olive oil and salt."
        );
        recipes[7] = new Recipe(
            "Chicken Curry",
            new String[]{"chicken", "onion", "tomato", "garlic", "ginger", "spices"},
            "Saute onion, ginger and garlic, add tomato and spices, add chicken, simmer until cooked."
        );
        recipes[8] = new Recipe(
            "Masala Dosa",
            new String[]{"rice", "urad dal", "potato", "onion", "mustard seeds"},
            "Ferment rice and urad dal batter, spread thin on a griddle, fill with spiced potato-onion mash."
        );
        recipes[9] = new Recipe(
            "Banana Pancakes",
            new String[]{"flour", "banana", "egg", "milk", "sugar", "baking soda"},
            "Mash banana, whisk with egg and milk, fold in flour and sugar, cook on a griddle."
        );
        recipes[10] = new Recipe(
            "Garlic Butter Shrimp",
            new String[]{"shrimp", "butter", "garlic", "lemon", "parsley"},
            "Melt butter, saute garlic, add shrimp until pink, finish with lemon and parsley."
        );
        recipes[11] = new Recipe(
            "Vegetable Khichdi",
            new String[]{"rice", "lentils", "carrot", "peas", "turmeric", "ghee"},
            "Pressure cook rice, lentils and vegetables with turmeric, finish with a spoon of ghee."
        );
        recipes[12] = new Recipe(
            "Tomato Onion Garlic Saute",
            new String[]{"tomato", "onion", "garlic", "oil", "salt"},
            "Heat oil, saute chopped garlic and onion until golden, add tomato, cook until soft and pulpy. "
            + "Great as a base for curries or as a simple side."
        );
        recipes[13] = new Recipe(
            "Garlic Toast",
            new String[]{"bread", "garlic", "butter", "salt"},
            "Mash garlic into softened butter with a pinch of salt, spread on bread, toast until golden."
        );
        recipes[14] = new Recipe(
            "Onion Tomato Egg Bhurji",
            new String[]{"egg", "onion", "tomato", "oil", "salt"},
            "Heat oil, saute onion until soft, add tomato and cook down, pour in beaten eggs and scramble until set."
        );

        return recipes;
    }

    /**
     * A small substitution table: {missingIngredientKeywords, suggestion}.
     * Used when a user's requested ingredient isn't found anywhere in the
     * corpus, so the system can still be helpful.
     */
    public static String[][] getSubstitutions() {
        return new String[][]{
            {"buttermilk", "milk mixed with a spoon of lemon juice"},
            {"cream",      "milk simmered with a little extra butter"},
            {"soy sauce",  "salt water with a dash of vinegar"},
            {"egg",        "mashed banana or a flax egg (for baking)"},
            {"paneer",     "firm tofu"},
            {"basil",      "oregano"},
            {"urad dal",   "split yellow moong dal"},
        };
    }
}
