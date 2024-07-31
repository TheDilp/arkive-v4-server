export function getDateStringHoursFromNow(hours: number = 1) {
  const now = new Date();
  now.setHours(now.getHours() + hours);

  const dateStr = now.toDateString();
  const timeStr = now.toTimeString().split(" ")[0]; // Get the time part and remove the timezone information

  return `${dateStr} ${timeStr}`;
}
