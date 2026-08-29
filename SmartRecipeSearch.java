import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * SmartRecipeSearch.java
 * Review-2 demo: given a set of ingredients the user has on hand, rank
 * recipes in the corpus by how many of those ingredients they use, using
 * KMPMatcher (hand-built KMP) instead of String.contains()/indexOf() for
 * the actual pattern search. If nothing matches well, it falls back to a
 * substitution table -- also searched with KMP.
 *
 * Note: BufferedReader/InputStreamReader are java.io, not java.util, so
 * they're used here only for optional live console input; no java.util
 * class (ArrayList, HashMap, Arrays, Collections, ...) is used anywhere
 * in this project -- all storage and sorting below is hand-built on
 * plain arrays.
 */
public class SmartRecipeSearch {

    public static void main(String[] args) throws IOException {
        Recipe[] recipes = RecipeCorpus.getSampleRecipes();
        String[][] substitutions = RecipeCorpus.getSubstitutions();
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        System.out.println("=== Smart Recipe Search (KMP-powered ingredient matching) ===\n");

        while (true) {
            System.out.print("Enter the ingredients you have, excluding spices (comma-separated), or 'exit' to quit: ");
            String line = br.readLine();
            if (line == null || line.trim().equalsIgnoreCase("exit")) {
                System.out.println("Goodbye!");
                break;
            }
            if (line.trim().length() == 0) {
                continue;
            }
            runQuery(recipes, substitutions, splitAndClean(line));
        }
    }

    /** Splits "a, b, c" into a cleaned, lowercase array of ingredient names. */
    private static String[] splitAndClean(String line) {
        String[] parts = line.split(",");
        for (int i = 0; i < parts.length; i++) {
            parts[i] = parts[i].trim().toLowerCase();
        }
        return parts;
    }

    /**
     * Runs one search: for every recipe, works out which of its required
     * ingredients the user already has and which are still missing (both
     * checks done with KMP against the user's ingredient list). Ranks
     * recipes by fewest missing ingredients first (closest to something
     * you can cook right now), then by how many required ingredients you
     * already have.
     */
    private static void runQuery(Recipe[] recipes, String[][] substitutions, String[] userIngredients) {
        String userText = joinArray(userIngredients).toLowerCase(); // one KMP haystack of what you have
        String pantryText = joinArray(RecipeCorpus.getPantryStaples()).toLowerCase(); // always-on-hand basics

        int n = recipes.length;
        int[] missingCount = new int[n];
        int[] haveCount = new int[n];
        String[][] missingList = new String[n][];

        for (int r = 0; r < n; r++) {
            Recipe rec = recipes[r];
            String[] req = rec.ingredients;
            int have = 0;
            String[] missingScratch = new String[req.length];
            int missN = 0;
            for (String need : req) {
                String needLower = need.toLowerCase();
                // A required item counts as "have" if the user typed it,
                // OR it's a basic pantry staple (salt, oil, water, ...).
                boolean userHasIt = KMPMatcher.contains(userText, needLower);
                boolean isPantryStaple = KMPMatcher.contains(pantryText, needLower);
                if (userHasIt || isPantryStaple) {
                    have++;
                } else {
                    missingScratch[missN++] = need;
                }
            }
            String[] missing = new String[missN];
            for (int k = 0; k < missN; k++) missing[k] = missingScratch[k];

            haveCount[r] = have;
            missingCount[r] = missN;
            missingList[r] = missing;
        }

        // Rank: fewest missing ingredients first, ties broken by most matched.
        int[] order = new int[n];
        for (int i = 0; i < n; i++) order[i] = i;
        for (int i = 0; i < n; i++) {
            int best = i;
            for (int j = i + 1; j < n; j++) {
                int oj = order[j], ob = order[best];
                boolean better = missingCount[oj] < missingCount[ob]
                        || (missingCount[oj] == missingCount[ob] && haveCount[oj] > haveCount[ob]);
                if (better) best = j;
            }
            int tmp = order[i];
            order[i] = order[best];
            order[best] = tmp;
        }

        int top = order[0];
        if (haveCount[top] == 0) {
            System.out.println("No recipe uses any of those ingredients. Checking substitutions...");
            suggestSubstitutions(userIngredients, substitutions);
            System.out.println();
            return;
        }

        Recipe best = recipes[top];
        System.out.println();
        System.out.println("Recipe: " + best.name);
        System.out.println("Ingredients: " + joinArray(best.ingredients));
        if (missingCount[top] > 0) {
            System.out.println("You'll also need: " + joinArray(missingList[top]));
        }
        System.out.println("Procedure: " + best.instructions);
        System.out.println();
    }

    /** Uses KMP to check each user ingredient against the substitution keys. */
    private static void suggestSubstitutions(String[] userIngredients, String[][] substitutions) {
        boolean any = false;
        for (String ing : userIngredients) {
            for (String[] sub : substitutions) {
                if (KMPMatcher.contains(sub[0].toLowerCase(), ing.toLowerCase())) {
                    System.out.println("    Try substituting '" + ing + "' with: " + sub[1]);
                    any = true;
                }
            }
        }
        if (!any) {
            System.out.println("    No substitution on file for these ingredients either.");
        }
    }

    private static String joinArray(String[] arr) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < arr.length; i++) {
            sb.append(arr[i]);
            if (i < arr.length - 1) sb.append(", ");
        }
        return sb.toString();
    }
}
