const STORAGE_KEY = "selectedDays";

export function saveProgress(selectedDays) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedDays));
}

export function getSavedProgress() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {};
  } catch (e) {
    console.error("Error reading from localStorage", e);
    return {};
  }
}

export function loadProgress() {
  const progress = getSavedProgress();
  return progress;
}
