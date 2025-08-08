"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { RootLayout } from "@/components/layout/root-layout";
import { Header } from "@/components/layout/header";
import { MainContent } from "@/components/layout/main-content";
import { BottomNav } from "@/components/layout/bottom-nav";
import Loading from "../../components/ui/Loading";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { userProfile } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/signin");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <RootLayout>
      <Header
        showMenu={true}
        user={
          userProfile || {
            displayName: user?.email || "User",
            email: user?.email || "",
          }
        }
        onLogout={handleLogout}
      />

      <MainContent showBottomNav={true}>{children}</MainContent>

      <BottomNav />
    </RootLayout>
  );
}
