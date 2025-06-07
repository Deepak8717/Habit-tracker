// progressiveStore.js

export function parseDate(str) {
  return new Date(str + "T00:00:00");
}

export function formatDateISO(date) {
  console.log("formatDateISO", date);
  // returns YYYY-MM-DD string
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
export function formatDateShort(date) {
  // returns DD/MM/YY for UI
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear()).slice(-2);
  return `${d}/${m}/${y}`;
}

export function addDays(date, n) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n);
  return copy;
}
export function calculateDailyPoints(dayNumber) {
  if (dayNumber <= 0) return 0;
  const base = 2;
  const decayRate = 0.002;
  const points = base - (dayNumber - 1) * decayRate;
  return points < 1 ? 1 : points;
}
export function calculatePenaltyPoints(totalScore) {
  if (totalScore <= 0) return 0;
  if (totalScore <= 50) {
    return totalScore * 0.1;
  }
  return 5;
}
function calculateBonus({
  dayCounter,
  bonusIndex,
  lastBonusDay,
  missedBonusPoints,
  skipSet,
  cumulativeScore,
  bonusGen,
}) {
  const bonusValue = bonusIndex + 1;
  const attendanceRatio = (() => {
    const totalDays = dayCounter - lastBonusDay;
    if (totalDays <= 0) return 0;
    const skipped = Array.from(skipSet).filter(
      (d) => d > lastBonusDay && d <= dayCounter
    ).length;
    return (totalDays - skipped) / totalDays;
  })();

  let newCumulativeScore = cumulativeScore;
  let newMissedBonusPoints = missedBonusPoints;
  let newLastBonusDay = lastBonusDay;

  if (bonusIndex === 0) {
    newCumulativeScore += bonusValue;
    newMissedBonusPoints = 0;
    newLastBonusDay = dayCounter;
  } else if (attendanceRatio >= 0.6) {
    const extra =
      missedBonusPoints > 0 ? Math.ceil(missedBonusPoints * 0.25) : 0;
    newCumulativeScore += bonusValue + extra;
    newMissedBonusPoints = 0;
    newLastBonusDay = dayCounter;
  } else {
    newMissedBonusPoints += bonusValue;
  }

  const nextBonusDay = bonusGen.next().value;

  return {
    newCumulativeScore,
    newMissedBonusPoints,
    newLastBonusDay,
    nextBonusDay,
  };
}
export function calculateCumulativeScore(recordedDays) {
  if (recordedDays.length === 0) return 0;

  const recordedSet = new Set(recordedDays);
  const startDate = parseDate(recordedDays[0]);
  // Subtract 1 day so the loop ends the day before last recorded day — same as original
  const endDate = addDays(parseDate(recordedDays[recordedDays.length - 1]), -1);

  const bonusGen = bonusDayGenerator();
  let nextBonusDay = bonusGen.next().value;
  let bonusIndex = 0;

  let lastBonusDay = 0;
  let missedBonusPoints = 0;

  let cumulativeScore = 0;
  let soberDayCount = 0;
  let dayCounter = 0;

  const skipSet = new Set();

  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate = addDays(currentDate, 1)
  ) {
    dayCounter++;
    const dayStr = formatDateISO(currentDate);

    if (recordedSet.has(dayStr)) {
      soberDayCount++;
      cumulativeScore += calculateDailyPoints(soberDayCount);
    } else {
      skipSet.add(dayCounter);
      const penalty = calculatePenaltyPoints(cumulativeScore);
      cumulativeScore = Math.max(cumulativeScore - penalty, 0);
    }

    if (dayCounter === nextBonusDay) {
      const bonusResult = calculateBonus({
        dayCounter,
        bonusIndex,
        lastBonusDay,
        missedBonusPoints,
        skipSet,
        cumulativeScore,
        bonusGen,
      });

      cumulativeScore = bonusResult.newCumulativeScore;
      missedBonusPoints = bonusResult.newMissedBonusPoints;
      lastBonusDay = bonusResult.newLastBonusDay;
      nextBonusDay = bonusResult.nextBonusDay;
      bonusIndex++;
    }
  }

  return parseFloat(cumulativeScore.toFixed(3));
}

export function loadRecordedDates(strict = false) {
  const raw = localStorage.getItem("habitData");
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);
    const now = Date.now();
    const cutoff = 24 * 60 * 60 * 1000;
    let updated = false;

    const upgradedData = Object.fromEntries(
      Object.entries(data).map(([date, value]) => {
        if (Array.isArray(value)) {
          updated = true;
          return [date, { slots: value, timestamp: now - cutoff - 1 }];
        }
        return [date, value];
      })
    );

    if (updated) {
      localStorage.setItem("habitData", JSON.stringify(upgradedData));
    }

    return Object.entries(upgradedData)
      .filter(([_, value]) => {
        if (!strict) return true;
        const timestamp = value.timestamp;
        return typeof timestamp === "number" && now - timestamp >= cutoff;
      })
      .map(([date]) => date)
      .sort();
  } catch (err) {
    console.error("Failed to load or parse habit data:", err);
    return [];
  }
}

export function* bonusDayGenerator() {
  let bonusDay = 6;
  let index = 0;
  while (true) {
    yield bonusDay;
    index++;
    bonusDay += 6 + 2 * index;
  }
}

export function attendanceRatio(skipSet, startDay, endDay) {
  const totalDays = endDay - startDay;
  if (totalDays <= 0) return 0;
  const skipped = Array.from(skipSet).filter(
    (d) => d > startDay && d <= endDay
  ).length;
  return (totalDays - skipped) / totalDays;
}

export function generateHistory(recordedDays) {
  if (recordedDays.length === 0) return [];

  const recordedSet = new Set(recordedDays);
  const startDate = parseDate(recordedDays[0]);
  const endDate = parseDate(recordedDays[recordedDays.length - 1]);

  const bonusGen = bonusDayGenerator();
  let nextBonusDay = bonusGen.next().value;
  let bonusIndex = 0;

  let lastBonusDay = 0;
  let missedBonusPoints = 0;

  let cumulativeScore = 0;
  let soberDayCount = 0;
  let dayCounter = 0;

  const skipSet = new Set();
  const history = [];

  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate = addDays(currentDate, 1)
  ) {
    dayCounter++;
    const dayStr = formatDateISO(currentDate);

    let dailyPoints = 0;
    let penaltyPoints = 0;
    let bonusPoints = 0;

    if (recordedSet.has(dayStr)) {
      soberDayCount++;
      dailyPoints = calculateDailyPoints(soberDayCount);
      cumulativeScore += dailyPoints;
    } else {
      skipSet.add(dayCounter);
      penaltyPoints = calculatePenaltyPoints(cumulativeScore);
      cumulativeScore = Math.max(cumulativeScore - penaltyPoints, 0);
    }

    if (dayCounter === nextBonusDay) {
      const bonusResult = calculateBonus({
        dayCounter,
        bonusIndex,
        lastBonusDay,
        missedBonusPoints,
        skipSet,
        cumulativeScore,
        bonusGen,
      });

      bonusPoints =
        bonusResult.newCumulativeScore - cumulativeScore + bonusPoints;
      cumulativeScore = bonusResult.newCumulativeScore;
      missedBonusPoints = bonusResult.newMissedBonusPoints;
      lastBonusDay = bonusResult.newLastBonusDay;
      nextBonusDay = bonusResult.nextBonusDay;
      bonusIndex++;
    }

    history.push({
      day: dayStr,
      dailyPoints: parseFloat(dailyPoints.toFixed(2)),
      penaltyPoints:
        penaltyPoints > 0 ? parseFloat(penaltyPoints.toFixed(2)) : 0,
      bonusPoints,
      cumulativeScore: parseFloat(cumulativeScore.toFixed(3)),
    });
  }

  return history;
}
