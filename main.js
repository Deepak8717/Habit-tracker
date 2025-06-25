import calendarUI from "./app/calendar/views.js";
import PopupManager from "./app/ui/popups/basePopup.js";
import ScorePopup from "./app/ui/popups/scorePopup.js";
import { backupToFirebase } from "./app/backup/backup.js";
import HamburgerMenu from "./app/ui/popups/hamburgerMenu.js";
import { store } from "./app/store/storeInstance.js";

// Set or get the current habit
const currentHabit = localStorage.getItem("currentHabit") || "defaultHabit";

/**
 * Renders the UI for the selected habit.
 * Updates localStorage and store, then re-renders the calendar.
 */
function renderUIForHabit(habit) {
  localStorage.setItem("currentHabit", habit);
  store.setActiveHabit(habit);
  calendarUI.render();
}

// Optionally expose globally if needed
window.renderUIForHabit = renderUIForHabit;

document.addEventListener("DOMContentLoaded", () => {
  try {
    calendarUI.init();
    PopupManager.init();
    ScorePopup.open();
    backupToFirebase();
    HamburgerMenu.init();
  } catch (err) {
    console.error("App initialization failed:", err);
  }
});
