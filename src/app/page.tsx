"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { useLogPoop, usePoopLogs } from "@/hooks/usePoopLogs";
import { format } from "date-fns";
import { useErrorHandler } from "@/hooks/useErrorHandler";

import { getPoopLogKeysAndTimestamps } from "@/lib/utils/poopLogKeys";
import { StatsCards } from "@/components/StatsCards";
import { RecentActivity } from "@/components/RecentActivity";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, userProfile, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const { mutate: logPoop, status: logPoopStatus } = useLogPoop();
  const { handleError } = useErrorHandler();
  const {
    data: poopLogsData,
    isLoading: logsLoading,
    error: logsError,
  } = usePoopLogs(10);
  const logs = (poopLogsData?.logs ||
    []) as import("@/types").PoopLogDocument[];
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todaysLogs = logs.filter(
    (log: import("@/types").PoopLogDocument) => log.dayKey === todayKey
  );

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, loading, router]);

  // If authenticated, show dashboard
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/signin");
    }
  };

  const handleAddClick = () => {
    if (!user) return;
    try {
      const { dayKey, weekKey, monthKey, timestamp, createdAt } =
        getPoopLogKeysAndTimestamps(new Date());
      logPoop(
        {
          userId: user.uid,
          timestamp,
          isPublic: true,
          createdAt,
          dayKey,
          weekKey,
          monthKey,
          groups: [],
        },
        {
          onError: (error) => {
            handleError(error, "Failed to log poop");
          },
        }
      );
    } catch (error) {
      handleError(error, "Failed to log poop");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      user={
        userProfile || {
          displayName: user?.email || "User",
          email: user?.email || "",
        }
      }
      onLogout={handleLogout}
    >
      <div className="flex flex-col min-h-[60vh] h-full justify-between gap-4">
        {/* Top: Stats and Recent Activity */}
        <div className="space-y-6 pt-2">
          {/* Quick Stats */}
          <StatsCards
            todaysLogsCount={todaysLogs.length}
            currentStreak={userProfile?.stats.currentStreak || 0}
            isLoading={logsLoading || !poopLogsData}
          />

          {/* Recent Activity */}
          <RecentActivity
            logs={logs}
            logsLoading={logsLoading}
            logsError={logsError}
            poopLogsData={poopLogsData}
          />
        </div>
      </div>
      {/* Floating Poop Button */}
      <div className="fixed z-50 bottom-24 right-6 sm:right-10 md:right-16 lg:right-1/4 flex justify-end pointer-events-none">
        <Button
          size="lg"
          className="rounded-xl h-28 w-28 flex items-center justify-center cursor-pointer pointer-events-auto border-2 border-[color:var(--color-border)] bg-[color:var(--color-main)] text-[3.5rem] shadow-[var(--shadow-shadow)] transition-transform duration-150 active:scale-95 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]"
          style={{ boxShadow: "var(--shadow-shadow)" }}
          onClick={handleAddClick}
          aria-label="Log poop"
          disabled={logPoopStatus === "pending"}
        >
          {logPoopStatus === "pending" ? (
            <span className="animate-spin">💩</span>
          ) : (
            "💩"
          )}
        </Button>
      </div>
    </AppLayout>
  );
}
