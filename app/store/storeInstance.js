import HabitStore from "./store.js";
const currentHabit = localStorage.getItem("currentHabit") || "defaultHabit";
export const store = new HabitStore(currentHabit);
