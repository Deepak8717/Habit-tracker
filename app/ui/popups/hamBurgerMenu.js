import { migrateHabitsToCommitments } from "../../store/migrateData.js";
import PopupHost from "./popupHost.js";
import UploadPopup from "./uploadPopup.js";
import { showScoreTable } from "../score-table/showScoreTable.js";

export default class HamburgerMenu {
  constructor(currentHabit, habits, onSelect) {
    this.currentHabit = currentHabit;
    this.habits = habits;
    this.onSelect = onSelect;
  }

  render() {
    return `<div class="ham-popup" id="hamburger-menu">
      <h2>⚙️ Menu</h2>
      <h3>🧭 Select Habit</h3>
      ${this.habits
        .map(
          (h) => `
        <button data-habit="${h}" style="font-weight: ${
            h === this.currentHabit ? "bold" : "normal"
          }">
          ${this.iconFor(h)} ${h}
        </button><br/><br/>`
        )
        .join("")}
      <hr>
      <button id="migrate-btn">♻️ Migrate Old Habit Data</button><br/><br/>
      <button id="download-btn">⬇️ Download Data</button><br/><br/>
      <button id="upload-btn">⬆️ Upload Data</button><br/><br/>
      <button id="score-table-btn">📊 View Score Table</button><br/><br/>
      <a href="scoreTable.html">📊 View Score Table</a><br/><br/>
      </div>
    `;
  }

  onMount(container) {
    container.querySelectorAll("[data-habit]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const habit = e.target.dataset.habit;
        this.onSelect(habit);
      });
    });
    container.querySelector("#migrate-btn")?.addEventListener("click", () => {
      const raw = localStorage.getItem("habitData");
      if (!raw) return alert("No old habit data found.");
      migrateHabitsToCommitments();
    });
    container.querySelector("#download-btn")?.addEventListener("click", () => {
      if (typeof window.downloadHabitData === "function") {
        window.downloadHabitData();
      }
    });
    container
      .querySelector("#score-table-btn")
      ?.addEventListener("click", () => {
        showScoreTable();
      });
    container.querySelector("#upload-btn")?.addEventListener("click", () => {
      PopupHost.show(new UploadPopup());
    });
  }

  iconFor(habit) {
    return habit === "yoga" ? "🧘" : habit === "study" ? "📖" : "🧍";
  }
}
