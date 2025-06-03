export const overlay = document.getElementById("popup-overlay");
export const mainPopup = document.getElementById("main-popup");
export const closeBtn = document.getElementById("popup-close-btn");
export const popupBody = document.getElementById("popup-body");
export const openBtn = document.getElementById("open-popup-btn");

export default class PopupManager {
  static init() {
    closeBtn.addEventListener("click", PopupManager.hide);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) PopupManager.hide();
    });
    if (openBtn) {
      openBtn.addEventListener("click", () => {
        PopupManager.show("<p>This is your popup content.</p>");
      });
    }
  }
  static show(contentHTML) {
    popupBody.innerHTML = contentHTML;
    overlay.classList.remove("hidden");
    mainPopup.classList.remove("hidden");
  }

  static hide() {
    overlay.classList.add("hidden");
    mainPopup.classList.add("hidden");
    popupBody.innerHTML = "";
  }
}
