import { store } from "../store/index.js";
import { generateHistory } from "../core/scoring.js";
import { renderScoreTable } from "./scoreTable.js";
import PopupManager from "./popups/popupHost.js";
import { toLocalDateString } from "../utils.js";

function formatDateShort(date) {
  return toLocalDateString(date);
}

export function showScoreTable() {
  const commitmentId = store.activeCommitmentId;
  if (!commitmentId) {
    PopupManager.show("<p>No active commitment selected.</p>");
    return;
  }

  const recordedDays = Object.keys(store.log).filter(
    (date) => store.getSlots(commitmentId, date).length > 0
  );

  const history = generateHistory(recordedDays);
  const table = renderScoreTable(history, { formatDate: formatDateShort });

  const wrapper = document.createElement("div");
  wrapper.style.maxWidth = "90vw";
  wrapper.style.maxHeight = "70vh";
  wrapper.style.overflow = "auto";
  wrapper.style.overflow = "auto";
  wrapper.style.scrollbarWidth = "none"; // Firefox
  wrapper.style.msOverflowStyle = "none"; // IE 10+
  wrapper.style.overscrollBehavior = "contain"; // avoid scroll chaining

  wrapper.appendChild(table);

  PopupManager.show({
    render() {
      return wrapper.outerHTML;
    },
  });
}
