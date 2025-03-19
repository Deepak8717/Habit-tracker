import { renderCalendar } from "./calendar.js";
import { loadProgress } from "./state/storage.js";

document.addEventListener("DOMContentLoaded", function () {
  try {
    loadProgress();
    renderCalendar();
  } catch (error) {
    console.error("Error initializing the app:", error);
  }
});
