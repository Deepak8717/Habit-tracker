import PopupManager from "./basePopup.js";
import {
  loadRecordedDates,
  calculateCumulativeScore,
} from "../../store/progressiveStore.js";

function generateScoreHTML() {
  const recordedDays = loadRecordedDates();
  const score = Math.floor(calculateCumulativeScore(recordedDays));
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
