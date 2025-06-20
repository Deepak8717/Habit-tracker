import CalendarData from "./data.js";
import HabitStore from "../store/store.js";
import SlotPopup from "../ui/popups/slotPopup.js";

const calendarContainer = document.getElementById("calendar");

function createDayButton(day) {
  const btn = document.createElement("button");
  btn.className = "day-btn";
  btn.textContent = day.day;
  btn.dataset.date = day.date;
  return btn;
}

function createEmptySlots(n) {
  return Array.from({ length: n }, () => {
    const empty = document.createElement("div");
    empty.className = "day-btn empty";
    return empty;
  });
}

function updateDayColor(btn, date) {
  const count = HabitStore.getDayLevel(date);
  const start = HabitStore.getTrackingStartDate();
  const today = new Date();
  const day = new Date(date);
  [day, today, start].forEach((d) => d?.setHours(0, 0, 0, 0));

  if (!start || day < start || day > today) return;

  btn.classList.remove("fail-day", "level-1", "level-2", "level-3");
  btn.classList.add(count === 0 ? "fail-day" : `level-${Math.min(count, 3)}`);
}

function renderMonthGroup(month) {
  const group = document.createElement("div");
  const grid = document.createElement("div");
  grid.className = "days-grid";

  const offset = new Date(month.days[0].date).getDay();
  createEmptySlots(offset).forEach((el) => grid.appendChild(el));

  month.days.forEach((day) => {
    const btn = createDayButton(day);
    updateDayColor(btn, day.date);
    grid.appendChild(btn);
  });

  group.appendChild(grid);
  return group;
}

function renderCalendarUI() {
  const months = CalendarData.generateYearlyCalendar();
  calendarContainer.innerHTML = "";

  months.forEach((month) => {
    calendarContainer.appendChild(renderMonthGroup(month));
  });
}

function setupEventListeners() {
  calendarContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("day-btn")) return;
    const date = e.target.dataset.date;
    SlotPopup.open(date);
    updateDayColor(e.target, date);
  });

  document.addEventListener("habitSlotChange", (e) => {
    const btn = document.querySelector(`[data-date="${e.detail}"]`);
    if (btn) updateDayColor(btn, e.detail);
  });
}

function startCalendar() {
  renderCalendarUI();
  setupEventListeners();
  window.addEventListener("resize", renderCalendarUI); // Simple re-render
}

export default {
  init: startCalendar,
};
