export function parseDate(str) {
  return new Date(str + "T00:00:00");
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
export function loadRecordedDates() {
  const raw = localStorage.getItem("habitData");
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Object.keys(data).sort();
  } catch {
    return [];
  }
}
export function calculateDailyPoints(dayNumber) {
  if (dayNumber <= 0) return 0;
  const points = 2 - (dayNumber - 1) * 0.002;
  return points < 1 ? 1 : parseFloat(points.toFixed(3));
}
export function calculatePenaltyPoints(totalScore) {
  if (totalScore <= 0) return 0;
  const penaltyPercent = 65 / Math.sqrt(totalScore);
  const penaltyPoints = (penaltyPercent / 100) * totalScore; // actual points lost
  return penaltyPoints;
}
export function calculateCumulativeScore(recordedDays) {
  if (recordedDays.length === 0) return 0;

  const recordedSet = new Set(recordedDays);
  const startDate = parseDate(recordedDays[0]);
  const endDate = parseDate(recordedDays[recordedDays.length - 1]);

  let currentDate = new Date(startDate);
  let soberDayCount = 0;
  let cumulativeScore = 0;

  while (currentDate <= endDate) {
    const dayStr = formatDate(currentDate);

    if (recordedSet.has(dayStr)) {
      soberDayCount += 1;
      cumulativeScore += calculateDailyPoints(soberDayCount);
    } else {
      cumulativeScore -= calculatePenaltyPoints(cumulativeScore);
    }

    currentDate = addDays(currentDate, 1);
  }

  return cumulativeScore;
}
