import CalendarData from "./data.js";
import SlotPopup from "../ui/popups/slotPopup.js";
import { generateHistory } from "../core/scoring.js";
import { store } from "../store/index.js";

const calendarContainer = document.getElementById("calendar");

let recordedDaysSet = new Set();
let scoreByDate = {};
let commitmentStartDate = null;

function normalize(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // Shift to local time
  return d.toISOString().slice(0, 10);
}

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

function updateDayButton(btn, date) {
  const today = normalize(new Date());
  const isFuture = date > today;
  const isBeforeStart =
    commitmentStartDate && date < normalize(commitmentStartDate);

  if (isFuture || isBeforeStart) return;

  if (!recordedDaysSet.has(date)) {
    btn.classList.add("fail-day");
    return;
  }
  const score = scoreByDate[date] || 0;
  const threshold = score === 0 ? 0 : Math.floor((score - 1) / 50) + 1;
  const capped = Math.min(threshold, 8);
  btn.classList.add(`score-${capped}`);
}

function refreshDayButton(date) {
  const btn = document.querySelector(`[data-date="${date}"]`);
  if (btn) updateDayButton(btn, date);
}

export function renderCalendarUI() {
  refreshState();
  calendarContainer.innerHTML = "";

  const months = CalendarData.generateYearlyCalendar();

  for (const month of months) {
    const grid = document.createElement("div");
    grid.className = "days-grid";

    const offset = new Date(month.days[0].date).getDay();
    createEmptySlots(offset).forEach((el) => grid.appendChild(el));

    for (const day of month.days) {
      const btn = createDayButton(day);
      updateDayButton(btn, day.date);
      grid.appendChild(btn);
    }

    calendarContainer.appendChild(grid);
  }
}

export function refreshState() {
  const commitmentId = store.activeCommitmentId;
  if (!commitmentId) return;

  // Get all dates in the calendar year (or desired range)
  const calendarDates = CalendarData.generateYearlyCalendar().flatMap((month) =>
    month.days.map((day) => day.date)
  );

  // Get all dates with slots, sorted
  const allDates = Object.keys(store.log)
    .filter((date) => store.getSlots(commitmentId, date).length > 0)
    .sort();

  recordedDaysSet = new Set(allDates);

  // Build cumulative score history for all days with slots
  const history = generateHistory(allDates);

  // Map date -> cumulativeScore for all calendar dates, filling forward
  scoreByDate = {};
  let lastScore = 0;
  let historyIdx = 0;
  for (const date of calendarDates) {
    if (historyIdx < history.length && history[historyIdx].day === date) {
      lastScore = history[historyIdx].cumulativeScore;
      historyIdx++;
    }
    scoreByDate[date] = lastScore;
  }

  commitmentStartDate = store.getStartDate(commitmentId);
}

function setupEventListeners() {
  calendarContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("day-btn")) return;
    const date = e.target.dataset.date;
    SlotPopup.open(date).then(() => {
      refreshState();
      renderCalendarUI();
    });
  });

  document.addEventListener("habitSlotChange", (e) => {
    refreshState();
    renderCalendarUI();
  });
}

function startCalendar() {
  renderCalendarUI();
  setupEventListeners();
  window.addEventListener("resize", renderCalendarUI);
}

export default {
  init: startCalendar,
};
