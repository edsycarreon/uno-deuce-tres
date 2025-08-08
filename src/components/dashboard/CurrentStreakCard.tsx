import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
        <div className="text-2xl font-bold">
          {isLoading ? 0 : currentStreak}
        </div>
        <p className="text-xs text-muted-foreground">days in a row</p>
      </CardContent>
    </Card>
  );
}
