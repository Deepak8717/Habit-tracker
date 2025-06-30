export default class UploadPopup {
  render() {
    return `
      <h2>⬆️ Upload Habit Data</h2>
      <div class="upload-wrapper">
        <label class="upload-label" for="uploadInput">Choose File</label>
        <input type="file" id="uploadInput" />
        <div id="file-name">No file chosen</div>
        <button id="confirm-upload-btn">Confirm Upload</button><br/><br/>
      </div>
    `;
  }

  onMount(container) {
    const input = container.querySelector("#uploadInput");
    const fileNameDisplay = container.querySelector("#file-name");

    input?.addEventListener("change", () => {
      fileNameDisplay.textContent = input.files?.[0]?.name || "No file chosen";
    });

    container
      .querySelector("#confirm-upload-btn")
      ?.addEventListener("click", () => {
        const file = input?.files?.[0];
        if (!file) return alert("No file selected.");
        if (typeof window.uploadHabitDataFile === "function") {
          window.uploadHabitDataFile(file);
        }
      });
  }
}
