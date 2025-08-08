import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type {
  GroupDocument,
  GroupMemberDocument,
  InviteCodeDocument,
  UserDocument,
} from "../../types";

// Generate a random 6-character invite code
export const generateInviteCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new group
export const createGroup = async (
  groupData: Omit<
    GroupDocument,
    "id" | "createdAt" | "inviteCode" | "stats" | "memberIds"
  >,
  creatorUser: UserDocument
): Promise<string> => {
  const batch = writeBatch(db);

  // Generate group ID and invite code
  const groupRef = doc(collection(db, "groups"));
  const groupId = groupRef.id;
  const inviteCode = generateInviteCode();

  // Create group document
  const group: GroupDocument = {
    ...groupData,
    id: groupId,
    createdAt: serverTimestamp() as Timestamp,
    inviteCode,
    stats: {
      memberCount: 1,
      totalLogs: 0,
      lastActivity: serverTimestamp() as Timestamp,
    },
    memberIds: [creatorUser.id],
  };

  batch.set(groupRef, group);

  // Create group member document for creator
  const memberRef = doc(db, `groups/${groupId}/members/${creatorUser.id}`);
  const memberData: GroupMemberDocument = {
    userId: creatorUser.id,
    displayName: creatorUser.displayName,
    role: "admin",
    joinedAt: serverTimestamp() as Timestamp,
    lastActivity: serverTimestamp() as Timestamp,
    stats: {
      totalLogs: creatorUser.stats.publicLogs, // Use existing public logs
      currentStreak: creatorUser.stats.currentStreak,
      longestStreak: creatorUser.stats.longestStreak,
    },
  };

  batch.set(memberRef, memberData);

  // Update user's groups array
  const userRef = doc(db, `users/${creatorUser.id}`);
  batch.update(userRef, {
    groups: [...creatorUser.groups, groupId],
  });

  // Create invite code document
  const inviteCodeRef = doc(db, `inviteCodes/${inviteCode}`);
  const inviteCodeData: InviteCodeDocument = {
    code: inviteCode,
    groupId,
    createdAt: serverTimestamp() as Timestamp,
    currentUses: 0,
    isActive: true,
  };

  batch.set(inviteCodeRef, inviteCodeData);

  await batch.commit();
  return groupId;
};

// Join a group via invite code
export const joinGroupByInviteCode = async (
  inviteCode: string,
  user: UserDocument
): Promise<string> => {
  // Get invite code document
  const inviteCodeRef = doc(db, `inviteCodes/${inviteCode}`);
  const inviteCodeSnap = await getDoc(inviteCodeRef);

  if (!inviteCodeSnap.exists()) {
    throw new Error("Invalid invite code");
  }

  const inviteCodeData = inviteCodeSnap.data() as InviteCodeDocument;

  if (!inviteCodeData.isActive) {
    throw new Error("Invite code is no longer active");
  }

  if (
    inviteCodeData.expiresAt &&
    inviteCodeData.expiresAt.toDate() < new Date()
  ) {
    throw new Error("Invite code has expired");
  }

  if (
    inviteCodeData.maxUses &&
    inviteCodeData.currentUses >= inviteCodeData.maxUses
  ) {
    throw new Error("Invite code has reached maximum uses");
  }

  // Get group document
  const groupRef = doc(db, `groups/${inviteCodeData.groupId}`);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data() as GroupDocument;

  // Check if user is already a member
  if (groupData.memberIds.includes(user.id)) {
    throw new Error("You are already a member of this group");
  }

  // Check group capacity
  if (groupData.stats.memberCount >= groupData.settings.maxMembers) {
    throw new Error("Group is at maximum capacity");
  }

  const batch = writeBatch(db);

  // Add user to group members
  const memberRef = doc(db, `groups/${groupData.id}/members/${user.id}`);
  const memberData: GroupMemberDocument = {
    userId: user.id,
    displayName: user.displayName,
    role: "member",
    joinedAt: serverTimestamp() as Timestamp,
    lastActivity: serverTimestamp() as Timestamp,
    stats: {
      totalLogs: user.stats.publicLogs, // Use existing public logs
      currentStreak: user.stats.currentStreak,
      longestStreak: user.stats.longestStreak,
    },
  };

  batch.set(memberRef, memberData);

  // Update group stats and member list
  batch.update(groupRef, {
    "stats.memberCount": increment(1),
    memberIds: [...groupData.memberIds, user.id],
  });

  // Update user's groups array
  const userRef = doc(db, `users/${user.id}`);
  batch.update(userRef, {
    groups: [...user.groups, groupData.id],
  });

  // Update invite code usage
  batch.update(inviteCodeRef, {
    currentUses: increment(1),
  });

  await batch.commit();
  return groupData.id;
};

// Leave a group
export const leaveGroup = async (
  groupId: string,
  userId: string
): Promise<void> => {
  const batch = writeBatch(db);

  // Get group document
  const groupRef = doc(db, `groups/${groupId}`);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data() as GroupDocument;

  // Check if user is the creator/admin
  if (groupData.createdBy === userId) {
    throw new Error(
      "Group creators cannot leave their own group. Transfer ownership or delete the group instead."
    );
  }

  // Remove member document
  const memberRef = doc(db, `groups/${groupId}/members/${userId}`);
  batch.delete(memberRef);

  // Update group stats and member list
  const updatedMemberIds = groupData.memberIds.filter((id) => id !== userId);
  batch.update(groupRef, {
    "stats.memberCount": increment(-1),
    memberIds: updatedMemberIds,
  });

  // Update user's groups array
  const userRef = doc(db, `users/${userId}`);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data() as UserDocument;
    const updatedGroups = userData.groups.filter((id) => id !== groupId);
    batch.update(userRef, {
      groups: updatedGroups,
    });
  }

  await batch.commit();
};

// Get user's groups
export const getUserGroups = async (
  groupIds: string[]
): Promise<GroupDocument[]> => {
  if (groupIds.length === 0) return [];

  const groups: GroupDocument[] = [];

  // Fetch groups individually to handle missing/deleted groups gracefully
  // This avoids permission errors when some groups in the batch don't exist
  const groupPromises = groupIds.map(async (groupId) => {
    try {
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      if (groupDoc.exists()) {
        return { ...groupDoc.data(), id: groupDoc.id } as GroupDocument;
      }
      // Group doesn't exist - this is expected when groups are deleted
      return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle permission errors gracefully - this happens when trying to access
      // a group that was deleted or when user is no longer a member
      if (
        error.code === "permission-denied" ||
        error?.message?.includes("Missing or insufficient permissions")
      ) {
        console.log(
          `No permission to access group ${groupId} (likely deleted)`
        );
        return null;
      }
      console.error(`Error fetching group ${groupId}:`, error);
      return null;
    }
  });

  const results = await Promise.all(groupPromises);

  // Filter out null results (groups that don't exist or failed to fetch)
  results.forEach((group) => {
    if (group) {
      groups.push(group);
    }
  });

  return groups;
};

// Clean up stale group references from user's profile
export const cleanupUserGroupReferences = async (
  userId: string,
  currentGroupIds: string[],
  validGroupIds: string[]
): Promise<void> => {
  // Only update if there are stale references
  if (validGroupIds.length !== currentGroupIds.length) {
    try {
      const userRef = doc(db, `users/${userId}`);
      const batch = writeBatch(db);
      batch.update(userRef, { groups: validGroupIds });
      await batch.commit();
      console.log(
        `Cleaned up ${
          currentGroupIds.length - validGroupIds.length
        } stale group references for user ${userId}`
      );
    } catch (error) {
      console.error("Failed to cleanup user group references:", error);
    }
  }
};

// Get group members
export const getGroupMembers = async (
  groupId: string
): Promise<GroupMemberDocument[]> => {
  const membersRef = collection(db, `groups/${groupId}/members`);
  const q = query(membersRef, orderBy("joinedAt", "asc"));

  const querySnapshot = await getDocs(q);
  const members: GroupMemberDocument[] = [];

  querySnapshot.forEach((doc) => {
    members.push(doc.data() as GroupMemberDocument);
  });

  return members;
};

// Get group by invite code
export const getGroupByInviteCode = async (
  inviteCode: string
): Promise<{
  group: GroupDocument;
  inviteCodeData: InviteCodeDocument;
} | null> => {
  const inviteCodeRef = doc(db, `inviteCodes/${inviteCode}`);
  const inviteCodeSnap = await getDoc(inviteCodeRef);

  if (!inviteCodeSnap.exists()) {
    return null;
  }

  const inviteCodeData = inviteCodeSnap.data() as InviteCodeDocument;

  const groupRef = doc(db, `groups/${inviteCodeData.groupId}`);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    return null;
  }

  const group = { ...groupSnap.data(), id: groupSnap.id } as GroupDocument;

  return { group, inviteCodeData };
};

// Generate new invite code for a group
export const generateNewInviteCode = async (
  groupId: string,
  adminUserId: string
): Promise<string> => {
  // Verify admin permissions
  const groupRef = doc(db, `groups/${groupId}`);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data() as GroupDocument;

  if (groupData.createdBy !== adminUserId) {
    throw new Error("Only group admins can generate new invite codes");
  }

  const batch = writeBatch(db);

  // Deactivate old invite code
  const oldInviteCodeRef = doc(db, `inviteCodes/${groupData.inviteCode}`);
  batch.update(oldInviteCodeRef, { isActive: false });

  // Generate new invite code
  const newInviteCode = generateInviteCode();

  // Create new invite code document
  const newInviteCodeRef = doc(db, `inviteCodes/${newInviteCode}`);
  const newInviteCodeData: InviteCodeDocument = {
    code: newInviteCode,
    groupId,
    createdAt: serverTimestamp() as Timestamp,
    currentUses: 0,
    isActive: true,
  };

  batch.set(newInviteCodeRef, newInviteCodeData);

  // Update group with new invite code
  batch.update(groupRef, { inviteCode: newInviteCode });

  await batch.commit();
  return newInviteCode;
};

// Delete a group (admin only)
export const deleteGroup = async (
  groupId: string,
  adminUserId: string
): Promise<void> => {
  // Verify admin permissions
  const groupRef = doc(db, `groups/${groupId}`);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data() as GroupDocument;

  if (groupData.createdBy !== adminUserId) {
    throw new Error("Only group creators can delete groups");
  }

  const batch = writeBatch(db);

  // Get all members
  const members = await getGroupMembers(groupId);

  // Remove group from all members' user documents
  for (const member of members) {
    const userRef = doc(db, `users/${member.userId}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserDocument;
      const updatedGroups = userData.groups.filter((id) => id !== groupId);
      batch.update(userRef, { groups: updatedGroups });
    }

    // Delete member document
    const memberRef = doc(db, `groups/${groupId}/members/${member.userId}`);
    batch.delete(memberRef);
  }

  // Deactivate invite code
  const inviteCodeRef = doc(db, `inviteCodes/${groupData.inviteCode}`);
  batch.update(inviteCodeRef, { isActive: false });

  // Delete group document
  batch.delete(groupRef);

  await batch.commit();
};
