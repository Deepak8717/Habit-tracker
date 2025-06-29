import PopupManager from "./basePopup.js";
import { store } from "../../store/index.js";
import { scoreCalculation } from "../../core/scoring.js";

function generateScoreHTML() {
  const commitmentId = store.activeCommitmentId;
  if (!commitmentId) {
    return `<p>No commitment selected.</p>`;
  }

  const recordedDays = Object.keys(store.log).filter(
    (date) => store.getSlots(commitmentId, date).length > 0
  );

  const score = Math.floor(scoreCalculation(recordedDays));

  return `
    <h3>Your Total Score</h3>
    <div class="score">${score}</div>
    <a href="scoreTable.html" class="score-link">View Full Score Table</a>
  `;
}

export default class ScorePopup {
  static open() {
    PopupManager.show(generateScoreHTML());
  }
}
