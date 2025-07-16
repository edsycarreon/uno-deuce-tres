import { format, getISOWeek } from "date-fns";
import { Timestamp } from "firebase/firestore";

export function getPoopLogKeysAndTimestamps(date: Date = new Date()) {
  const timestamp = Timestamp.fromDate(date);
  const createdAt = Timestamp.fromDate(date);
  const dayKey = format(date, "yyyy-MM-dd");
  const weekKey = `${format(date, "yyyy")}-W${getISOWeek(date)}`;
  const monthKey = format(date, "yyyy-MM");
  return { timestamp, createdAt, dayKey, weekKey, monthKey };
}
