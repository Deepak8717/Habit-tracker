import PopupManager from "../popupManager.js";
import {
  loadRecordedDates,
  calculateCumulativeScore,
} from "../../store/progressiveStore.js";

function generateScoreHTML() {
  const recordedDays = loadRecordedDates();
  const score = calculateCumulativeScore(recordedDays).toFixed(2);
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
