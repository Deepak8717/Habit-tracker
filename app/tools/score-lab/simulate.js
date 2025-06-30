import { renderScoreTable } from "../../ui/scoreTable.js";
import { generateHistory } from "../../core/scoring.js";
import { DEFAULT_SCORING_PARAMS } from "../../core/config.js";
import { store } from "../../store/index.js";
import { generateFictionalDays } from "./data.js";

// DOM Elements
const root = document.getElementById("score-lab-root");
const startDateEl = document.getElementById("startDate");
const modeEl = document.getElementById("mode");
const missedEl = document.getElementById("missedDays");
const configEl = document.getElementById("configInput");

// 🔄 Internal State
let currentMissedSet = new Set();

// --- Utility Functions ---
function getParsedConfig() {
  try {
    const raw = configEl.value.trim();
    return raw ? JSON.parse(raw) : DEFAULT_SCORING_PARAMS;
  } catch (e) {
    alert("Invalid JSON in config");
    return DEFAULT_SCORING_PARAMS;
  }
}

function getRealDays() {
  const commitmentId = store.activeCommitmentId;
  if (!commitmentId) return [];
  return Object.keys(store.log).filter(
    (date) => store.getSlots(commitmentId, date).length > 0
  );
}

// --- Main Render ---
function renderLab() {
  const mode = modeEl.value;
  const config = getParsedConfig();
  let days;

  if (mode === "real") {
    days = getRealDays();
  } else {
    const startDate = startDateEl.value
      ? new Date(startDateEl.value)
      : undefined;
    days = generateFictionalDays(Array.from(currentMissedSet), startDate);
  }

  const history = generateHistory(days, config);
  root.innerHTML = "";
  const tableEl = renderScoreTable(history);
  root.appendChild(tableEl);

  // 🔧 Post-patch table rows with data-day & .missed
  if (mode === "fictional") {
    const rows = root.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const day = row.children[1]?.textContent?.trim(); // 2nd column = date
      if (!day) return;
      row.setAttribute("data-day", day);
      if (currentMissedSet.has(day)) row.classList.add("missed");
    });
  }

  // Sync textarea to set
  missedEl.value = Array.from(currentMissedSet).sort().join("\n");
}

// --- Event Bindings ---
modeEl.addEventListener("change", renderLab);
startDateEl.addEventListener("input", renderLab);
configEl.addEventListener("input", renderLab);

missedEl.addEventListener("input", () => {
  currentMissedSet = new Set(
    missedEl.value
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean)
  );
  renderLab();
});

root.addEventListener("click", (e) => {
  if (modeEl.value !== "fictional") return;

  const row = e.target.closest("tr[data-day]");
  if (!row) return;

  const day = row.getAttribute("data-day");
  if (!day) return;

  if (currentMissedSet.has(day)) {
    currentMissedSet.delete(day);
  } else {
    currentMissedSet.add(day);
  }

  renderLab();
});

renderLab(); // Initial render
