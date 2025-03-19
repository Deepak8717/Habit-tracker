import { createDayElement } from "./components/calendarUI.js";

// Date Constants
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDay = today.getDate();

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Utility Function
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Core Element Creators
function createMonthLabel(month) {
  const label = document.createElement("div");
  label.classList.add("month-label");
  label.textContent = monthNames[month];
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
