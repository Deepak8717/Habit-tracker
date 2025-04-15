import Calendar from "./calendar.js";
import { showPopup } from "./slotPopup.js";
import HabitStore from "./store/store.js";
const UI = {
  calendar: document.getElementById("calendar"),
  selectedDate: null,

  init() {
    this.selectedDate = new Date().toISOString().split("T")[0]; // Default to today
    this.renderCalendar();
    this.setupEventListeners();
    this.updateAllDays();
  },

  renderCalendar() {
    this.calendar.innerHTML = ""; // Clear previous content
    const months = Calendar.generateYearlyCalendar();

    months.forEach((month) => {
      const monthContainer = document.createElement("div");
      monthContainer.className = "month-container";

      const monthHeader = document.createElement("h3");
      monthHeader.textContent = month.name;
      monthHeader.className = "month-header";

      const daysGrid = document.createElement("div");
      daysGrid.className = "days-grid";

      // Ensure month has at least one day before accessing firstDay
      if (month.days.length > 0) {
        const firstDay = month.days[0].weekday;
        for (let i = 0; i < firstDay; i++) {
          const emptySlot = document.createElement("div");
          emptySlot.className = "empty-slot";
          daysGrid.appendChild(emptySlot);
        }
      }

      // Add actual days
      month.days.forEach((day) => {
        const dayBtn = document.createElement("button");
        dayBtn.textContent = day.day;
        dayBtn.className = "day-btn";
        dayBtn.dataset.date = day.date;
        daysGrid.appendChild(dayBtn);
      });

      monthContainer.appendChild(monthHeader);
      monthContainer.appendChild(daysGrid);
      this.calendar.appendChild(monthContainer);
    });
  },
  updateAllDays() {
    setTimeout(() => {
      document.querySelectorAll(".day-btn").forEach((dayElement) => {
        const date = dayElement.dataset.date;
        this.updateDayColor(dayElement, date);
      });
    }, 100);
  },
  updateDayColor(dayElement, date) {
    const slotCount = HabitStore.getDayLevel(date);
    dayElement.classList.remove("level-1", "level-2", "level-3");

    if (slotCount === 1) dayElement.classList.add("level-1");
    else if (slotCount === 2) dayElement.classList.add("level-2");
    else if (slotCount >= 3) dayElement.classList.add("level-3");
  },
  setupEventListeners() {
    this.calendar.addEventListener("click", (event) => {
      if (event.target.classList.contains("day-btn")) {
        const selectedDate = event.target.dataset.date;
        console.log("Opening slot popup for:", selectedDate);
        showPopup(selectedDate); // Open popup for selected date
        setTimeout(() => {
          const dayElement = document.querySelector(
            `[data-date="${selectedDate}"]`
          );
          if (dayElement) this.updateDayColor(dayElement, selectedDate);
        }, 100);
      }
    });
  },
};

export default UI;
