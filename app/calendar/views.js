import CalendarData from "./data.js";
import HabitStore from "../store/store.js";
import SlotPopup from "../ui/popups/slotPopup.js";
import {
  loadRecordedDates,
  generateHistory,
} from "../store/progressiveStore.js";

const calendarContainer = document.getElementById("calendar");

let recordedDaysSet = new Set();
let scoreByDate = {};
let currentScoreTier = null;

function createDayButton(day) {
  const btn = document.createElement("button");
  btn.className = "day-btn";
  btn.textContent = day.day;
  btn.dataset.date = day.date;
  return btn;
}

function createEmptySlots(n) {
  return Array.from({ length: n }, () => {
    const div = document.createElement("div");
    div.className = "day-btn empty";
    return div;
  });
}

function updateDayColor(btn, date) {
  const start = HabitStore.getTrackingStartDate();
  const today = new Date();
  const day = new Date(date);
  [day, today, start].forEach((d) => d?.setHours(0, 0, 0, 0));

  btn.classList.remove(
    "fail-day",
    ...Array.from({ length: 8 }, (_, i) => `score-${i}`),
    "font-bold"
  );

  if (!start || day < start || day > today) return;

  if (!recordedDaysSet.has(date)) {
    btn.classList.add("fail-day");
    return;
  }

  const thresholds = [0, 50, 100, 200, 300, 400, 500];
  const tier = thresholds.filter((t) => (scoreByDate[date] || 0) >= t).length;
  btn.classList.add(`score-${tier}`);

  if (tier === currentScoreTier) {
    btn.classList.add("font-bold");
  }
}

function renderCalendarUI() {
  calendarContainer.innerHTML = "";
  const months = CalendarData.generateYearlyCalendar();

  for (const month of months) {
    const grid = document.createElement("div");
    grid.className = "days-grid";

    const offset = new Date(month.days[0].date).getDay();
    createEmptySlots(offset).forEach((el) => grid.appendChild(el));

    for (const day of month.days) {
      const btn = createDayButton(day);
      updateDayColor(btn, day.date);
      grid.appendChild(btn);
    }

    calendarContainer.appendChild(grid);
  }
}

function refreshState() {
  const recordedDates = loadRecordedDates(false);
  recordedDaysSet = new Set(recordedDates);
  scoreByDate = Object.fromEntries(
    generateHistory(recordedDates).map((h) => [h.day, h.cumulativeScore])
  );
  const allScores = Object.values(scoreByDate);
  const maxScore = allScores.length ? Math.max(...allScores) : 0;
  const thresholds = [0, 50, 100, 200, 300, 400, 500];
  currentScoreTier = thresholds.filter((t) => maxScore >= t).length;
}

function setupEventListeners() {
  calendarContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("day-btn")) return;
    const date = e.target.dataset.date;
    SlotPopup.open(date);
    updateDayColor(e.target, date);
  });

  document.addEventListener("habitSlotChange", (e) => {
    const prevTier = currentScoreTier;
    refreshState();
    if (currentScoreTier !== prevTier) {
      renderCalendarUI();
    } else {
      const btn = document.querySelector(`[data-date="${e.detail}"]`);
      if (btn) updateDayColor(btn, e.detail);
    }
  });
}

function startCalendar() {
  refreshState();
  renderCalendarUI();
  setupEventListeners();
  window.addEventListener("resize", renderCalendarUI);
}

export default {
  init: startCalendar,
};
