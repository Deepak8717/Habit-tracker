import calendarUI from "./app/calendar/views.js";
import { backupToFirebase } from "./app/backup/backup.js";
import { migrateHabitsToCommitments } from "./app/store/migrateData.js";
import { store } from "./app/store/index.js";
import { launchInitialPopups } from "./app/ui/popups/popupLauncher.js";
import { downloadHabitData, uploadHabitDataFile } from "./app/backup/backup.js";
function renderUIForCommitment(id) {
  store.setActiveCommitment(id);
  calendarUI.render();
}

window.migrateHabitsToCommitments = migrateHabitsToCommitments;
window.renderUIForCommitment = renderUIForCommitment;
window.store = store;
window.downloadHabitData = downloadHabitData;
window.uploadHabitDataFile = uploadHabitDataFile;
document.addEventListener("DOMContentLoaded", () => {
  try {
    calendarUI.init();
    launchInitialPopups();
    backupToFirebase();
  } catch (err) {
    console.error("App initialization failed:", err);
  }
});
