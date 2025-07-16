import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PoopSpinner from "@/components/ui/PoopSpinner";

export interface CurrentStreakCardProps {
  currentStreak?: number;
  isLoading: boolean;
}

export function CurrentStreakCard({
  currentStreak,
  isLoading,
}: CurrentStreakCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-12">
            <PoopSpinner size={32} />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
