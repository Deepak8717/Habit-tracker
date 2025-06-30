export function generateFictionalDays(missed = [], startDate = undefined) {
  const missedSet = new Set(missed);
  const days = [];

  const baseStart =
    startDate instanceof Date && !isNaN(startDate)
      ? new Date(startDate)
      : new Date();

  baseStart.setHours(0, 0, 0, 0); // Normalize

  for (let i = 0; i < 1300; i++) {
    const d = new Date(baseStart);
    d.setDate(baseStart.getDate() + i); // ← compute fresh each time
    const iso = d.toLocaleDateString("en-CA");
    if (!missedSet.has(iso)) days.push(iso);
  }

  return days;
}
