const trackerContainer = document.getElementById("history");
const today = new Date().toISOString().split('T')[0];
let habitData = JSON.parse(localStorage.getItem("habitTracker")) || {};

if (!habitData[today]) {
    habitData[today] = [];
    localStorage.setItem("habitTracker", JSON.stringify(habitData));
}

function createSlot(time, date) {
    const slot = document.createElement("div");
    slot.textContent = time;
    slot.classList.add("slot");
    if (habitData[date].includes(time)) {
        slot.classList.add("tracked");
    }
    slot.addEventListener("click", () => {
        slot.classList.toggle("tracked");
        saveProgress(date);
    });
    return slot;
}

function saveProgress(date) {
    habitData[date] = Array.from(document.querySelectorAll(`[data-date='${date}'] .tracked`))
        .map(slot => slot.textContent);
    localStorage.setItem("habitTracker", JSON.stringify(habitData));
}

function createDayTracker(date) {
    const daySection = document.createElement("div");
    daySection.innerHTML = `<h2>${date}</h2>`;
    const tracker = document.createElement("div");
    tracker.classList.add("tracker");
    tracker.setAttribute("data-date", date);
    
    for (let i = 0; i < 96; i++) {
        const time = `${String(Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`;
        tracker.appendChild(createSlot(time, date));
    }
    
    daySection.appendChild(tracker);
    trackerContainer.prepend(daySection);
}

Object.keys(habitData).sort().forEach(createDayTracker);
