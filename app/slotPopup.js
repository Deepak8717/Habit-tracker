import HabitStore from "./store/store.js";
const slotPopup = document.getElementById("slot-popup");
const slotOptionsContainer = document.querySelector(".slot-options");
const overlay = document.getElementById("popup-overlay");
const closePopupBtn = document.getElementById("close-popup");
const popupHeader = document.querySelector(".popup-header");
const timeSlots = Array.from({ length: 12 }, (_, i) => i * 2); // [0, 2, 4, ..., 22]

// Show popup
export function showPopup(date) {
  slotOptionsContainer.innerHTML = "";
  slotPopup.dataset.date = date;

  const selectedSlots = HabitStore.getSlots(date);
  popupHeader.innerHTML = "";
  const selectAllLabel = document.createElement("label");
  selectAllLabel.classList.add("select-all-label");

  const selectAllCheckbox = document.createElement("input");
  selectAllCheckbox.type = "checkbox";
  selectAllCheckbox.checked = selectedSlots.length === timeSlots.length;

  selectAllLabel.appendChild(selectAllCheckbox);
  selectAllLabel.append(" Select All");
  popupHeader.appendChild(selectAllLabel); //.appendChild(selectAllLabel);

  selectAllCheckbox.addEventListener("change", () => {
    const allSelected = selectAllCheckbox.checked;

    timeSlots.forEach((slot) => {
      if (allSelected && !selectedSlots.includes(slot)) {
        HabitStore.toggleSlot(date, slot); // Select all
      } else if (!allSelected && selectedSlots.includes(slot)) {
        HabitStore.toggleSlot(date, slot); // Deselect all
      }
    });

    showPopup(date); // Refresh UI
  });

  timeSlots.forEach((slot) => {
    const slotBtn = document.createElement("button");
    slotBtn.textContent = `${slot}-${slot + 2}`;
    slotBtn.classList.add("slot-btn");

    if (selectedSlots.includes(slot)) {
      const slotIndex = selectedSlots.indexOf(slot);

      if (slotIndex === 0)
        slotBtn.classList.add("level-1"); // First slot (Yellow+Green)
      else if (slotIndex === 1)
        slotBtn.classList.add("level-2"); // Second slot (Light Green)
      else slotBtn.classList.add("level-3"); // Third slot (Dark Green)
    }

    slotBtn.addEventListener("click", () => {
      HabitStore.toggleSlot(date, slot);
      showPopup(date);
    });

    slotOptionsContainer.appendChild(slotBtn);
  });

  slotPopup.classList.remove("hidden");
  overlay.classList.remove("hidden");
  slotPopup.style.display = "block";
  overlay.style.display = "block";
}

// Hide popup
export function hidePopup() {
  slotPopup.classList.add("hidden");
  overlay.classList.add("hidden");
  slotPopup.style.display = "none";
  overlay.style.display = "none";
}

overlay.addEventListener("click", hidePopup);
closePopupBtn.addEventListener("click", hidePopup);
