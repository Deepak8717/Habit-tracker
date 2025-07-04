import { toLocalDateString } from "../../utils.js";

function formatDate(date) {
  return toLocalDateString(date);
}

function getWeekday(date) {
  return date.getDay();
}

function generateMonthData(monthStart, monthEnd) {
  return Array.from({ length: monthEnd.getDate() }, (_, i) => {
    const date = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      i + 1
    );
    return {
      date: formatDate(date),
      day: date.getDate(),
      weekday: getWeekday(date),
    };
  });
}

function generateYearlyCalendar() {
  const today = new Date();
  const months = [];

  for (let i = 0; i < 12; i++) {
    const start = new Date(today.getFullYear(), i, 1);
    const end = new Date(today.getFullYear(), i + 1, 0);
    months.push({
      name: start.toLocaleString("default", { month: "long" }),
      days: generateMonthData(start, end),
    });
  }

  return months;
}

export default {
  generateYearlyCalendar,
};
