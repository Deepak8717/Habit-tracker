const trackerContainer = document.getElementById("history");
const loadPreviousBtn = document.getElementById("loadPrevious");
const today = new Date().toISOString().split('T')[0];
let habitData = JSON.parse(localStorage.getItem("habitTracker")) || {};
let loadedDays = new Set(); // Track loaded days

// Convert old format to new format if needed
Object.keys(habitData).forEach(date => {
    if (Array.isArray(habitData[date])) {
        let newFormat = {};
        habitData[date].forEach(time => newFormat[time] = 1); // Default level = 1
        habitData[date] = newFormat;
    }
});
localStorage.setItem("habitTracker", JSON.stringify(habitData));

// Ensure today's entry exists
if (!habitData[today]) {
    habitData[today] = {};
    localStorage.setItem("habitTracker", JSON.stringify(habitData));
}

// Color levels mapping
const colors = ["", "lightgreen", "green", "orange", "red"];

function createSlot(time, date) {
    const slot = document.createElement("div");
    slot.textContent = time;
    slot.classList.add("slot");

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
    document.querySelectorAll(`[data-date='${date}'] .slot`).forEach(slot => {
        let level = parseInt(slot.dataset.level);
        if (level > 0) {
            habitData[date][slot.textContent] = level;
        }
    });
    localStorage.setItem("habitTracker", JSON.stringify(habitData));
}

function createDayTracker(date) {
    if (loadedDays.has(date)) return; // Prevent duplicate loading
    loadedDays.add(date);

    const daySection = document.createElement("div");
    daySection.classList.add("day-section");
    daySection.innerHTML = `<h2>${date}</h2>`;
    const tracker = document.createElement("div");
    tracker.classList.add("tracker");
    tracker.setAttribute("data-date", date);

    for (let i = 0; i < 96; i++) { // Start from 00:00 and go forward
        const time = `${String(Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`;
        tracker.appendChild(createSlot(time, date));
    }

    daySection.appendChild(tracker);
    trackerContainer.prepend(daySection); // Keep recent day at the top
}

// Load today's data only
createDayTracker(today);

// Load previous day button functionality
loadPreviousBtn.addEventListener("click", () => {
    const dates = Object.keys(habitData).sort().reverse(); // Recent dates first
    const previousDate = dates.find(date => date < today && !loadedDays.has(date));

    if (previousDate) {
        createDayTracker(previousDate);
    } else {
        alert("No previous day data available.");
    }
});

// Scroll to today's entry
setTimeout(() => {
    const todayTracker = document.querySelector(`[data-date='${today}']`);
    if (todayTracker) {
        todayTracker.parentElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}, 100);
