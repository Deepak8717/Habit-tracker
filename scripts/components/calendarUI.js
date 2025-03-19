import { MONTH_NAMES } from "../constant.js";
import { openPopup } from "./popupUI.js";

export function createDayElement({ year, month, day }) {
  const dayDiv = document.createElement("div");
  dayDiv.classList.add("day");
  dayDiv.setAttribute("title", `${MONTH_NAMES[month]} ${day}, ${year}`);
  dayDiv.textContent = day;

  dayDiv.addEventListener("click", () => openPopup({ year, month, day }));

  return dayDiv;
}
