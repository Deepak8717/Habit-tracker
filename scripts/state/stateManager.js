import { getSavedProgress, saveProgress } from "./storage.js";

export function toggleSlot(range, dayKey) {
  const savedProgress = getSavedProgress();
  const dayProgress = savedProgress[dayKey] || {};
  const slots = Object.keys(dayProgress).sort();

  if (dayProgress[range]) {
    delete dayProgress[range];
  } else {
    dayProgress[range] = slots.length === 0 ? 1 : 2;
  }

  const updatedSlots = Object.keys(dayProgress).sort();
  if (updatedSlots.length > 0) {
    Object.keys(dayProgress).forEach((key) => {
      dayProgress[key] = 2;
    });
    dayProgress[updatedSlots[0]] = 1;
  }

  savedProgress[dayKey] = dayProgress;
  saveProgress(savedProgress);
  return savedProgress;
}
