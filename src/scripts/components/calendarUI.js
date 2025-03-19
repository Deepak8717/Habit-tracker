import { monthNames } from "../calendar.js";
import { openPopup } from "./popupUI.js";

export function createDayElement({ year, month, day }) {
  const dayDiv = document.createElement("div");
  dayDiv.classList.add("day");
  dayDiv.setAttribute("title", `${monthNames[month]} ${day}, ${year}`);
  dayDiv.textContent = day;

  dayDiv.addEventListener("click", () => openPopup({ year, month, day }));

  return dayDiv;
}
