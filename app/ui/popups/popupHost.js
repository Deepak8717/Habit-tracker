// ui/popups/popupHost.js

const overlay = document.getElementById("popup-overlay");
const mainPopup = document.getElementById("main-popup");
const popupBody = document.getElementById("popup-body");
const closeBtn = document.getElementById("popup-close-btn");

export default class PopupHost {
  static current = null;

  static init() {
    closeBtn.addEventListener("click", PopupHost.hide);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) PopupHost.hide();
    });
  }

  static show(component) {
    const html = component.render();
    popupBody.innerHTML = html;
    overlay.classList.remove("hidden");
    mainPopup.classList.remove("hidden");

    if (component.onMount) {
      component.onMount(popupBody);
    }
    PopupHost.current = component;
  }

  static hide() {
    if (PopupHost.current?.onDestroy) {
      PopupHost.current.onDestroy();
    }
    overlay.classList.add("hidden");
    mainPopup.classList.add("hidden");
    popupBody.innerHTML = "";
    PopupHost.current = null;
  }
}
