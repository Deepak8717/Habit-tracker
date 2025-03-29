class Calendar {
  static generateYearlyCalendar() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    let months = [];
    let currentMonth = null;
    let monthDays = [];

    for (
      let d = new Date(startOfYear);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      const monthName = d.toLocaleString("default", { month: "long" });

      if (monthName !== currentMonth) {
        if (currentMonth) months.push({ name: currentMonth, days: monthDays });
        currentMonth = monthName;
        monthDays = [];
      }

      monthDays.push({
        date: d.toISOString().split("T")[0],
        day: d.getDate(),
        weekday: d.getDay(),
      });
    }

    if (monthDays.length) months.push({ name: currentMonth, days: monthDays });
    return months;
  }
}

export default Calendar;
