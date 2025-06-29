import PopupManager from "./basePopup.js";
import { loadRecordedDates } from "../../store/progressiveStore.js";
import { store } from "../../store/index.js";
import { refreshState, renderCalendarUI } from "../../calendar/views.js";

export const timeSlots = Array.from({ length: 12 }, (_, i) => i * 2);

let currentDate = null;

function formatSlotLabel(startHour) {
  return `${startHour}-${startHour + 2}`;
}

function generateSlotButtonsHTML(date) {
  const commitmentId = store.activeCommitmentId;
  const activeSlots = store.getSlots(commitmentId, date);
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
  const commitmentId = store.activeCommitmentId;
  const activeSlots = store.getSlots(commitmentId, date);
  const allSelected = timeSlots.every((slot) => activeSlots.includes(slot));
  return `
    <h3>Select Time Slots for ${date}</h3>
    <div class="popup-header">
      <label class="select-all-label">
         <input type="checkbox" id="select-all-checkbox" ${
           allSelected ? "checked" : ""
         }/> Select All
      </label>
    </div>
    <div class="slot-options">${generateSlotButtonsHTML(date)}</div> 
  `;
}

function popupClickHandler(e) {
  const commitmentId = store.activeCommitmentId;
  if (!commitmentId) return;

  if (e.target.classList.contains("slot-btn")) {
    const slot = parseInt(e.target.dataset.start);
    if (currentDate && !isNaN(slot)) {
      store.toggleSlot(commitmentId, currentDate, slot);
      e.target.classList.toggle("active");
      refreshState();
      renderCalendarUI();
    }
    return;
  }

  if (e.target.id === "select-all-checkbox") {
    const checked = e.target.checked;
    const buttons = e.currentTarget.querySelectorAll(".slot-btn");

    buttons.forEach((btn) => {
      const slot = parseInt(btn.dataset.start);
      const isAlreadyActive = store
        .getSlots(commitmentId, currentDate)
        .includes(slot);

      if (checked && !isAlreadyActive) {
        store.toggleSlot(commitmentId, currentDate, slot);
        btn.classList.add("active");
      } else if (!checked && isAlreadyActive) {
        store.toggleSlot(commitmentId, currentDate, slot);
        btn.classList.remove("active");
      }
    });
    refreshState();
    renderCalendarUI();
    return;
  }
}

export default class SlotPopup {
  static open(date) {
    currentDate = date;
    return new Promise((resolve) => {
      const popupBody = document.getElementById("popup-body");
      const cleanup = () => {
        if (popupBody) {
          popupBody.removeEventListener("click", popupClickHandler);
        }
        PopupManager.hide();
        currentDate = null;
        resolve(); // fire the callback
      };

      PopupManager.show(generatePopupHTML(date));
      if (popupBody) {
        popupBody.addEventListener("click", popupClickHandler);
      }

      // override close to hook into your promise
      SlotPopup.close = cleanup;
    });
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
