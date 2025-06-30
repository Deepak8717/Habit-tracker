import { store } from "./app/store/index.js";
import { generateHistory } from "./app/core/scoring.js";
import { toLocalDateString } from "./../app/utils.js";

function formatDateShort(date) {
  return toLocalDateString(date);
}

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function createBlankRow() {
  const blankRow = document.createElement("tr");
  blankRow.style.height = "15px";
  blankRow.innerHTML = `<td colspan="6" style="background:#f4f4f4;"></td>`;
  return blankRow;
}

function createDataRow(
  dayNumber,
  dayStr,
  points = "",
  penaltyPoints = "",
  bonus = "",
  score = ""
) {
  const tr = document.createElement("tr");

  const tdDay = document.createElement("td");
  tdDay.textContent = dayNumber;

  const tdDate = document.createElement("td");
  tdDate.textContent = dayStr;

  const tdPoints = document.createElement("td");
  tdPoints.textContent = points >= 0 ? points : `${points} (penalty)`;

  const tdPenalty = document.createElement("td");
  if (penaltyPoints > 0) {
    tdPenalty.textContent = `-${penaltyPoints}`;
    tdPenalty.classList.add("penalty");
  } else {
    tdPenalty.textContent = "";
  }

  const tdBonus = document.createElement("td");
  if (bonus > 0) {
    tdBonus.textContent = `+${bonus}`;
    tdBonus.classList.add("bonus");
  } else {
    tdBonus.textContent = "";
  }

  const tdScore = document.createElement("td");
  tdScore.textContent = score;

  tr.appendChild(tdDay);
  tr.appendChild(tdDate);
  tr.appendChild(tdPoints);
  tr.appendChild(tdPenalty);
  tr.appendChild(tdBonus);
  tr.appendChild(tdScore);

  return tr;
}

function renderHistoryTable(recordedDays) {
  const tbody = document.querySelector("#scoreTable tbody");
  tbody.innerHTML = "";
  if (recordedDays.length === 0) return;

  const history = generateHistory(recordedDays);
  let dayCounter = 1;
  for (const entry of history) {
    tbody.appendChild(
      createDataRow(
        dayCounter++,
        formatDateShort(new Date(entry.day)),
        entry.dailyPoints,
        entry.penaltyPoints,
        entry.bonusPoints,
        entry.cumulativeScore
      )
    );
  }
}

function main() {
  const commitmentId = store.activeCommitmentId;
  if (!commitmentId) return;

  const recordedDays = Object.keys(store.log).filter(
    (date) => store.getSlots(commitmentId, date).length > 0
  );
  renderHistoryTable(recordedDays);
}

main();
