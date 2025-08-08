"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfilePage() {
  const { user } = useAuth();
  const { userProfile } = useUserProfile();

  return (
    <div className="space-y-6 pt-2">
      <h1 className="text-2xl font-bold">Profile</h1>

      {user && (
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {userProfile?.displayName || user.email}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            {userProfile?.stats && (
              <p>
                <span className="font-medium">Current Streak:</span>{" "}
                {userProfile.stats.currentStreak} days
              </p>
            )}
          </div>
        </div>
      )}

      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">
          More profile features coming soon! ⚙️🚽
        </p>
      </div>
    </div>
  );
}
