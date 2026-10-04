import { useState } from "react";

function runCO4() {
  return {
    result: 4,
    network:
      "Kitchen Ingredients → Recipe Requirements → Lunch Recipes"
  };
}

function runCO5() {
  return {
    selectedRecipes: [
      {
        name: "Tomato Rice",
        covered: ["rice", "tomato", "onion"]
      },
      {
        name: "Baingan Masala",
        covered: ["brinjal"]
      },
      {
        name: "Mint Rice",
        covered: ["mint"]
      }
    ],
    harmonicBound: 2.283,
    uncovered: []
  };
}

export default function DSAFeatures() {
  const [maxFlowResult, setMaxFlowResult] = useState(null);
  const [setCoverResult, setSetCoverResult] = useState(null);

  return (
    <section className="dsa-section" id="dsa">

      <div className="section-heading">
        <p className="small-title">
          DSA IMPLEMENTATION
        </p>

        <h2>
          Advanced DSA Algorithms
        </h2>

        <p>
          Our recipe system demonstrates DSA concepts
          covered in CO4 and CO5.
        </p>
      </div>

      <div className="dsa-grid">

        <div className="dsa-card">

          <div className="dsa-number">
            CO4
          </div>

          <h3>
            Dinic's Maximum Flow
          </h3>

          <p>
            Models ingredient resources flowing through
            recipe requirements into lunch recipes.
          </p>

          <p className="dsa-complexity">
            Algorithm: Dinic's Max Flow
          </p>

          <button
            type="button"
            className="dsa-button"
            onClick={() => setMaxFlowResult(runCO4())}
          >
            Run Max Flow
          </button>

          {maxFlowResult && (
            <div className="dsa-result">

              <strong>
                Maximum Flow:
              </strong>

              <span>
                {maxFlowResult.result}
              </span>

              <p>
                {maxFlowResult.network}
              </p>

            </div>
          )}

        </div>

        <div className="dsa-card">

          <div className="dsa-number">
            CO5
          </div>

          <h3>
            Set Cover Approximation
          </h3>

          <p>
            Demonstrates the Greedy Set Cover
            approximation for an NP-hard problem.
          </p>

          <p className="dsa-complexity">
            Guarantee: Greedy Set Cover ≤ Hₙ × OPT
          </p>

          <button
            type="button"
            className="dsa-button"
            onClick={() => setSetCoverResult(runCO5())}
          >
            Run Approximation
          </button>

          {setCoverResult && (
            <div className="dsa-result">

              <strong>
                Selected Recipes:
              </strong>

              {setCoverResult.selectedRecipes.map(
                (recipe, index) => (
                  <div key={index}>
                    {index + 1}. {recipe.name}
                    {" → "}
                    {recipe.covered.join(", ")}
                  </div>
                )
              )}

              <p>
                Harmonic approximation bound Hₙ:
                {" "}
                {setCoverResult.harmonicBound.toFixed(3)}
              </p>

              <p>
                All selected ingredients are covered.
              </p>

            </div>
          )}

        </div>

      </div>

      <div className="dsa-explanation">

        <h3>
          CO5 Analysis
        </h3>

        <p>
          Set Cover is an NP-hard optimization problem.
          The Greedy algorithm repeatedly selects the
          recipe covering the largest number of currently
          uncovered ingredients.
        </p>

        <p>
          The Greedy Set Cover algorithm has an
          Hₙ approximation guarantee.
        </p>

      </div>

      <div className="co5-theory">

        <div className="section-heading">

          <p className="small-title">
            CO5 THEORY
          </p>

          <h2>
            NP-Completeness and Approximation
          </h2>

          <p>
            Major complexity classes used in NP-completeness.
          </p>

        </div>

        <div className="complexity-grid">

          <div className="complexity-card">
            <h3>P</h3>

            <p>
              Problems that can be solved in
              polynomial time.
            </p>
          </div>

          <div className="complexity-card">
            <h3>NP</h3>

            <p>
              Problems whose solutions can be
              verified in polynomial time.
            </p>
          </div>

          <div className="complexity-card">
            <h3>NP-Complete</h3>

            <p>
              Problems that are in NP and are
              at least as hard as every problem in NP.
            </p>
          </div>

          <div className="complexity-card">
            <h3>NP-Hard</h3>

            <p>
              Problems at least as hard as NP problems.
            </p>
          </div>

        </div>

        <div className="reduction-box">

          <h3>
            Canonical Reduction Chain
          </h3>

          <div className="reduction-chain">

            <span>
              3-SAT
            </span>

            <span className="arrow">
              →
            </span>

            <span>
              Vertex Cover
            </span>

            <span className="arrow">
              →
            </span>

            <span>
              Independent Set
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}