import UI from "./app/ui.js";
import PopupManager from "./app/ui/popups/basePopup.js";
import ScorePopup from "./app/ui/popups/scorePopup.js";
import { backupToFirebase } from "./app/backup/backup.js";
document.addEventListener("DOMContentLoaded", () => {
  UI.init();
  PopupManager.init();
  ScorePopup.open();
  backupToFirebase();
});
