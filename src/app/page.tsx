"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, userProfile, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    // Optionally show a loading spinner
    return <div>Loading...</div>;
  }

  // If authenticated, show dashboard
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/signin");
    }
  };

  const handleAddClick = () => {
    console.log("Add poop log clicked");
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
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Today&apos;s Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userProfile?.stats.totalLogs || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.stats.currentStreak || 0} day streak
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userProfile?.stats.currentStreak || 0}
                </div>
                <p className="text-xs text-muted-foreground">days in a row</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest bathroom visits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userProfile?.stats.totalLogs === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No logs yet. Start tracking!
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Just now</p>
                        <p className="text-xs text-muted-foreground">
                          Public log
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Public</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">2 hours ago</p>
                        <p className="text-xs text-muted-foreground">
                          Private log
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Private</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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
        >
          💩
        </Button>
      </div>
    </AppLayout>
  );
}
