import PopupHost from "./popupHost.js";
import ScorePopup from "./scorePopup.js";
import HamburgerMenu from "./hamBurgerMenu.js";
import { store } from "../../store/index.js";
import { scoreCalculation } from "../../core/scoring.js";

function launchScorePopup() {
  const recordedDays = Object.keys(store.log).filter(
    (date) => store.getSlots(store.activeCommitmentId, date).length > 0
  );
  const score = Math.floor(scoreCalculation(recordedDays));
  PopupHost.show(new ScorePopup(score));
}

function bindHamburgerButton() {
  const hamBtn = document.getElementById("hamburger-sidebar");
  const habits = ["sobriety", "yoga", "study"];
  if (!hamBtn) return;

  function renderMenu(currentHabit) {
    PopupHost.show(
      new HamburgerMenu(currentHabit, habits, (habit) => {
        localStorage.setItem("currentHabit", habit);
        window.renderUIForCommitment(habit);
        renderMenu(habit); // re-render with updated active habit
      })
    );
  }

  hamBtn.addEventListener("click", () => {
    const current = localStorage.getItem("currentHabit") || habits[0];
    renderMenu(current);
  });
}

export function launchInitialPopups() {
  PopupHost.init();
  launchScorePopup();
  bindHamburgerButton();
}
