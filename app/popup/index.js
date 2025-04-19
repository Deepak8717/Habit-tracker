import HabitStore from "../store/store.js";
import { closePopupBtn, overlay } from "./elements.js";
import {
  hideElements,
  renderHeader,
  renderSlots,
  setupPopup,
  showElements,
} from "./ui.js";

// === UI Flow ===
export function showPopup(date) {
  const selectedSlots = HabitStore.getSlots(date);

  setupPopup(date);
  renderHeader(date, selectedSlots, showPopup);
  renderSlots(date, selectedSlots, showPopup);
  showElements();
}

export function hidePopup() {
  hideElements();
}

// === Close Events ===
overlay.addEventListener("click", hidePopup);
closePopupBtn.addEventListener("click", hidePopup);
