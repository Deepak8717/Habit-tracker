import UI from "./app/ui.js";

import HabitStore from "./app/store/store.js";

document.addEventListener("DOMContentLoaded", () => {
  // Call the existing initialization function
  UI.init();

  // Add click event listener to the document
  document.addEventListener("click", () => {
    HabitStore.logStore(); // Log store state on every click
  });
});
