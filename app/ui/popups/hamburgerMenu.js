import PopupManager from "./basePopup.js";
import { downloadHabitData, uploadHabitDataFile } from "../../backup/backup.js";

export default class HamburgerMenu {
  static habits = ["sobriety", "yoga", "study"]; // You can add more here

  static init() {
    const hamBtn = document.getElementById("hamburger-sidebar");
    if (!hamBtn) return;

    hamBtn.addEventListener("click", () => HamburgerMenu.showMenu());
  }

  static showMenu() {
    const current =
      localStorage.getItem("currentHabit") || HamburgerMenu.habits[0];

    const habitButtons = HamburgerMenu.habits
      .map((habit) => {
        const isActive = habit === current;
        return `
          <button onclick="HamburgerMenu.setHabit('${habit}')"
                  style="font-weight:${isActive ? "bold" : "normal"}">
            ${HamburgerMenu.iconFor(habit)} ${habit}
          </button><br/><br/>`;
      })
      .join("");

    PopupManager.show(`
      <h2>⚙️ Menu</h2>
      <h3>🧭 Select Habit</h3>
      ${habitButtons}
      <hr>
      <button onclick="HamburgerMenu.download()">⬇️ Download Data</button><br/><br/>
      <button onclick="HamburgerMenu.showUploadUI()">⬆️ Upload Data</button><br/><br/>
      <a href="scoreTable.html">📊 View Score Table</a><br/><br/>
    `);
  }

  static setHabit(habit) {
    localStorage.setItem("currentHabit", habit);
    HamburgerMenu.showMenu(); // re-render menu
    if (typeof renderUIForHabit === "function") {
      renderUIForHabit(habit); // call your UI update logic
    } else {
      console.warn("renderUIForHabit(habit) is not defined");
    }
  }

  static iconFor(habit) {
    return habit === "yoga" ? "🧘" : habit === "study" ? "📖" : "🧍";
  }

  static download() {
    downloadHabitData();
  }

  static showUploadUI() {
    PopupManager.show(`
      <h2>⬆️ Upload Habit Data</h2>
      <div class="upload-wrapper">
        <label class="upload-label" for="uploadInput">Choose File</label>
        <input type="file" id="uploadInput" />
        <div id="file-name">No file chosen</div>
      </div>
      <button onclick="HamburgerMenu.confirmUpload()">Confirm Upload</button><br/><br/>
      <button onclick="HamburgerMenu.showMenu()">🔙 Back to Menu</button>
    `);

    const input = document.getElementById("uploadInput");
    const fileNameDisplay = document.getElementById("file-name");

    input.addEventListener("change", () => {
      fileNameDisplay.textContent = input.files[0]?.name || "No file chosen";
    });
  }

  static confirmUpload() {
    const file = document.getElementById("uploadInput")?.files?.[0];
    if (!file) return alert("No file selected.");
    uploadHabitDataFile(file);
    PopupManager.hide();
  }
}

window.HamburgerMenu = HamburgerMenu;
