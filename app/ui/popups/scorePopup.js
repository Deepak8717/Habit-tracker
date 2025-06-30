export default class ScorePopup {
  constructor(score, link = "scoreTable.html") {
    this.score = score;
    this.link = link;
  }

  render() {
    return `
      <h3>Your Total Score</h3>
      <div class="score">${this.score}</div>
      <a href="${this.link}" class="score-link">View Full Score Table</a>
    `;
  }

  onMount(container) {
    // No interactions needed yet, but stub is here for API consistency
  }
}
