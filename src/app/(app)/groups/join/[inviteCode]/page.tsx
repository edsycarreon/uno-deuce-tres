"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { JoinGroupForm } from "../../../../../components/forms/JoinGroupForm";
import Loading from "../../../../../components/ui/Loading";
import { useInviteCode } from "../../../../../hooks/useGroups";
import { Users, Shield, Calendar, AlertTriangle } from "lucide-react";

export default function JoinGroupPage() {
  const { inviteCode } = useParams();
  const router = useRouter();
  const { previewData, previewGroupByInviteCode } = useInviteCode();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroupPreview = async () => {
      if (!inviteCode || typeof inviteCode !== "string") {
        setError("Invalid invite code");
        setIsLoading(false);
        return;
      }

      try {
        const result = await previewGroupByInviteCode(inviteCode.toUpperCase());
        if (!result) {
          setError("Invalid or expired invite code");
        }
      } catch {
        setError("Failed to load group information");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupPreview();
  }, [inviteCode, previewGroupByInviteCode]);

  const handleJoinSuccess = () => {
    router.push("/groups");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loading />
          <p className="text-muted-foreground">Loading group information...</p>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-lg font-semibold text-destructive">
              Invalid Invite
            </h3>
            <p className="text-sm text-muted-foreground">
              {error || "This invite code is invalid or has expired."}
            </p>
            <Button onClick={() => router.push("/groups")} variant="outline">
              Go to Groups
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { group, inviteCodeData } = previewData;
  const isExpired =
    inviteCodeData.expiresAt && inviteCodeData.expiresAt.toDate() < new Date();
  const isAtCapacity = group.stats.memberCount >= group.settings.maxMembers;
  const isMaxUsesReached =
    inviteCodeData.maxUses &&
    inviteCodeData.currentUses >= inviteCodeData.maxUses;
  const isInactive = !inviteCodeData.isActive;

  const canJoin =
    !isExpired && !isAtCapacity && !isMaxUsesReached && !isInactive;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Group Information Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CardTitle className="text-xl">{group.name}</CardTitle>
              {group.settings.isPrivate && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Private
                </Badge>
              )}
            </div>
            {group.description && (
              <CardDescription className="text-center">
                {group.description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {group.stats.memberCount}/{group.settings.maxMembers} members
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Created {group.createdAt.toDate().toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Validation Messages */}
            {!canJoin && (
              <div className="space-y-2 p-3 bg-destructive/10 rounded-lg">
                <h4 className="text-sm font-medium text-destructive">
                  Cannot Join Group:
                </h4>
                <ul className="space-y-1 text-sm text-destructive">
                  {isInactive && <li>• Invite code is no longer active</li>}
                  {isExpired && <li>• Invite code has expired</li>}
                  {isMaxUsesReached && (
                    <li>• Invite code has reached maximum uses</li>
                  )}
                  {isAtCapacity && <li>• Group is at maximum capacity</li>}
                </ul>
              </div>
            )}

            {canJoin && (
              <div className="text-center text-sm text-muted-foreground">
                You&apos;re invited to join this group! Use the form below to
                join.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Join Form or Alternative Actions */}
        {canJoin ? (
          <JoinGroupForm
            initialInviteCode={inviteCode as string}
            onSuccess={handleJoinSuccess}
            onCancel={() => router.push("/groups")}
          />
        ) : (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                This invite is no longer valid, but you can still browse other
                groups or create your own.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push("/groups")}
                  variant="outline"
                  className="flex-1"
                >
                  Browse Groups
                </Button>
                <Button
                  onClick={() => router.push("/groups")}
                  className="flex-1"
                >
                  Create Group
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
