"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Users,
  Crown,
  Shield,
  MoreVertical,
  Copy,
  Settings,
  UserMinus,
  Trash2,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import type { GroupDocument } from "../../types";
import {
  useIsGroupAdmin,
  useGroups,
  useInviteCode,
} from "../../hooks/useGroups";
import { GroupMembersList } from "./GroupMembersList";
import { GroupLeaderboard } from "./GroupLeaderboard";

interface GroupCardProps {
  group: GroupDocument;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const isAdmin = useIsGroupAdmin(group);
  const { leaveGroup, deleteGroup, isLeaving, isDeleting } = useGroups();
  const { generateNewInviteCode, isGenerating } = useInviteCode();
  const [showMembers, setShowMembers] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      toast.success("Invite code copied to clipboard!");
    } catch {
      toast.error("Failed to copy invite code");
    }
  };

  const copyInviteLink = async () => {
    try {
      const link = `${window.location.origin}/groups/join/${group.inviteCode}`;
      await navigator.clipboard.writeText(link);
      toast.success("Invite link copied to clipboard!");
    } catch {
      toast.error("Failed to copy invite link");
    }
  };

  const handleLeaveGroup = () => {
    if (confirm("Are you sure you want to leave this group?")) {
      leaveGroup(group.id);
    }
  };

  const handleDeleteGroup = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteGroup = () => {
    deleteGroup(group.id);
    setShowDeleteConfirm(false);
  };

  const handleGenerateNewCode = () => {
    if (
      confirm("Generate a new invite code? The old code will no longer work.")
    ) {
      generateNewInviteCode(group.id);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                {isAdmin && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Crown className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
                {group.settings.isPrivate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Private
                  </Badge>
                )}
              </div>
              {group.description && (
                <CardDescription>{group.description}</CardDescription>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyInviteCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Invite Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyInviteLink}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copy Invite Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowMembers(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  View Members
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowLeaderboard(true)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Leaderboard
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleGenerateNewCode}
                      disabled={isGenerating}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Generate New Code
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDeleteGroup}
                      className="text-destructive"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Group
                    </DropdownMenuItem>
                  </>
                )}
                {!isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLeaveGroup}
                      className="text-destructive"
                      disabled={isLeaving}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Leave Group
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Members</span>
                <span className="font-medium">
                  {group.stats.memberCount}/{group.settings.maxMembers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Logs</span>
                <span className="font-medium">{group.stats.totalLogs}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {group.createdAt.toDate().toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Invite Code</span>
                <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {group.inviteCode}
                </code>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLeaderboard(true)}
              className="flex-1"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Leaderboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMembers(true)}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              Members ({group.stats.memberCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Dialog */}
      <Dialog open={showMembers} onOpenChange={setShowMembers}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{group.name} - Members</DialogTitle>
            <DialogDescription>
              {group.stats.memberCount} member
              {group.stats.memberCount !== 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>
          <GroupMembersList groupId={group.id} />
        </DialogContent>
      </Dialog>

      {/* Leaderboard Dialog */}
      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{group.name} - Leaderboard</DialogTitle>
            <DialogDescription>
              Rankings based on total poop logs
            </DialogDescription>
          </DialogHeader>
          <GroupLeaderboard groupId={group.id} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{group.name}&quot;? This
              action cannot be undone. All members will be removed and the group
              data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteGroup}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Group"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
