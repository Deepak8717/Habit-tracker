// ui/popups/summaryPopups.js

import { getCurrentStreak } from "../../core/notification.js";
import { store } from "../../store/index.js";

export class StreakPopup {
  constructor() {
    const data = store.get();
    this.streak = getCurrentStreak(data.scoreByDate);
  }

  render() {
    return `
      <h3>🔥 Current Streak</h3>
      <div class="streak-number">${this.streak} day${
      this.streak !== 1 ? "s" : ""
    }</div>
      <p class="streak-note">Keep logging to extend your streak. Every day counts.</p>
    `;
  }

  onMount(container) {
    // No interaction yet; placeholder for future animations or buttons
  }
}
