import { createDayElement } from "./components/calendarUI.js";
import EventBus from "./state/eventBus.js";
import {
  MONTH_NAMES,
  currentYear,
  currentMonth,
  currentDay,
} from "./constant.js";

// Utility Function
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Core Element Creators
function createMonthLabel(month) {
  const label = document.createElement("div");
  label.classList.add("month-label");
  label.textContent = MONTH_NAMES[month];
  return label;
}

export function createMonth(year, month) {
  const monthDiv = document.createElement("div");
  monthDiv.classList.add("month");
  monthDiv.appendChild(createMonthLabel(month));
  monthDiv.appendChild(createMonthGrid(year, month)); // Call Grid Here
  return monthDiv;
}

function createMonthGrid(year, month) {
  const grid = document.createElement("div");
  grid.classList.add("grid");

  const days = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("day", "empty");
    grid.appendChild(emptyDiv);
  }

  for (
    let day = 1;
    day <= (month === currentMonth ? currentDay : days);
    day++
  ) {
    grid.appendChild(createDayElement({ year, month, day }));
  }

  return grid;
}
EventBus.subscribe("slotUpdated", ({ dayKey, updatedProgress }) => {
  const slots = document.querySelectorAll(".slot");
  slots.forEach((slot) => {
    const range = slot.textContent;
    slot.classList.remove("state-1", "state-2");
    if (updatedProgress[dayKey]?.[range] === 1) {
      slot.classList.add("state-1");
    } else if (updatedProgress[dayKey]?.[range] === 2) {
      slot.classList.add("state-2");
    }
  });
});
// Main Function
export function renderCalendar() {
  const main = document.querySelector("main");
  const existingCalendar = main.querySelector(".calendar-container");
  if (existingCalendar) {
    existingCalendar.remove();
  }

  const calendarContainer = document.createElement("div");
  calendarContainer.classList.add("calendar-container");

  for (let month = 0; month <= currentMonth; month++) {
    calendarContainer.appendChild(createMonth(currentYear, month));
  }

  main.appendChild(calendarContainer);
}
