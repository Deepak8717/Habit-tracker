const trackerContainer = document.getElementById("history");
const loadPreviousBtn = document.getElementById("loadPrevious");
const today = new Date().toISOString().split("T")[0];
let habitData = JSON.parse(localStorage.getItem("habitTracker")) || {};
let loadedDays = new Set(); // Track loaded days

const colors = ["", "lightgreen", "green", "orange", "red"];
const colorLabels = ["Empty", "Started", "Complete", "Missed", "Cancelled"];
const SLOT_SIZES = {
  FIFTEEN_MIN: { value: 15, slotsPerDay: 96, label: "15 Minutes" },
  TWO_HOURS: { value: 120, slotsPerDay: 12, label: "2 Hours" },
};
document.addEventListener("DOMContentLoaded", () => {
  const slotSizeSelect = document.getElementById("slotSizeSelector");
  if (slotSizeSelect) {
    const newSelector = createSlotSizeSelector();
    slotSizeSelect.replaceWith(newSelector);
  }
});

function createSlotSizeSelector() {
  const select = document.createElement("select");
  select.id = "slotSizeSelector";

  // Get current slot size from localStorage or use default
  const currentSlotSize =
    parseInt(localStorage.getItem("slotSize")) || SLOT_SIZES.FIFTEEN_MIN.value;

  Object.entries(SLOT_SIZES).forEach(([key, config]) => {
    const option = document.createElement("option");
    option.value = config.value;
    option.textContent = config.label;
    // Set selected attribute if this is the current slot size
    if (config.value === currentSlotSize) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const selectedSize = parseInt(select.value);
    localStorage.setItem("slotSize", selectedSize);
    location.reload(); // Refresh to rebuild with new slot size
  });

  return select;
}

function createColorSelector() {
  const select = document.createElement("select");
  colors.forEach((color, index) => {
    if (index === 0) return; // Skip empty color
    const option = document.createElement("option");
    option.value = index;
    option.textContent = colorLabels[index];
    option.style.backgroundColor = color;
    select.appendChild(option);
  });
  return select;
}
function markAllSlots(date, level) {
  document.querySelectorAll(`[data-date='${date}'] .slot`).forEach((slot) => {
    slot.dataset.level = level;
    slot.style.background = colors[level];
  });
  saveProgress(date);
}
// Convert old format to new format if needed
Object.keys(habitData).forEach((date) => {
  if (Array.isArray(habitData[date])) {
    let newFormat = {};
    habitData[date].forEach((time) => (newFormat[time] = 1)); // Default level = 1
    habitData[date] = newFormat;
  }
});
localStorage.setItem("habitTracker", JSON.stringify(habitData));

// Ensure today's entry exists
if (!habitData[today]) {
  habitData[today] = {};
  localStorage.setItem("habitTracker", JSON.stringify(habitData));
}

function createSlot(time, date, slotSize) {
  const slot = document.createElement("div");
  slot.textContent = time;
  slot.classList.add("slot");

  // Set width based on slot size
  if (slotSize === SLOT_SIZES.TWO_HOURS.value) {
    slot.classList.add("slot-large");
  }

  let level = habitData[date]?.[time] || 0;
  slot.dataset.level = level;
  slot.style.background = colors[level];

  slot.addEventListener("click", () => {
    let newLevel = (parseInt(slot.dataset.level) + 1) % colors.length;
    slot.dataset.level = newLevel;
    slot.style.background = colors[newLevel];
    saveProgress(date);
  });

  return slot;
}

function saveProgress(date) {
  habitData[date] = {};
  document.querySelectorAll(`[data-date='${date}'] .slot`).forEach((slot) => {
    let level = parseInt(slot.dataset.level);
    if (level > 0) {
      habitData[date][slot.textContent] = level;
    }
  });
  localStorage.setItem("habitTracker", JSON.stringify(habitData));
}

function createDayTracker(date) {
  if (loadedDays.has(date)) return;
  loadedDays.add(date);

  const slotSize =
    parseInt(localStorage.getItem("slotSize")) || SLOT_SIZES.FIFTEEN_MIN.value;
  const slotsPerDay =
    slotSize === SLOT_SIZES.FIFTEEN_MIN.value
      ? SLOT_SIZES.FIFTEEN_MIN.slotsPerDay
      : SLOT_SIZES.TWO_HOURS.slotsPerDay;

  const daySection = document.createElement("div");
  daySection.classList.add("day-section");

  // Create header container
  const headerContainer = document.createElement("div");
  headerContainer.style.display = "flex";
  headerContainer.style.alignItems = "center";
  headerContainer.style.gap = "10px";
  headerContainer.style.marginBottom = "10px";
  headerContainer.style.justifyContent = "center";

  // Add date heading
  const heading = document.createElement("h2");
  heading.textContent = date;
  headerContainer.appendChild(heading);

  // Add color selector
  const colorSelector = createColorSelector();
  headerContainer.appendChild(colorSelector);

  // Add Select All button
  const selectAllBtn = document.createElement("button");
  selectAllBtn.textContent = "Select All";
  selectAllBtn.addEventListener("click", () => {
    const selectedLevel = parseInt(colorSelector.value);
    markAllSlots(date, selectedLevel);
  });
  headerContainer.appendChild(selectAllBtn);

  daySection.appendChild(headerContainer);

  const trackerWrapper = document.createElement("div");
  trackerWrapper.classList.add("tracker-wrapper");

  const tracker = document.createElement("div");
  tracker.classList.add("tracker");
  tracker.setAttribute("data-date", date);

  for (let i = 0; i < slotsPerDay; i++) {
    const minutes = i * slotSize;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const time = `${String(hours).padStart(2, "0")}:${String(
      remainingMinutes
    ).padStart(2, "0")}`;
    tracker.appendChild(createSlot(time, date, slotSize));
  }

  trackerWrapper.appendChild(tracker);
  daySection.appendChild(trackerWrapper);
  trackerContainer.prepend(daySection);
}

function generatePastDates(startDate, count) {
  const dates = [];
  const start = new Date(startDate);

  for (let i = 0; i < count; i++) {
    start.setDate(start.getDate() - 1);
    dates.push(start.toISOString().split("T")[0]);
  }
  return dates;
}

if (!habitData[today]) {
  habitData[today] = {};
  localStorage.setItem("habitTracker", JSON.stringify(habitData));
}
createDayTracker(today);

// Load previous day button functionality
loadPreviousBtn.addEventListener("click", () => {
  const loadedDatesList = [...loadedDays].sort();
  const oldestLoadedDate = loadedDatesList[0];

  // Generate just one previous day
  const previousDate = generatePastDates(oldestLoadedDate, 1)[0];

  if (!habitData[previousDate]) {
    habitData[previousDate] = {};
    localStorage.setItem("habitTracker", JSON.stringify(habitData));
  }
  createDayTracker(previousDate);
});

// Scroll to today's entry
setTimeout(() => {
  const todayTracker = document.querySelector(`[data-date='${today}']`);
  if (todayTracker) {
    todayTracker.parentElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}, 100);
