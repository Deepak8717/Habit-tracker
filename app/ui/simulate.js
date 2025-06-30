import { generateHistory } from "../../core/scoring.js";
import { renderScoreTable } from "../../ui/components/ScoreTable.js";

const missed = new Set(["2024-12-02", "2025-01-15", "2025-02-01"]);

function generateFakeData() {
  const start = new Date();
  start.setDate(start.getDate() - 500);
  const days = [];

  for (let i = 0; i < 500; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    if (!missed.has(iso)) days.push(iso);
  }

  return days;
}

const history = generateHistory(generateFakeData());

const root = document.getElementById("score-root");
root.innerHTML = "";
root.appendChild(renderScoreTable(history));
