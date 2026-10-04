const pantryIngredients = [
  "salt",
  "oil",
  "water",
  "turmeric",
  "red chilli powder",
  "cumin powder",
  "garam masala",
  "coriander powder",
  "mustard seeds",
  "cumin seeds",
  "hing",
  "pepper",
  "black pepper",
  "sugar"
];

/* =======================================================
   COMMON HELPERS
======================================================= */

function normalizeIngredient(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeList(list) {
  return (list || [])
    .map(normalizeIngredient)
    .filter(Boolean);
}

function getAvailableIngredients(userIngredients) {
  const selected = normalizeList(userIngredients);

  return [...new Set([
    ...selected,
    ...pantryIngredients
  ])];
}

/* =======================================================
   CORE INGREDIENT CHECK
======================================================= */

function isCoreIngredientAvailable(recipe, available) {
  const coreIngredients = normalizeList(
    recipe.coreIngredients || recipe.ingredients || []
  );

  return coreIngredients.every((ingredient) =>
    available.includes(ingredient)
  );
}

/* =======================================================
   CO2 - KMP STRING MATCHING
======================================================= */

function buildLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);

  let length = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[length]) {
      length++;
      lps[i] = length;
      i++;
    } else if (length > 0) {
      length = lps[length - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }

  return lps;
}

function kmpSearch(text, pattern) {
  text = normalizeIngredient(text);
  pattern = normalizeIngredient(pattern);

  if (!pattern) return true;
  if (!text) return false;

  const lps = buildLPS(pattern);

  let i = 0;
  let j = 0;

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;

      if (j === pattern.length) {
        return true;
      }
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }

  return false;
}

function runKMP(userIngredients, recipes) {
  const user = normalizeList(userIngredients);
  const result = {};

  for (const recipe of recipes) {
    const ingredients = normalizeList(
      recipe.ingredients || []
    );

    let matchedCount = 0;

    for (const userIngredient of user) {
      const found = ingredients.some((ingredient) =>
        kmpSearch(ingredient, userIngredient)
      );

      if (found) {
        matchedCount++;
      }
    }

    result[recipe.id] = matchedCount;
  }

  return result;
}

/* =======================================================
   CO3 - DYNAMIC PROGRAMMING
======================================================= */

function runDP(userIngredients, recipes) {
  const user = normalizeList(userIngredients);
  const result = {};

  for (const recipe of recipes) {
    const ingredients = normalizeList(
      recipe.ingredients || []
    );

    const m = user.length;
    const n = ingredients.length;

    const dp = Array.from(
      { length: m + 1 },
      () => new Array(n + 1).fill(0)
    );

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (
          kmpSearch(
            ingredients[j - 1],
            user[i - 1]
          ) ||
          kmpSearch(
            user[i - 1],
            ingredients[j - 1]
          )
        ) {
          dp[i][j] =
            dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(
            dp[i - 1][j],
            dp[i][j - 1]
          );
        }
      }
    }

    result[recipe.id] = dp[m][n];
  }

  return result;
}

/* =======================================================
   CO4 - DINIC'S MAXIMUM FLOW
======================================================= */

class FlowEdge {
  constructor(to, rev, capacity) {
    this.to = to;
    this.rev = rev;
    this.capacity = capacity;
  }
}

function addFlowEdge(
  graph,
  from,
  to,
  capacity
) {
  const forward = new FlowEdge(
    to,
    graph[to].length,
    capacity
  );

  const backward = new FlowEdge(
    from,
    graph[from].length,
    0
  );

  graph[from].push(forward);
  graph[to].push(backward);
}

function dinicMaxFlow(
  graph,
  source,
  sink
) {
  let maxFlow = 0;

  while (true) {
    const level = new Array(
      graph.length
    ).fill(-1);

    const queue = [source];

    level[source] = 0;

    for (
      let head = 0;
      head < queue.length;
      head++
    ) {
      const node = queue[head];

      for (const edge of graph[node]) {
        if (
          edge.capacity > 0 &&
          level[edge.to] === -1
        ) {
          level[edge.to] =
            level[node] + 1;

          queue.push(edge.to);
        }
      }
    }

    if (level[sink] === -1) {
      break;
    }

    const work = new Array(
      graph.length
    ).fill(0);

    function sendFlow(node, flow) {
      if (node === sink) {
        return flow;
      }

      for (
        let i = work[node];
        i < graph[node].length;
        i++, work[node]++
      ) {
        const edge = graph[node][i];

        if (
          edge.capacity > 0 &&
          level[edge.to] ===
            level[node] + 1
        ) {
          const currentFlow =
            Math.min(
              flow,
              edge.capacity
            );

          const pushed = sendFlow(
            edge.to,
            currentFlow
          );

          if (pushed > 0) {
            edge.capacity -= pushed;

            graph[edge.to][
              edge.rev
            ].capacity += pushed;

            return pushed;
          }
        }
      }

      return 0;
    }

    while (true) {
      const flow = sendFlow(
        source,
        Number.MAX_SAFE_INTEGER
      );

      if (flow === 0) {
        break;
      }

      maxFlow += flow;
    }
  }

  return maxFlow;
}

function runDinicForRecipe(
  recipe,
  available
) {
  const recipeIngredients =
    normalizeList(
      recipe.ingredients || []
    );

  const requiredIngredients = [
    ...new Set(recipeIngredients)
  ];

  const ingredientCount =
    requiredIngredients.length;

  const source = 0;

  const ingredientStart = 1;

  const recipeStart =
    ingredientStart + ingredientCount;

  const sink =
    recipeStart + ingredientCount;

  const graph = Array.from(
    { length: sink + 1 },
    () => []
  );

  for (
    let i = 0;
    i < requiredIngredients.length;
    i++
  ) {
    const ingredient =
      requiredIngredients[i];

    const ingredientNode =
      ingredientStart + i;

    const recipeNode =
      recipeStart + i;

    addFlowEdge(
      graph,
      source,
      ingredientNode,
      1
    );

    if (available.includes(ingredient)) {
      addFlowEdge(
        graph,
        ingredientNode,
        recipeNode,
        1
      );
    }

    addFlowEdge(
      graph,
      recipeNode,
      sink,
      1
    );
  }

  const maxFlow =
    dinicMaxFlow(
      graph,
      source,
      sink
    );

  return {
    maxFlow,
    flowRequired:
      requiredIngredients.length,
    flowComplete:
      maxFlow ===
      requiredIngredients.length
  };
}

/* =======================================================
   CO5 - GREEDY SET COVER
======================================================= */

function runGreedySetCover(
  recipes,
  userIngredients
) {
  const universe = new Set(
    normalizeList(userIngredients)
  );

  const uncovered =
    new Set(universe);

  const selectedRecipeIds =
    new Set();

  const coverGain = {};

  while (uncovered.size > 0) {
    let bestRecipe = null;
    let bestGain = 0;

    for (const recipe of recipes) {
      if (
        selectedRecipeIds.has(
          recipe.id
        )
      ) {
        continue;
      }

      const recipeIngredients =
        new Set(
          normalizeList(
            recipe.ingredients || []
          )
        );

      let gain = 0;

      for (const ingredient of uncovered) {
        if (
          recipeIngredients.has(
            ingredient
          )
        ) {
          gain++;
        }
      }

      if (gain > bestGain) {
        bestGain = gain;
        bestRecipe = recipe;
      }
    }

    if (
      !bestRecipe ||
      bestGain === 0
    ) {
      break;
    }

    selectedRecipeIds.add(
      bestRecipe.id
    );

    coverGain[
      bestRecipe.id
    ] = bestGain;

    const recipeIngredients =
      new Set(
        normalizeList(
          bestRecipe.ingredients || []
        )
      );

    for (const ingredient of uncovered) {
      if (
        recipeIngredients.has(
          ingredient
        )
      ) {
        uncovered.delete(
          ingredient
        );
      }
    }
  }

  return {
    selectedRecipeIds,
    coverGain
  };
}

/* =======================================================
   MAIN RECIPE MATCHER
======================================================= */

function getMatches(
  recipes,
  userIngredients
) {
  const available =
    getAvailableIngredients(
      userIngredients
    );

  /* CO2 */
  const kmpCounts =
    runKMP(
      userIngredients,
      recipes
    );

  /* CO3 */
  const dpCounts =
    runDP(
      userIngredients,
      recipes
    );

  /* CO5 */
  const setCoverResult =
    runGreedySetCover(
      recipes,
      userIngredients
    );

  const results = recipes.map(
    (recipe) => {
      const recipeIngredients =
        normalizeList(
          recipe.ingredients || []
        );

      const matchedIngredients =
        recipeIngredients.filter(
          (ingredient) =>
            available.includes(
              ingredient
            )
        );

      const missingIngredients =
        recipeIngredients.filter(
          (ingredient) =>
            !available.includes(
              ingredient
            )
        );

      const matchPercentage =
        recipeIngredients.length === 0
          ? 0
          : Math.round(
              (
                matchedIngredients.length /
                recipeIngredients.length
              ) * 100
            );

      const canCookNow =
        missingIngredients.length === 0 &&
        isCoreIngredientAvailable(
          recipe,
          available
        );

      /* CO4 */
      const flowResult =
        runDinicForRecipe(
          recipe,
          available
        );

      /* CO5 */
      const isSetCoverSelected =
        setCoverResult
          .selectedRecipeIds
          .has(recipe.id);

      const setCoverGain =
        setCoverResult
          .coverGain[recipe.id] || 0;

      return {
        ...recipe,

        matchPercentage,
        matchedIngredients,
        missingIngredients,
        canCookNow,

        /* CO2 */
        kmpMatchedIngredients:
          kmpCounts[recipe.id] || 0,

        /* CO3 */
        dpCoveredIngredients:
          dpCounts[recipe.id] || 0,

        /* CO4 */
        maxFlow:
          flowResult.maxFlow,

        flowRequired:
          flowResult.flowRequired,

        flowComplete:
          flowResult.flowComplete,

        /* CO5 */
        setCoverSelected:
          isSetCoverSelected,

        setCoverGain
      };
    }
  );

  /* =====================================================
     IMPORTANT:
     ONLY SHOW 50% AND ABOVE
     
     100%
     75%
     67%
     60%
     50%
     
     Everything below 50% is removed.
  ===================================================== */

  const filteredResults =
    results.filter(
      (recipe) =>
        Number(
          recipe.matchPercentage
        ) >= 50
    );

  /* =====================================================
     FINAL RANKING
  ===================================================== */

  filteredResults.sort(
    (a, b) => {

      /* 1. Can Cook Now */
      if (
        a.canCookNow !==
        b.canCookNow
      ) {
        return (
          Number(b.canCookNow) -
          Number(a.canCookNow)
        );
      }

      /* 2. Match Percentage */
      if (
        b.matchPercentage !==
        a.matchPercentage
      ) {
        return (
          b.matchPercentage -
          a.matchPercentage
        );
      }

      /* 3. CO4 - Complete Flow */
      if (
        a.flowComplete !==
        b.flowComplete
      ) {
        return (
          Number(b.flowComplete) -
          Number(a.flowComplete)
        );
      }

      /* 4. CO4 - Maximum Flow */
      if (
        b.maxFlow !==
        a.maxFlow
      ) {
        return (
          b.maxFlow -
          a.maxFlow
        );
      }

      /* 5. CO3 - DP Coverage */
      if (
        b.dpCoveredIngredients !==
        a.dpCoveredIngredients
      ) {
        return (
          b.dpCoveredIngredients -
          a.dpCoveredIngredients
        );
      }

      /* 6. CO5 - Selected Recipe */
      if (
        a.setCoverSelected !==
        b.setCoverSelected
      ) {
        return (
          Number(
            b.setCoverSelected
          ) -
          Number(
            a.setCoverSelected
          )
        );
      }

      /* 7. CO5 - Coverage Gain */
      if (
        b.setCoverGain !==
        a.setCoverGain
      ) {
        return (
          b.setCoverGain -
          a.setCoverGain
        );
      }

      /* 8. CO2 - KMP */
      return (
        (b.kmpMatchedIngredients || 0) -
        (a.kmpMatchedIngredients || 0)
      );
    }
  );

  /* =====================================================
     RETURN ONLY FILTERED RESULTS
  ===================================================== */

  return filteredResults;
}

/* =======================================================
   EXPORTS
======================================================= */

module.exports = {
  pantryIngredients,
  getMatches,
  getAvailableIngredients,
  dinicMaxFlow,
  runDinicForRecipe,
  runGreedySetCover
};
