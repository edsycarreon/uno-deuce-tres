"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogPoop, usePoopLogs } from "@/hooks/usePoopLogs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { toDateFromFirestore } from "@/lib/utils/utils";

export function PoopLogger() {
  const [isPublic, setIsPublic] = useState(false);
  const { user } = useAuth();
  const { mutate: logPoop, isPending } = useLogPoop();
  const { data: poopLogsData, isLoading: isLoadingLogs } = usePoopLogs(10);
  const { handleError } = useErrorHandler();

  const handleLogPoop = () => {
    if (!user) {
      handleError(
        new Error("You must be logged in to log a poop"),
        "Authentication Required"
      );
      return;
    }

    const now = new Date();
    const dayKey = now.toISOString().split("T")[0]; // YYYY-MM-DD format

    const logData = {
      userId: user.uid,
      timestamp: Timestamp.fromDate(now),
      isPublic,
      createdAt: Timestamp.fromDate(now),
      dayKey,
      weekKey: getWeekKey(now),
      monthKey: getMonthKey(now),
      groups: [], // Empty for now, can be populated later
    };

    logPoop(logData, {
      onSuccess: () => {
        toast.success("Poop logged successfully! 💩");
        setIsPublic(false);
      },
      onError: (error) => {
        handleError(error, "Failed to log poop");
      },
    });
  };

  const getWeekKey = (date: Date) => {
    const year = date.getFullYear();
    const week = Math.ceil(
      (date.getDate() + new Date(year, date.getMonth(), 1).getDay()) / 7
    );
    return `${year}-W${week.toString().padStart(2, "0")}`;
  };

  const getMonthKey = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Poop 💩</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="isPublic" className="text-sm">
              Make this log public
            </label>
          </div>

          <Button
            onClick={handleLogPoop}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Logging..." : "Log Poop"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <p>Loading logs...</p>
          ) : poopLogsData?.logs?.length ? (
            <div className="space-y-2">
              {poopLogsData.logs.map(
                (log: {
                  id: string;
                  timestamp: { seconds: number; nanoseconds: number } | Date;
                  isPublic: boolean;
                }) => (
                  <div
                    key={log.id}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <span>
                      {toDateFromFirestore(log.timestamp).toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        log.isPublic
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {log.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No logs yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
