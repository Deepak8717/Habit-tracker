import { DEFAULT_SCORING_PARAMS } from "./config.js";

// === Helpers ===
function parseLocalDate(str) {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day); // Local midnight
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dailyScore(dayCount, config) {
  const { BASE_POINT, DECAY_PER_DAY, MIN_POINT } = config;
  return Math.max(BASE_POINT - DECAY_PER_DAY * (dayCount - 1), MIN_POINT);
}

function penalty(score, config, missedStreak) {
  if (score <= 0) return 0;
  if (missedStreak === 1) return 1;
  if (missedStreak === 2) return 2;
  if (missedStreak > 5) return 2;
  return 3;
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

// === Core Calculation Logic (DRY) ===
function calculateScoreWithHistory(days, config, includeHistory = false) {
  if (!Array.isArray(days) || days.length === 0) {
    return includeHistory ? [] : 0;
  }

  days = [...days].sort();
  const committed = new Set(days);
  const startDate = parseLocalDate(days[0]);
  const endDate = parseLocalDate(days[days.length - 1]);

  let history = [];
  let score = 0;
  let dayCounter = 0;
  let missedStreak = 0;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = formatDate(d);
    let dailyPoints = 0;
    let penaltyPoints = 0;
    let bonusPoints = 0;

    if (committed.has(key)) {
      dayCounter++;
      missedStreak = 0; // Reset missed streak
      dailyPoints = dailyScore(dayCounter, config);
      score += dailyPoints;
    } else {
      missedStreak++;
      penaltyPoints = penalty(score, config, missedStreak);
      score = Math.max(score - penaltyPoints, 0);
    }

    if (isSunday(d)) {
      const lastWeekDates = getPreviousWeekDates(d);
      const count = lastWeekDates.filter((day) => committed.has(day)).length;
      if (count > 3) {
        bonusPoints = +(count * 0.3).toFixed(2);
        score += bonusPoints;
      }
    }

    if (includeHistory) {
      history.push({
        day: key,
        dailyPoints: +dailyPoints.toFixed(2),
        penaltyPoints: +penaltyPoints.toFixed(2),
        bonusPoints: +bonusPoints.toFixed(2),
        cumulativeScore: +score.toFixed(3),
      });
    }
  }

  return includeHistory ? history : +score.toFixed(3);
}

// === Public API ===
export function scoreCalculation(days, config = DEFAULT_SCORING_PARAMS) {
  return calculateScoreWithHistory(days, config, false);
}

export function generateHistory(days, config = DEFAULT_SCORING_PARAMS) {
  return calculateScoreWithHistory(days, config, true);
}
