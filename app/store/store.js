import Debug from "../debug.js";

class HabitStore {
  constructor() {
    this.habit = { slots: new Map() };
    this.loadFromLocalStorage();
  }

  toggleSlot(date, slot) {
    const slots = this.habit.slots.get(date) || [];
    const updatedSlots = slots.includes(slot)
      ? slots.filter((s) => s !== slot)
      : [...slots, slot].sort((a, b) => a - b);

    if (updatedSlots.length) {
      this.habit.slots.set(date, updatedSlots);
    } else {
      this.habit.slots.delete(date);
    }
    this.saveToLocalStorage();

    const event = new CustomEvent("habitSlotChange", { detail: date });
    document.dispatchEvent(event);
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

  logStore() {
    // console.clear(); // Clear previous logs to keep console clean

    // Log the entire habit object (just the 'slots' part, for simplicity)
    console.log("Current Habit Data:", {
      slots: Object.fromEntries(this.habit.slots), // Convert the Map to an object for better readability
    });
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem("habitData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        this.habit.slots = new Map(Object.entries(parsedData));
      } catch (e) {
        console.error("Error parsing habit data from localStorage", e);
        this.habit.slots = new Map();
      }
    }
  }
}

export default new HabitStore();
