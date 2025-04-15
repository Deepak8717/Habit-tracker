import Debug from "../debug.js";
import UI from "../ui.js";

class HabitStore {
  constructor() {
    this.habit = { slots: new Map() };
    this.loadFromLocalStorage();
  }

  toggleSlot(date, slot) {
    const slots = this.habit.slots.get(date) || [];
    const updatedSlots = slots.includes(slot)
      ? slots.filter((s) => s !== slot) // Remove slot if already selected
      : [...slots, slot].sort((a, b) => a - b); // Add slot and sort

    if (updatedSlots.length) {
      this.habit.slots.set(date, updatedSlots);
    } else {
      this.habit.slots.delete(date); // Remove empty entries
    }
    this.saveToLocalStorage();
    Debug.table("Updated Store", this.habit);

    // 🛠️ **Update the day color immediately**
    setTimeout(() => {
      const dayElement = document.querySelector(`[data-date="${date}"]`);
      if (dayElement) UI.updateDayColor(dayElement, date);
    }, 50);
  }

  getSlots(date) {
    return this.habit.slots.get(date) || [];
  }

  getDayLevel(date) {
    return Math.min(this.getSlots(date).length, 3);
  }
  saveToLocalStorage() {
    const plainObject = Object.fromEntries(this.habit.slots);
    localStorage.setItem("habitData", JSON.stringify(plainObject));
  }
  loadFromLocalStorage() {
    const savedData = localStorage.getItem("habitData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.habit.slots = new Map(Object.entries(parsedData));
    }
  }
}

export default new HabitStore();
