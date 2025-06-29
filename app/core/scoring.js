// === Constants ===
const BASE_POINT = 2;
const DECAY_PER_DAY = 0.002;
const MIN_POINT = 1;
const LOW_SCORE_THRESHOLD = 50;
const LOW_SCORE_PENALTY = 0.1;
const HIGH_SCORE_PENALTY = 5;

// === Helpers ===
function parseLocalDate(str) {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day); // Local midnight
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function dailyScore(dayCount) {
  return Math.max(BASE_POINT - DECAY_PER_DAY * (dayCount - 1), MIN_POINT);
}

function penalty(score) {
  if (score <= 0) return 0;
  return score <= LOW_SCORE_THRESHOLD
    ? score * LOW_SCORE_PENALTY
    : HIGH_SCORE_PENALTY;
}

function isSunday(date) {
  return date.getDay() === 0; // Sunday is 0 in JS
}

function getPreviousWeekDates(endDate) {
  const week = [];
  const sunday = new Date(endDate);
  sunday.setDate(sunday.getDate() - 1); // Saturday
  for (let i = 0; i < 6; i++) {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() - i);
    week.push(formatDate(day));
  }
  return week;
}

// === Final Cumulative Score Calculation ===
export function scoreCalculation(days) {
  if (!Array.isArray(days) || days.length === 0) return 0;
  days = [...days].sort();
  const committed = new Set(days);
  const startDate = parseLocalDate(days[0]);
  const endDate = parseLocalDate(days[days.length - 1]);

  let score = 0;
  let dayCounter = 0;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = formatDate(d);

    if (committed.has(key)) {
      dayCounter++;
      score += dailyScore(dayCounter);
    } else {
      score = Math.max(score - penalty(score), 0);
    }

    if (isSunday(d)) {
      const lastWeekDates = getPreviousWeekDates(d);
      const count = lastWeekDates.filter((day) => committed.has(day)).length;
      const bonus = +(count * 0.3).toFixed(2);
      score += bonus;
    }
  }

  return +score.toFixed(3);
}

// === Generate Daily History for UI ===
export function generateHistory(days) {
  if (!Array.isArray(days) || days.length === 0) return [];
  days = [...days].sort();
  const committed = new Set(days);
  const startDate = parseLocalDate(days[0]);
  const endDate = parseLocalDate(days[days.length - 1]);

  let history = [];
  let score = 0;
  let dayCounter = 0;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = formatDate(d);
    console.log("Processing", key, "committed?", committed.has(key));
    let dailyPoints = 0;
    let penaltyPoints = 0;
    let bonusPoints = 0;

    if (committed.has(key)) {
      dayCounter++;
      dailyPoints = dailyScore(dayCounter);
      score += dailyPoints;
    } else {
      penaltyPoints = penalty(score);
      score = Math.max(score - penaltyPoints, 0);
    }

    if (isSunday(d)) {
      const lastWeekDates = getPreviousWeekDates(d);
      const count = lastWeekDates.filter((day) => committed.has(day)).length;
      bonusPoints = +(count * 0.3).toFixed(2);
      score += bonusPoints;
    }

    history.push({
      day: key,
      dailyPoints: +dailyPoints.toFixed(2),
      penaltyPoints: +penaltyPoints.toFixed(2),
      bonusPoints: +bonusPoints.toFixed(2),
      cumulativeScore: +score.toFixed(3),
    });
  }

  return history;
}
