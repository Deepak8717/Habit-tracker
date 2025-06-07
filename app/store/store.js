import Debug from "../debug.js";

class HabitStore {
  constructor() {
    this.habit = { slots: new Map() };
    this.loadFromLocalStorage();
  }

  /**
   * Toggle a specific habit slot on a given date
   * @param {string} date
   * @param {number} slot
   */
  toggleSlot(date, slot) {
    const slots = this.getSlots(date);
    const updatedSlots = this.updateSlots(slots, slot);

    if (updatedSlots.length) {
      this.habit.slots.set(date, {
        slots: updatedSlots,
        timestamp: Date.now(),
      });
    } else {
      this.habit.slots.delete(date);
    }

    this.saveToLocalStorage();
    this.dispatchHabitChangeEvent(date);
  }

  /**
   * Get the habit slots for a specific date
   * @param {string} date
   * @returns {Array<number>}
   */
  getSlots(date) {
    const entry = this.habit.slots.get(date);
    return Array.isArray(entry) ? entry : entry?.slots || [];
  }

  /**
   * Get the habit level for a specific day (based on the number of slots)
   * @param {string} date
   * @returns {number}
   */
  getDayLevel(date) {
    return Math.min(this.getSlots(date).length, 3);
  }

  /**
   * Save the habit data to localStorage
   */
  saveToLocalStorage() {
    try {
      const plainObject = Object.fromEntries(this.habit.slots);
      localStorage.setItem("habitData", JSON.stringify(plainObject));
    } catch (e) {
      console.error("Failed to save habit data to localStorage", e);
    }
  }

  /**
   * Log the current habit data to the console (for debugging purposes)
   */
  logStore() {
    // console.clear();
    console.log("Current Habit Data:", {
      slots: Object.fromEntries(this.habit.slots),
    });
  }

  /**
   * Load habit data from localStorage
   */
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

  /**
   * Update the list of slots by adding or removing a specific slot
   * @param {Array<number>} slots
   * @param {number} slot
   * @returns {Array<number>}
   */
  updateSlots(slots, slot) {
    return slots.includes(slot)
      ? slots.filter((s) => s !== slot)
      : [...slots, slot].sort((a, b) => a - b); // Sorting slots in ascending order
  }

  /**
   * Dispatch a custom event whenever a habit slot changes
   * @param {string} date
   */
  dispatchHabitChangeEvent(date) {
    const event = new CustomEvent("habitSlotChange", { detail: date });
    document.dispatchEvent(event);
  }

  /**
   * Reset the habit data (clear all slots and reset the store)
   */
  resetStore() {
    this.habit = { slots: new Map() };
    this.saveToLocalStorage();
    this.dispatchHabitChangeEvent(null); // Dispatch a reset event
  }

  /**
   * Clear all habit data from localStorage
   */
  clearLocalStorage() {
    localStorage.removeItem("habitData");
  }

  /**
   * Check if the localStorage contains valid habit data
   * @returns {boolean}
   */
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

export default new HabitStore();
