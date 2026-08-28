let SCHEMES = [];

// Load the scheme dataset. Falls back gracefully if opened via file:// where
// fetch() of local JSON is blocked by the browser — run a local server instead
// (see README "Running it").
async function loadSchemes() {
  try {
    const res = await fetch("data/schemes.json");
    SCHEMES = await res.json();
  } catch (err) {
    console.error("Could not load scheme dataset:", err);
    document.getElementById("resultsList").innerHTML =
      `<p class="empty-state">Couldn't load the scheme dataset. If you opened this file directly in the browser, serve it instead (see README) — fetch() is blocked on file:// URLs.</p>`;
  }
}

function getProfile() {
  return {
    category: document.getElementById("category").value,
    stage: document.getElementById("stage").value,
    sector: document.getElementById("sector").value,
    state: document.getElementById("state").value.trim(),
    age: parseInt(document.getElementById("age").value, 10),
    investmentLakh: parseFloat(document.getElementById("investment").value)
  };
}

function renderResults(matches) {
  const list = document.getElementById("resultsList");

  if (matches.length === 0) {
    list.innerHTML = `<p class="empty-state">No schemes matched this profile in the current dataset. Try adjusting sector or investment range.</p>`;
    return;
  }

  list.innerHTML = matches.map((m) => {
    const strong = m.score >= 80 ? "scheme-card--strong" : "";
    const reasonTags = m.reasons.map((r) => `<span class="tag tag--yes">✓ ${r}</span>`).join("");
    const gapTags = m.gaps.map((g) => `<span class="tag tag--gap">${g}</span>`).join("");

    return `
      <article class="scheme-card ${strong}">
        <div class="seal">
          <span class="seal-score">${m.score}</span>
          <span class="seal-label">MATCH</span>
        </div>
        <div class="scheme-body">
          <h3>${m.scheme.name}</h3>
          <p class="scheme-meta">${m.scheme.body}</p>
          <p class="scheme-summary">${m.scheme.summary}</p>
          <div class="reasons">${reasonTags}${gapTags}</div>
          <a class="scheme-link" href="${m.scheme.url}" target="_blank" rel="noopener">Learn more →</a>
        </div>
      </article>
    `;
  }).join("");
}

document.getElementById("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const profile = getProfile();
  const matches = window.matchSchemes(profile, SCHEMES);
  renderResults(matches);
});

loadSchemes();
