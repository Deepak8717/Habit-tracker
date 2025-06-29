import calendarUI from "./app/calendar/views.js";
import PopupManager from "./app/ui/popups/basePopup.js";
import ScorePopup from "./app/ui/popups/scorePopup.js";
import { backupToFirebase } from "./app/backup/backup.js";
import HamburgerMenu from "./app/ui/popups/hamburgerMenu.js";
import { migrateHabitsToCommitments } from "./app/store/migrateData.js";
import { store } from "./app/store/index.js";

/**
 * Renders the UI for the selected commitment.
 * Updates localStorage and store, then re-renders the calendar.
 */
function renderUIForCommitment(id) {
  store.setActiveCommitment(id);
  calendarUI.render();
}

// Expose debug and migration tools globally
window.migrateHabitsToCommitments = migrateHabitsToCommitments;
window.renderUIForCommitment = renderUIForCommitment;
window.store = store;

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
