import { Button } from "@/components/ui/button";

import { Home, Users, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const tabs = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "groups", label: "Groups", icon: Users },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "profile", label: "Profile", icon: User },
];

export function BottomNav({
  activeTab,
  onTabChange,
  className,
}: BottomNavProps) {
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
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
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
