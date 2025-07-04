import CalendarData from "./data.js";
import SlotPopup from "../popups/slotPopup.js";
import { generateHistory } from "../../core/scoring.js";
import { store } from "../../store/index.js";
import PopupHost from "../popups/popupHost.js";
import { toLocalDateString } from "../../utils.js";
const calendarContainer = document.getElementById("calendar");

let recordedDaysSet = new Set();
let scoreByDate = {};
let commitmentStartDate = null;

function normalize(date) {
  return toLocalDateString(date);
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

function getStageClass(score) {
  if (score >= 2001) return "stage-epic";
  if (score >= 1750) return "stage-legend-late";
  if (score >= 1501) return "stage-legend-early";
  if (score >= 1250) return "stage-advanced-late";
  if (score >= 1001) return "stage-advanced-early";
  if (score >= 750) return "stage-middle-late";
  if (score >= 501) return "stage-middle-early";
  if (score >= 250) return "stage-init-late";
  if (score >= 100) return "stage-init-early";
  return "stage-init-zero";
}

function updateDayButton(btn, date, todayStageClass) {
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
  const stageClass = getStageClass(score);
  btn.classList.add(stageClass);
  if (stageClass === todayStageClass) {
    btn.classList.add("current-stage");
  }
}

export function renderCalendarUI() {
  refreshState();
  calendarContainer.innerHTML = "";

  const months = CalendarData.generateYearlyCalendar();
  const today = normalize(new Date());
  const todayScore = scoreByDate[today] || 0;
  const todayStageClass = getStageClass(todayScore);

  for (const month of months) {
    const grid = document.createElement("div");
    grid.className = "days-grid";

    const offset = new Date(month.days[0].date).getDay();
    createEmptySlots(offset).forEach((el) => grid.appendChild(el));

    for (const day of month.days) {
      const btn = createDayButton(day);
      updateDayButton(btn, day.date, todayStageClass);
      grid.appendChild(btn);
    }

    calendarContainer.appendChild(grid);
  }
}

export function refreshState() {
  const commitmentId = store.activeCommitmentId;
  if (!commitmentId) return;

  const calendarDates = CalendarData.generateYearlyCalendar().flatMap((month) =>
    month.days.map((day) => day.date)
  );
  const allDates = Object.keys(store.log)
    .filter((date) => store.getSlots(commitmentId, date).length > 0)
    .sort();

  recordedDaysSet = new Set(allDates);
  const history = generateHistory(allDates);
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
    PopupHost.show(new SlotPopup(date));
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
