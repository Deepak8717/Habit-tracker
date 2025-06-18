import UI from "./app/ui.js";
import PopupManager from "./app/popupBase//popupManager.js";
import ScorePopup from "./app/popupBase/popups/scorePopup.js";
import { backupToFirebase } from "./app/backup/backup.js";
document.addEventListener("DOMContentLoaded", () => {
  UI.init();
  PopupManager.init();
  ScorePopup.open();
  backupToFirebase();
});
