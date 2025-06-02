import UI from "./app/ui.js";
import HabitStore from "./app/store/store.js";
import {
  loadRecordedDates,
  calculateCumulativeScore,
} from "./app/store/progressiveStore.js";

document.addEventListener("DOMContentLoaded", () => {
  UI.init();
  document.addEventListener("click", () => {
    HabitStore.logStore();
  });
  const recordedDays = loadRecordedDates();
  const score = calculateCumulativeScore(recordedDays);
  console.log("Cumulative Score:", score);
  // Show score in popup
  const scorePopup = document.getElementById("score-popup");
  const scoreValue = document.getElementById("score-value");

  scoreValue.textContent = score.toFixed(3); // display nicely formatted score
  scorePopup.classList.remove("hidden"); // show the popup

  // Optional: add a click listener to close popup when clicked outside or on a close button
  scorePopup.addEventListener("click", (e) => {
    if (e.target === scorePopup) {
      scorePopup.classList.add("hidden");
    }
  });
});
