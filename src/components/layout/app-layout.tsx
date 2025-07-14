import { ReactNode, useState } from "react";
import { RootLayout } from "./root-layout";
import { Header } from "./header";
import { MainContent } from "./main-content";
import { BottomNav } from "./bottom-nav";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Home, Users, Trophy, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  user?: {
    displayName: string;
    email: string;
  } | null;
  onLogout?: () => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "groups", label: "Groups", icon: Users },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "profile", label: "Profile", icon: User },
];

export function AppLayout({
  children,
  activeTab = "dashboard",
  onTabChange,
  user,
  onLogout,
}: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange?.(tab);
    setIsMenuOpen(false);
  };

  return (
    <RootLayout>
      <Header
        showMenu={true}
        onMenuClick={() => setIsMenuOpen(true)}
        user={user}
        onLogout={onLogout}
      />

      <MainContent showBottomNav={true}>{children}</MainContent>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Mobile Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-80">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full">
            {/* User Info */}
            {user && (
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">{user.displayName}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleTabChange(item.id)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Button>
              {onLogout && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                  onClick={onLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </RootLayout>
  );
}
