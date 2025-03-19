import { toggleSlot } from "../stateManager.js";
import { getSavedProgress } from "../storage.js";

const timeRanges = [
  "00-02",
  "02-04",
  "04-06",
  "06-08",
  "08-10",
  "10-12",
  "12-14",
  "14-16",
  "16-18",
  "18-20",
  "20-22",
  "22-24",
];

export function openPopup(year, month, day) {
  const overlay = document.getElementById("popup-overlay");
  overlay.classList.add("active");
  overlay.style.display = "flex";

  const timeSlotsContainer = document.getElementById("time-slots");
  const dayKey = `${year}-${month}-${day}`;

  const savedProgress = getSavedProgress();
  const dayProgress = savedProgress[dayKey] || {};

  timeSlotsContainer.innerHTML = "";

  timeRanges.forEach((range) => {
    const slotDiv = createTimeSlot(range, dayProgress, dayKey);
    timeSlotsContainer.appendChild(slotDiv);
  });
}
export function createTimeSlot(range, dayProgress, dayKey) {
  const slotDiv = document.createElement("div");
  slotDiv.classList.add("slot");
  slotDiv.textContent = range;

  // ✅ Use the passed `dayProgress`, no need to fetch it again
  if (dayProgress[range] === 1) {
    slotDiv.classList.add("state-1");
  } else if (dayProgress[range] === 2) {
    slotDiv.classList.add("state-2");
  }

  slotDiv.addEventListener("click", () => {
    const updatedProgress = toggleSlot(range, dayKey);
    updateSlotColors(dayKey, updatedProgress);
  });

  return slotDiv;
}

function updateSlotColors(dayKey, savedProgress) {
  const dayProgress = savedProgress[dayKey] || {};
  const slots = document.querySelectorAll(".slot");

  slots.forEach((slot) => {
    const range = slot.textContent;
    const state = dayProgress[range] || 0;
    slot.classList.remove("state-1", "state-2");
    if (state === 1) {
      slot.classList.add("state-1");
    } else if (state === 2) {
      slot.classList.add("state-2");
    }
  });
}

// Close popup and persist selection
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-popup").addEventListener("click", () => {
    const overlay = document.getElementById("popup-overlay");
    overlay.classList.remove("active");
    overlay.style.display = "none"; // Hide popup
  });
});
