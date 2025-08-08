"use client";

import { Button } from "@/components/ui/button";
import { Home, Users, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

interface BottomNavProps {
  className?: string;
}

const tabs = [
  { id: "dashboard", label: "Home", icon: Home, path: "/dashboard" },
  { id: "groups", label: "Groups", icon: Users, path: "/groups" },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: Trophy,
    path: "/leaderboard",
  },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export function BottomNav({ className }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-t border-border",
        "safe-area-inset-bottom", // iOS safe area
        "max-w-md mx-auto", // Match root layout
        "sm:max-w-lg md:max-w-xl lg:max-w-2xl",
        className
      )}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => router.push(tab.path)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3",
                "text-xs font-medium",
                isActive
                  ? "bg-[color:var(--color-main)] text-[color:var(--color-main-foreground)] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={
                isActive ? { boxShadow: "0 2px 8px 0 var(--color-main)" } : {}
              }
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
