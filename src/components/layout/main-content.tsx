import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MainContentProps {
  children: ReactNode;
  className?: string;
  showBottomNav?: boolean;
}

export function MainContent({
  children,
  className,
  showBottomNav = true,
}: MainContentProps) {
  return (
    <main
      className={cn(
        "flex-1",
        "px-4 py-4",
        "pb-20", // Space for bottom nav
        showBottomNav ? "pb-20" : "pb-4",
        "overflow-y-auto",
        "safe-area-inset-x", // iOS safe area
        className
      )}
    >
      {children}
    </main>
  );
}
