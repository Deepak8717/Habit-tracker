import PopupManager from "./basePopup.js";
import { store } from "../../store/storeInstance.js";
import { loadRecordedDates } from "../../store/progressiveStore.js";
export const timeSlots = Array.from({ length: 12 }, (_, i) => i * 2);

let currentDate = null;

function formatSlotLabel(startHour) {
  return `${startHour}-${startHour + 2}`;
}

function generateSlotButtonsHTML(date) {
  const activeSlots = store.getSlots(date);
  return timeSlots
    .map((start) => {
      const isActive = activeSlots.includes(start);
      return `<button class="slot-btn${
        isActive ? " active" : ""
      }" data-start="${start}">${formatSlotLabel(start)}</button>`;
    })
    .join("");
}

function generatePopupHTML(date) {
  const activeSlots = store.getSlots(date);
  const allSelected = timeSlots.every((slot) => activeSlots.includes(slot));
  return `
      <h3>Select Time Slots for ${date}</h3>
      <div class="popup-header">
        <label class="select-all-label">
           <input type="checkbox" id="select-all-checkbox" ${
             allSelected ? "checked" : ""
           }/> Select All
        </label>
        <label class="select-month-label" style="margin-left: 1rem;">
        <input type="checkbox" id="select-month-checkbox" />
        Select Entire Month
      </label>
      </div>
      <div class="slot-options">${generateSlotButtonsHTML(date)}</div> 
    `;
}

function popupClickHandler(e) {
  if (e.target.classList.contains("slot-btn")) {
    const slot = parseInt(e.target.dataset.start);
    if (currentDate && !isNaN(slot)) {
      store.toggleSlot(currentDate, slot);
      e.target.classList.toggle("active");
    }
    return;
  }

  if (e.target.id === "select-all-checkbox") {
    const checked = e.target.checked;
    const buttons = e.currentTarget.querySelectorAll(".slot-btn");

    buttons.forEach((btn) => {
      const slot = parseInt(btn.dataset.start);
      const isAlreadyActive = HabitStore.getSlots(currentDate).includes(slot);

      if (checked && !isAlreadyActive) {
        HabitStore.toggleSlot(currentDate, slot);
        btn.classList.add("active");
      } else if (!checked && isAlreadyActive) {
        HabitStore.toggleSlot(currentDate, slot);
        btn.classList.remove("active");
      }
    });
    return;
  }

  if (e.target.id === "select-month-checkbox") {
    const checked = e.target.checked;
    const year = currentDate.slice(0, 4);
    const month = currentDate.slice(5, 7);
    const recordedDates = loadRecordedDates(false);
    const matchingDates = recordedDates.filter((d) =>
      d.startsWith(`${year}-${month}`)
    );

    matchingDates.forEach((day) => {
      timeSlots.forEach((slot) => {
        const alreadyActive = HabitStore.getSlots(day).includes(slot);
        if (checked && !alreadyActive) {
          HabitStore.toggleSlot(day, slot);
        } else if (!checked && alreadyActive) {
          HabitStore.toggleSlot(day, slot);
        }
      });
    });

    SlotPopup.close();
    document.dispatchEvent(
      new CustomEvent("habitSlotChange", { detail: currentDate })
    );
  }
}

export default class SlotPopup {
  static open(date) {
    currentDate = date;
    PopupManager.show(generatePopupHTML(date));
    const popupBody = document.getElementById("popup-body");
    if (popupBody) {
      popupBody.addEventListener("click", popupClickHandler);
    }
  }

  static close() {
    const popupBody = document.getElementById("popup-body");
    if (popupBody) {
      popupBody.removeEventListener("click", popupClickHandler);
    }
    PopupManager.hide();
    currentDate = null;
  }
}
