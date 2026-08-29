/**
 * Recipe.java
 * Simple data model for one recipe in the corpus.
 * Deliberately kept as plain arrays (no java.util collections) so that
 * every data structure used in this module is hand-built, in line with
 * the DSA-3 course rule against relying on java.util for the core engine.
 */
public class Recipe {
    String name;
    String[] ingredients;
    String instructions;

    public Recipe(String name, String[] ingredients, String instructions) {
        this.name = name;
        this.ingredients = ingredients;
        this.instructions = instructions;
    }

    /**
     * Returns all ingredients concatenated into a single lowercase,
     * comma-separated string. This is the "text" the KMP matcher searches
     * against when checking whether a user's ingredient is present.
     */
    public String ingredientsText() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < ingredients.length; i++) {
            sb.append(ingredients[i].toLowerCase());
            if (i < ingredients.length - 1) sb.append(", ");
        }
        return sb.toString();
    }
}
