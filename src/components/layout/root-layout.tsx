import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: ReactNode;
  className?: string;
}

export function RootLayout({ children, className }: RootLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        "flex flex-col",
        "max-w-md mx-auto", // Center on larger screens, max width for mobile
        "sm:max-w-lg md:max-w-xl lg:max-w-2xl", // Responsive max widths
        className
      )}
    >
      {children}
    </div>
  );
}
