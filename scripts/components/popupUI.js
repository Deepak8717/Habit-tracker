import { TIME_RANGES } from "../constant.js";
import EventBus from "../state/eventBus.js";
import { toggleSlot } from "../state/stateManager.js";
import { getSavedProgress } from "../state/storage.js";

export function openPopup(year, month, day) {
  const overlay = document.getElementById("popup-overlay");
  overlay.classList.add("active");
  overlay.style.display = "flex";

  const timeSlotsContainer = document.getElementById("time-slots");
  const dayKey = `${year}-${month}-${day}`;

  const savedProgress = getSavedProgress();
  const dayProgress = savedProgress[dayKey] || {};

  timeSlotsContainer.innerHTML = "";

  TIME_RANGES.forEach((range) => {
    const slotDiv = createTimeSlot(range, dayProgress, dayKey);
    timeSlotsContainer.appendChild(slotDiv);
  });
}
export function createTimeSlot(range, dayProgress, dayKey) {
  const slotDiv = document.createElement("div");
  slotDiv.classList.add("slot");
  slotDiv.textContent = range;

  if (dayProgress[range] === 1) {
    slotDiv.classList.add("state-1");
  } else if (dayProgress[range] === 2) {
    slotDiv.classList.add("state-2");
  }

  slotDiv.addEventListener("click", () => {
    const updatedProgress = toggleSlot(range, dayKey);
    EventBus.emit("slotUpdated", { dayKey, updatedProgress });
  });

  return slotDiv;
}

// Close popup and persist selection
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-popup").addEventListener("click", () => {
    const overlay = document.getElementById("popup-overlay");
    overlay.classList.remove("active");
    overlay.style.display = "none"; // Hide popup
  });
});
