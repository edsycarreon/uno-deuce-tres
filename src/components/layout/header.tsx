import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
  user?: {
    displayName: string;
    email: string;
  } | null;
  onLogout?: () => void;
  className?: string;
}

export function Header({
  title = "Uno Deuce Tres",
  showMenu = false,
  onMenuClick,
  user,
  onLogout,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "bg-[color:var(--color-secondary-background)]",
        "border-b border-[color:var(--color-border)]",
        "px-4 py-3",
        "flex items-center justify-between",
        "safe-area-inset-top", // iOS safe area
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showMenu && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-9 w-9 hidden md:inline-flex"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-[color:var(--color-foreground)]">
          {title}
        </h1>
      </div>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="flex flex-col items-start p-3">
              <span className="font-medium">{user.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
