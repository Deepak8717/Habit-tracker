// Returns a YYYY-MM-DD string in local time for any Date or date string
export function toLocalDateString(date) {
  let d = date instanceof Date ? date : new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

// Parses a YYYY-MM-DD string as a local date (midnight local time)
export function parseLocalDate(str) {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}
