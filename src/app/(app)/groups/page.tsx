"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

import { Plus, Users, UserPlus } from "lucide-react";
import { CreateGroupForm } from "../../../components/forms/CreateGroupForm";
import { JoinGroupForm } from "../../../components/forms/JoinGroupForm";
import { GroupCard } from "../../../components/groups/GroupCard";
import { useGroups } from "../../../hooks/useGroups";
import Loading from "../../../components/ui/Loading";

export default function GroupsPage() {
  const { groups, isLoading, error } = useGroups();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
  };

  const handleJoinSuccess = () => {
    setShowJoinDialog(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pt-2">
        <h1 className="text-2xl font-bold">Groups</h1>
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pt-2">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">
              Failed to load groups. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-muted-foreground">
            Connect with friends and track your poop streaks together.
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Join Group</DialogTitle>
                <DialogDescription>
                  Enter an invite code to join an existing group
                </DialogDescription>
              </DialogHeader>
              <JoinGroupForm
                onSuccess={handleJoinSuccess}
                onCancel={() => setShowJoinDialog(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  Start a new poop tracking group and invite your friends
                </DialogDescription>
              </DialogHeader>
              <CreateGroupForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {groups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Create a new group or join an existing one to start competing with
              friends!
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
              <Button variant="outline" onClick={() => setShowJoinDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {groups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Group Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{groups.length}</div>
                <div className="text-sm text-muted-foreground">
                  Groups Joined
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {groups.reduce(
                    (sum, group) => sum + group.stats.memberCount,
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Members
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {groups.reduce(
                    (sum, group) => sum + group.stats.totalLogs,
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Group Logs
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {
                    groups.filter(
                      (group) => group.createdBy === groups[0]?.createdBy
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Groups Created
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
