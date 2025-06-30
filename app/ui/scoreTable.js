export function renderScoreTable(history, { formatDate, columns } = {}) {
  const defaultColumns = [
    { key: "index", label: "Day" },
    { key: "day", label: "Date" },
    { key: "dailyPoints", label: "Points" },
    { key: "penaltyPoints", label: "Penalty" },
    { key: "bonusPoints", label: "Bonus" },
    { key: "cumulativeScore", label: "Score" },
  ];

  columns = columns || defaultColumns;

  const tableContainer = document.createElement("div");
  tableContainer.className = "table-container";

  const table = document.createElement("table");
  table.className = "table-ocean"; // or table-forest / table-ember

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const col of columns) {
    const th = document.createElement("th");
    th.textContent = col.label;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  history.forEach((entry, idx) => {
    const tr = document.createElement("tr");

    for (const col of columns) {
      const td = document.createElement("td");
      let value;

      if (col.key === "index") value = idx + 1;
      else if (col.key === "day")
        value = formatDate ? formatDate(entry.day) : entry.day;
      else value = entry[col.key];

      if (col.key === "penaltyPoints") {
        if (value > 0) {
          td.classList.add("penalty");
          value = `-${value}`;
        } else if (value === 0) {
          value = "-";
        }
      }

      if (col.key === "bonusPoints") {
        if (value > 0) {
          td.classList.add("bonus");
          value = `+${value}`;
        } else if (value === 0) {
          value = "-";
        }
      }

      td.textContent = value != null ? value : "";

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);
  return tableContainer;
}
