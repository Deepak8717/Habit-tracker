import { store } from "../../store/index.js";
import { refreshState, renderCalendarUI } from "../../calendar/views.js";

const timeSlots = Array.from({ length: 12 }, (_, i) => i * 2);

function formatSlotLabel(startHour) {
  return `${startHour}-${startHour + 2}`;
}

export default class SlotPopup {
  constructor(date) {
    this.date = date;
  }

  render() {
    const commitmentId = store.activeCommitmentId;
    const activeSlots = store.getSlots(commitmentId, this.date);
    const allSelected = timeSlots.every((slot) => activeSlots.includes(slot));

    return `
      <h3>Time Slots</h3>
      <div class="popup-header">
        <label class="select-all-label">
          <input type="checkbox" id="select-all-checkbox" ${
            allSelected ? "checked" : ""
          }/> Select All
        </label>
      </div>
      <div class="slot-options">
        ${timeSlots
          .map((start) => {
            const isActive = activeSlots.includes(start);
            return `<button class="slot-btn${
              isActive ? " active" : ""
            }" data-start="${start}">${formatSlotLabel(start)}</button>`;
          })
          .join("")}
      </div>
    `;
  }

  onMount(container) {
    container.addEventListener("click", this._clickHandler.bind(this));
  }

  onDestroy() {
    const popupBody = document.getElementById("popup-body");
    popupBody?.removeEventListener("click", this._clickHandler);
  }

  _clickHandler(e) {
    const commitmentId = store.activeCommitmentId;
    if (!commitmentId) return;

    if (e.target.classList.contains("slot-btn")) {
      const slot = parseInt(e.target.dataset.start);
      if (!isNaN(slot)) {
        store.toggleSlot(commitmentId, this.date, slot);
        e.target.classList.toggle("active");
        refreshState();
        renderCalendarUI();
      }
    }

    if (e.target.id === "select-all-checkbox") {
      const checked = e.target.checked;
      const buttons = e.currentTarget.querySelectorAll(".slot-btn");

      buttons.forEach((btn) => {
        const slot = parseInt(btn.dataset.start);
        const isActive = store.getSlots(commitmentId, this.date).includes(slot);

        if (checked && !isActive) {
          store.toggleSlot(commitmentId, this.date, slot);
          btn.classList.add("active");
        } else if (!checked && isActive) {
          store.toggleSlot(commitmentId, this.date, slot);
          btn.classList.remove("active");
        }
      });
      refreshState();
      renderCalendarUI();
    }
  }
}
