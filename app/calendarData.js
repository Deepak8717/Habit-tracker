class CalendarData {
  // Formats a date to "yyyy-mm-dd" format (ISO 8601)
  static formatDate(date) {
    return date.toLocaleDateString("en-CA");
  }

  // Gets the day of the week (0 = Sunday, 1 = Monday, etc.)
  static getWeekday(date) {
    return date.getDay();
  }

  // Generates the days of a given month from start to end
  static generateMonthData(monthStart, monthEnd) {
    const daysInMonth = Array.from({ length: monthEnd.getDate() }, (_, i) => {
      const date = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth(),
        i + 1
      );
      return {
        date: this.formatDate(date),
        day: date.getDate(),
        weekday: this.getWeekday(date),
      };
    });
    return daysInMonth;
  }

  // Generates a yearly calendar from January 1st to today
  static generateYearlyCalendar() {
    const today = new Date();
    if (isNaN(today)) {
      throw new Error("Invalid current date");
    }

    const startOfYear = new Date(today.getFullYear(), 0, 1); // Start from Jan 1st
    const totalDays = Math.floor((today - startOfYear) / (1000 * 3600 * 24)); // Total days between Jan 1st and today
    let months = [];

    // Loop through each month of the year
    for (let i = 0; i <= today.getMonth(); i++) {
      const monthStart = new Date(today.getFullYear(), i, 1);
      const monthEnd = new Date(today.getFullYear(), i + 1, 0); // Last day of the month

      const monthName = monthStart.toLocaleString("default", { month: "long" });
      const monthDays = this.generateMonthData(monthStart, monthEnd);

      months.push({
        name: monthName,
        days: monthDays,
      });
    }

    return months;
  }
}

export default CalendarData;
