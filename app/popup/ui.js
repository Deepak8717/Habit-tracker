import HabitStore from "../store/store.js";
import { timeSlots } from "./config.js";
import {
  overlay,
  popupHeader,
  slotOptionsContainer,
  slotPopup,
} from "./elements.js";

export function showElements() {
  slotPopup.classList.remove("hidden");
  overlay.classList.remove("hidden");
  slotPopup.style.display = "block";
  overlay.style.display = "block";
}
export function hideElements() {
  slotPopup.classList.add("hidden");
  overlay.classList.add("hidden");
  slotPopup.style.display = "none";
  overlay.style.display = "none";
}
export function setupPopup(date) {
  slotPopup.dataset.date = date;
  slotOptionsContainer.innerHTML = "";
  popupHeader.innerHTML = "";
}
export function renderHeader(date, selectedSlots, refreshPopup) {
  const label = document.createElement("label");
  label.className = "select-all-label";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = selectedSlots.length === timeSlots.length;
  checkbox.addEventListener("change", () => {
    toggleAllSlots(date, checkbox.checked, selectedSlots, refreshPopup);
  });
  label.appendChild(checkbox);
  label.append(" Select All");
  popupHeader.appendChild(label);
}
export function renderSlots(date, refreshPopup) {
  const selectedSlots = HabitStore.getSlots(date);
  console.log("Selected slots:", selectedSlots);
  slotOptionsContainer.innerHTML = "";
  timeSlots.forEach((slot) => {
    const btn = document.createElement("button");
    btn.textContent = `${slot}-${slot + 2}`;
    btn.className = "slot-btn";

    if (selectedSlots.includes(slot)) {
      const index = selectedSlots.indexOf(slot);
      btn.classList.add(`level-${Math.min(index + 1, 3)}`);
    }

    btn.addEventListener("click", () => {
      HabitStore.toggleSlot(date, slot);
      const updatedSlots = HabitStore.getSlots(date);

      const allButtons = slotOptionsContainer.querySelectorAll(".slot-btn");
      allButtons.forEach((button) => (button.className = "slot-btn"));

      updatedSlots.forEach((selectedSlot, index) => {
        const targetBtn = Array.from(allButtons).find((b) =>
          b.textContent.startsWith(`${selectedSlot}-`)
        );
        if (targetBtn) {
          targetBtn.classList.add(`level-${Math.min(index + 1, 3)}`);
        }
      });
    });
    slotOptionsContainer.appendChild(btn);
  });
}
export function toggleAllSlots(date, selectAll, currentSlots, refreshPopup) {
  timeSlots.forEach((slot) => {
    const hasSlot = currentSlots.includes(slot);
    if (selectAll && !hasSlot) HabitStore.toggleSlot(date, slot);
    if (!selectAll && hasSlot) HabitStore.toggleSlot(date, slot);
  });

  refreshPopup(date); // refresh
}
