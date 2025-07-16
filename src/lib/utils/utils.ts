/**
 * Converts a Firestore Timestamp, Date, or string to a JS Date object.
 * @param ts - Firestore Timestamp-like object, Date, or string
 * @returns Date
 */
export function toDateFromFirestore(
  ts: { seconds: number; nanoseconds: number } | Date | string
): Date {
  if (ts && typeof ts === "object" && "seconds" in ts && "nanoseconds" in ts) {
    return new Date((ts as { seconds: number }).seconds * 1000);
  }
  if (typeof ts === "string") return new Date(ts);
  if (
    typeof ts === "object" &&
    ts !== null &&
    Object.prototype.toString.call(ts) === "[object Date]"
  )
    return ts as Date;
  return new Date();
}
