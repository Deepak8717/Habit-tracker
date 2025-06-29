import Debug from "../debug.js";

class HabitStore {
  constructor(habitName = "defaultHabit") {
    this.habitName = habitName;
    this.habit = { slots: new Map() };
    this.loadFromLocalStorage();
  }
  setActiveHabit(name) {
    this.habitName = name;
  }
  toggleSlot(date, slot) {
    const entry = this.habit.slots.get(date);
    const currentSlots = this.getSlots(date);
    const updatedSlots = this.updateSlots(currentSlots, slot);
    const newData = { slots: updatedSlots, timestamp: Date.now() };

    if (updatedSlots.length === 0) {
      if (!entry) return;

      // new format
      if (typeof entry === "object" && !Array.isArray(entry)) {
        delete entry[this.habitName];
        if (Object.keys(entry).length === 0) {
          this.habit.slots.delete(date);
        } else {
          this.habit.slots.set(date, entry);
        }
      } else {
        // old format fallback
        this.habit.slots.delete(date);
      }
    } else {
      let newEntry;

      if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        newEntry = { ...entry, [this.habitName]: newData };
      } else {
        // migrating old format
        newEntry = { [this.habitName]: newData };
      }

      this.habit.slots.set(date, newEntry);
    }

    this.saveToLocalStorage();
    this.dispatchHabitChangeEvent(date);
  }

  getSlots(date) {
    const entry = this.habit.slots.get(date);
    if (!entry) return [];

    // old format
    if (Array.isArray(entry.slots)) return entry.slots;

    // new format
    return entry[this.habitName]?.slots || [];
  }

  getTrackingStartDate() {
    if (this.habit.slots.size === 0) return null;

    const sortedDates = Array.from(this.habit.slots.keys()).sort();
    return new Date(sortedDates[0]);
  }
  saveToLocalStorage() {
    try {
      const plainObject = Object.fromEntries(this.habit.slots);
      localStorage.setItem("habitData", JSON.stringify(plainObject));
    } catch (e) {
      console.error("Failed to save habit data to localStorage", e);
    }
  }

  logStore() {
    console.clear();
    console.log("Current Habit Data:", {
      slots: Object.fromEntries(this.habit.slots),
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

  updateSlots(slots, slot) {
    return slots.includes(slot)
      ? slots.filter((s) => s !== slot)
      : [...slots, slot].sort((a, b) => a - b);
  }

  dispatchHabitChangeEvent(date) {
    const event = new CustomEvent("habitSlotChange", { detail: date });
    document.dispatchEvent(event);
  }

  resetStore() {
    this.habit = { slots: new Map() };
    this.saveToLocalStorage();
    this.dispatchHabitChangeEvent(null);
  }

  clearLocalStorage() {
    localStorage.removeItem("habitData");
  }

  isValidStoredData() {
    const savedData = localStorage.getItem("habitData");
    try {
      const parsedData = savedData ? JSON.parse(savedData) : null;
      return parsedData && typeof parsedData === "object";
    } catch (e) {
      console.error("Invalid habit data found in localStorage", e);
      return false;
    }
  }
}

export default HabitStore;
