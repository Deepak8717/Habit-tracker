import {
  parseDate,
  formatDate,
  loadRecordedDates,
  calculateDailyPoints,
  addDays,
  calculatePenaltyPoints,
} from "./app/store/progressiveStore.js";
function createBlankRow() {
  const blankRow = document.createElement("tr");
  blankRow.style.height = "15px";
  blankRow.innerHTML = `<td colspan="3" style="background:#f4f4f4;"></td>`;
  return blankRow;
}

function createDataRow(dayStr, points = "", score = "") {
  const tr = document.createElement("tr");

  const tdDay = document.createElement("td");
  tdDay.textContent = dayStr;

  const tdPoints = document.createElement("td");
  tdPoints.textContent = points;

  const tdScore = document.createElement("td");
  tdScore.textContent = score;

  tr.appendChild(tdDay);
  tr.appendChild(tdPoints);
  tr.appendChild(tdScore);

  return tr;
}

export function renderHistoryTable(recordedDays) {
  const tbody = document.querySelector("#scoreTable tbody");
  tbody.innerHTML = "";
  if (recordedDays.length === 0) return;

  const recordedSet = new Set(recordedDays);
  const startDate = parseDate(recordedDays[0]);
  const endDate = parseDate(recordedDays[recordedDays.length - 1]);

  let currentDate = new Date(startDate);
  let lastMonth = currentDate.getMonth();

  let soberDayCount = 0;
  let cumulativeScore = 0;

  while (currentDate <= endDate) {
    const dayStr = formatDate(currentDate);
    const currentMonth = currentDate.getMonth();

    if (currentMonth !== lastMonth) {
      tbody.appendChild(createBlankRow());
      lastMonth = currentMonth;
    }

    let points = "";
    let score = "";

    if (recordedSet.has(dayStr)) {
      soberDayCount += 1;
      points = calculateDailyPoints(soberDayCount);
      cumulativeScore += points;
    } else {
      const penaltyPoints = calculatePenaltyPoints(cumulativeScore);
      cumulativeScore -= penaltyPoints;
      points = (-penaltyPoints).toFixed(2);
    }

    score = cumulativeScore.toFixed(3);
    tbody.appendChild(createDataRow(dayStr, points, score));
    currentDate = addDays(currentDate, 1);
  }
}

function main() {
  const recordedDays = loadRecordedDates();
  renderHistoryTable(recordedDays);
}

main();
