# Smart Recipe — String Matching Module (Review-2)

This module implements the **KMP (Knuth-Morris-Pratt)** pattern-matching
algorithm and wires it into the Smart Recipe ingredient search — the piece
of the project that maps to **CO2 / Module M2** in your DSA-3 syllabus
("apply linear-time string algorithms ... to solve large-scale
pattern-matching problems").

## Files

| File | Role |
|---|---|
| `Recipe.java` | Plain data model for one recipe (name, ingredients, instructions). |
| `KMPMatcher.java` | The algorithm: `computeLPS()` (failure function) + `search()` (KMP scan). No `java.util` used. |
| `RecipeCorpus.java` | 12-recipe sample dataset + a small ingredient-substitution table. Swap this for your real corpus later. |
| `SmartRecipeSearch.java` | Driver: takes a list of on-hand ingredients, scores every recipe with KMP, ranks and prints the top 3, and falls back to substitution suggestions when nothing matches. |

## How it works

1. Each recipe's ingredient list is flattened into one lowercase string
   (`Recipe.ingredientsText()`).
2. For every ingredient the user has, `KMPMatcher.contains()` runs a full
   KMP search of that ingredient against each recipe's text.
3. Recipes are ranked by match count using a hand-built selection sort
   (kept array-based on purpose — no `Collections.sort`).
4. If a query scores zero everywhere, the substitution table is searched
   (also via KMP) to suggest a stand-in ingredient.

## Complexity (what to say in your review)

- `computeLPS(pattern)`: **O(m)**, where m = pattern length.
- `search(text, pattern)`: **O(n + m)**, where n = text length — this is
  the headline result over the naive O(n·m) approach, and is exactly what
  CO2 asks you to demonstrate.
- Per query: O(R · (K_avg + I)) where R = number of recipes, K_avg =
  average length of a recipe's ingredient text, I = number of user
  ingredients — each an O(K_avg) KMP call.
- Ranking: O(R²) selection sort (fine at this corpus size; swap to a
  heap or merge sort if the corpus grows large enough to matter).

## Running it

```bash
javac *.java
java SmartRecipeSearch
```

It prints 6 built-in demo queries (including a deliberate no-match case
to exercise the substitution fallback), then optionally reads one more
ingredient list from stdin.

## Extending toward your real corpus

Replace `RecipeCorpus.getSampleRecipes()` with a loader that reads your
actual recipe data file (CSV/JSON/DB) into `Recipe[]`. Nothing in
`KMPMatcher` or `SmartRecipeSearch` needs to change — they only depend on
`Recipe.ingredientsText()` returning a string to search.

Natural next additions for later reviews, per your syllabus's module
sequence:
- **Rabin-Karp** as a second matcher to compare average-case performance.
- **Z-function** for fast prefix-based ingredient auto-complete.
- **Edit distance (Levenshtein)** for fuzzy ingredient matching, e.g. so
  "tomatoe" still matches "tomato" (this is CO3/M3 territory).
