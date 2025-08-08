"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  joinGroupSchema,
  type JoinGroupFormData,
} from "../../lib/validations/schemas";
import { useGroups, useInviteCode } from "../../hooks/useGroups";
import { Users, Shield, Calendar } from "lucide-react";

interface JoinGroupFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialInviteCode?: string;
}

export const JoinGroupForm = ({
  onSuccess,
  onCancel,
  initialInviteCode,
}: JoinGroupFormProps) => {
  const { joinGroup, isJoining } = useGroups();
  const { previewData, previewGroupByInviteCode, clearPreview } =
    useInviteCode();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const form = useForm<JoinGroupFormData>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      inviteCode: initialInviteCode || "",
    },
  });

  const watchedInviteCode = form.watch("inviteCode");

  const handlePreview = async () => {
    const inviteCode = form.getValues("inviteCode");
    if (!inviteCode.trim()) return;

    setIsPreviewLoading(true);
    try {
      await previewGroupByInviteCode(inviteCode.trim().toUpperCase());
    } catch (error) {
      console.error("Preview error:", error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const onSubmit = async (data: JoinGroupFormData) => {
    try {
      joinGroup(data.inviteCode.trim().toUpperCase());
      form.reset();
      clearPreview();
      onSuccess?.();
    } catch (error) {
      console.error("Join group error:", error);
    }
  };

  const handleInviteCodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    form.setValue("inviteCode", upperValue);

    // Clear preview if invite code changes
    if (previewData && upperValue !== previewData.inviteCodeData.code) {
      clearPreview();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Join Group</CardTitle>
          <CardDescription>
            Enter an invite code to join an existing group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="inviteCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite Code</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="ABC123"
                          {...field}
                          onChange={(e) =>
                            handleInviteCodeChange(e.target.value)
                          }
                          disabled={isJoining || isPreviewLoading}
                          className="uppercase"
                          maxLength={20}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePreview}
                          disabled={
                            !watchedInviteCode.trim() ||
                            isPreviewLoading ||
                            isJoining
                          }
                        >
                          {isPreviewLoading ? "..." : "Preview"}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Get the invite code from a group admin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isJoining}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isJoining || !previewData}
                  className="flex-1"
                >
                  {isJoining ? "Joining..." : "Join Group"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Group Preview */}
      {previewData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {previewData.group.name}
              </CardTitle>
              {previewData.group.settings.isPrivate && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Private
                </Badge>
              )}
            </div>
            {previewData.group.description && (
              <CardDescription>{previewData.group.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {previewData.group.stats.memberCount}/
                  {previewData.group.settings.maxMembers} members
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Created{" "}
                  {previewData.group.createdAt.toDate().toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Validation Messages */}
            <div className="mt-4 space-y-2">
              {!previewData.inviteCodeData.isActive && (
                <div className="text-sm text-destructive">
                  ⚠️ This invite code is no longer active
                </div>
              )}

              {previewData.inviteCodeData.expiresAt &&
                previewData.inviteCodeData.expiresAt.toDate() < new Date() && (
                  <div className="text-sm text-destructive">
                    ⚠️ This invite code has expired
                  </div>
                )}

              {previewData.inviteCodeData.maxUses &&
                previewData.inviteCodeData.currentUses >=
                  previewData.inviteCodeData.maxUses && (
                  <div className="text-sm text-destructive">
                    ⚠️ This invite code has reached its usage limit
                  </div>
                )}

              {previewData.group.stats.memberCount >=
                previewData.group.settings.maxMembers && (
                <div className="text-sm text-destructive">
                  ⚠️ This group is at maximum capacity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
