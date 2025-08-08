"use client";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { useGroupLeaderboard } from "../../hooks/useGroups";
import Loading from "../ui/Loading";

interface GroupLeaderboardProps {
  groupId: string;
}

export const GroupLeaderboard = ({ groupId }: GroupLeaderboardProps) => {
  const { leaderboard, isLoading, error } = useGroupLeaderboard(groupId);

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
        Failed to load leaderboard
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No members found
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-medium text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {leaderboard.map((member, index) => {
        const rank = index + 1;
        return (
          <div
            key={member.userId}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              rank <= 3 ? "bg-muted/50" : "bg-card"
            }`}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(rank)}
            </div>

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
                {rank <= 3 && (
                  <Badge
                    variant={getRankBadgeVariant(rank)}
                    className="text-xs"
                  >
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"} #{rank}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Current: {member.stats.currentStreak} days</span>
                <span>Best: {member.stats.longestStreak} days</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold">{member.stats.totalLogs}</div>
              <div className="text-xs text-muted-foreground">logs</div>
            </div>
          </div>
        );
      })}

      {leaderboard.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No data available yet. Start logging to see the leaderboard!
        </div>
      )}
    </div>
  );
};
