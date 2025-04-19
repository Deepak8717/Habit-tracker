// === Imports ===
import Calendar from "./calendarData.js";
import { showPopup } from "./popup/index.js";
import HabitStore from "./store/store.js";

// === DOM Reference ===
const calendarContainer = document.getElementById("calendar");

// === Pure Helper Functions ===
function createEmptySlots(count) {
  const slots = [];
  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    div.className = "empty-slot";
    slots.push(div);
  }
  return slots;
}

function createDayButton(day) {
  const btn = document.createElement("button");
  btn.textContent = day.day;
  btn.className = "day-btn";
  btn.dataset.date = day.date;
  return btn;
}

function createMonthElement(month) {
  const monthContainer = document.createElement("div");
  monthContainer.className = "month-container";

  const monthHeader = document.createElement("h3");
  monthHeader.textContent = month.name;
  monthHeader.className = "month-header";

  const daysGrid = document.createElement("div");
  daysGrid.className = "days-grid";

  if (month.days.length > 0) {
    const firstDay = month.days[0].weekday;
    const emptySlots = createEmptySlots(firstDay);
    emptySlots.forEach((slot) => daysGrid.appendChild(slot));
  }

  month.days.forEach((day) => {
    const dayBtn = createDayButton(day);
    daysGrid.appendChild(dayBtn);
  });

  monthContainer.appendChild(monthHeader);
  monthContainer.appendChild(daysGrid);
  return monthContainer;
}

function updateDayColor(dayElement, date) {
  const slotCount = HabitStore.getDayLevel(date);
  dayElement.classList.remove("level-1", "level-2", "level-3");

  if (slotCount === 1) dayElement.classList.add("level-1");
  else if (slotCount === 2) dayElement.classList.add("level-2");
  else if (slotCount >= 3) dayElement.classList.add("level-3");
}
function listenToSlotUpdates() {
  document.addEventListener("habitSlotChange", (event) => {
    const date = event.detail;
    const dayElement = document.querySelector(`[data-date="${date}"]`);
    if (dayElement) updateDayColor(dayElement, date);
  });
}

// === Core UI Logic ===
function renderCalendar() {
  calendarContainer.innerHTML = "";
  const months = Calendar.generateYearlyCalendar();

  months.forEach((month) => {
    const monthElement = createMonthElement(month);
    calendarContainer.appendChild(monthElement);
  });
}

function updateAllDays() {
  setTimeout(() => {
    document.querySelectorAll(".day-btn").forEach((dayEl) => {
      const date = dayEl.dataset.date;
      updateDayColor(dayEl, date);
    });
  }, 100);
}

function setupEventListeners() {
  calendarContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("day-btn")) {
      const clickedDate = event.target.dataset.date;
      console.log("Opening slot popup for:", clickedDate);
      showPopup(clickedDate);

      setTimeout(() => {
        const dayElement = document.querySelector(
          `[data-date="${clickedDate}"]`
        );
        if (dayElement) updateDayColor(dayElement, clickedDate);
      }, 100);
    }
  });
}

// === Init Function ===
function initUI() {
  renderCalendar();
  setupEventListeners();
  updateAllDays();
  listenToSlotUpdates();
}

// === Exported API ===
export default {
  init: initUI,
};
