import UI from "./app/ui.js";

import HabitStore from "./app/store/store.js";

document.addEventListener("DOMContentLoaded", () => {
  UI.init();
  document.addEventListener("click", () => {
    HabitStore.logStore();
  });
});
