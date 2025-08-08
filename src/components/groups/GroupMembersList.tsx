"use client";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Crown, User } from "lucide-react";
import { useGroupMembers } from "../../hooks/useGroups";
import Loading from "../ui/Loading";

interface GroupMembersListProps {
  groupId: string;
}

export const GroupMembersList = ({ groupId }: GroupMembersListProps) => {
  const { members, isLoading, error } = useGroupMembers(groupId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load members
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No members found
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {members.map((member) => (
        <div
          key={member.userId}
          className="flex items-center justify-between p-3 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {member.displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">
                  {member.displayName}
                </p>
                {member.role === "admin" ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Crown className="h-3 w-3" />
                    Admin
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-xs"
                  >
                    <User className="h-3 w-3" />
                    Member
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Joined {member.joinedAt.toDate().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium">
              {member.stats.totalLogs} logs
            </div>
            <div className="text-xs text-muted-foreground">
              {member.stats.currentStreak} day streak
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
