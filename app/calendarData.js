class calendarData {
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
      const localDate = new Date(d);
      const formattedDate = localDate.toLocaleDateString("en-CA");
      monthDays.push({
        date: formattedDate,
        day: d.getDate(),
        weekday: d.getDay(),
      });
    }

    if (monthDays.length) months.push({ name: currentMonth, days: monthDays });
    return months;
  }
}

export default calendarData;
