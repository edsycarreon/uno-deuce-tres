import { PoopLogDocument } from "@/types";
import type { Firestore } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Log a poop and update all related stats atomically.
 *
 * @param db - The Firestore instance (adminDb or client db)
 * @param userId - The user's ID
 * @param logData - The poop log data (excluding id)
 */
export const logPoopWithUpdates = async (
  db: Firestore,
  userId: string,
  logData: Omit<PoopLogDocument, "id">
) => {
  const batch = db.batch();

  // Add the log
  const logRef = db.collection(`users/${userId}/poopLogs`).doc();
  batch.set(logRef, {
    ...logData,
    id: logRef.id,
  });

  // Update user stats
  const userRef = db.collection("users").doc(userId);
  batch.update(userRef, {
    "stats.totalLogs": FieldValue.increment(1),
    "stats.publicLogs": FieldValue.increment(logData.isPublic ? 1 : 0),
    lastActive: FieldValue.serverTimestamp(),
  });

  // Update daily stats
  const dailyStatsRef = db
    .collection(`users/${userId}/dailyStats`)
    .doc(logData.dayKey);
  batch.set(
    dailyStatsRef,
    {
      date: logData.dayKey,
      userId,
      totalLogs: FieldValue.increment(1),
      publicLogs: FieldValue.increment(logData.isPublic ? 1 : 0),
      [`groups`]: logData.groups.reduce((acc, groupId) => {
        acc[groupId] = { logs: FieldValue.increment(1) };
        return acc;
      }, {} as Record<string, { logs: ReturnType<typeof FieldValue.increment> }>),
      timestamps: [logData.timestamp],
    },
    { merge: true }
  );

  await batch.commit();
};
