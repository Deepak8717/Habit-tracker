import calendarUI from "./app/calendar/views.js";
import PopupManager from "./app/ui/popups/basePopup.js";
import ScorePopup from "./app/ui/popups/scorePopup.js";
import { backupToFirebase } from "./app/backup/backup.js";
import HamburgerMenu from "./app/ui/popups/hamburgerMenu.js";
document.addEventListener("DOMContentLoaded", () => {
  calendarUI.init();
  PopupManager.init();
  ScorePopup.open();
  backupToFirebase();
  HamburgerMenu.init();
});
