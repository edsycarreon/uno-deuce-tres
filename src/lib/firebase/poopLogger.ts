import { db } from "./config";
import {
  collection,
  doc,
  writeBatch,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { PoopLogDocument } from "@/types";

/**
 * Log a poop and update all related stats atomically.
 *
 * @param userId - The user's ID
 * @param logData - The poop log data (excluding id)
 */
export const logPoopWithUpdates = async (
  userId: string,
  logData: Omit<PoopLogDocument, "id">
) => {
  const batch = writeBatch(db);

  // Add the log
  const logRef = doc(collection(db, `users/${userId}/poopLogs`));
  batch.set(logRef, {
    ...logData,
    id: logRef.id,
  });

  // Update user stats
  const userRef = doc(db, `users/${userId}`);
  batch.update(userRef, {
    "stats.totalLogs": increment(1),
    "stats.publicLogs": increment(logData.isPublic ? 1 : 0),
    lastActive: serverTimestamp(),
  });

  // Update daily stats
  const dailyStatsRef = doc(db, `users/${userId}/dailyStats/${logData.dayKey}`);
  batch.set(
    dailyStatsRef,
    {
      date: logData.dayKey,
      userId,
      totalLogs: increment(1),
      publicLogs: increment(logData.isPublic ? 1 : 0),
      [`groups`]: logData.groups.reduce((acc, groupId) => {
        acc[groupId] = { logs: increment(1) };
        return acc;
      }, {} as Record<string, { logs: ReturnType<typeof increment> }>),
      timestamps: [logData.timestamp],
    },
    { merge: true }
  );

  await batch.commit();
};
