import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PoopSpinner from "@/components/ui/PoopSpinner";

export interface TodaysLogsCardProps {
  todaysLogsCount?: number;
  currentStreak?: number;
  isLoading: boolean;
}

export function TodaysLogsCard({
  todaysLogsCount,
  currentStreak,
  isLoading,
}: TodaysLogsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Today&apos;s Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-12">
            <PoopSpinner size={32} />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{todaysLogsCount}</div>
            <p className="text-xs text-muted-foreground">
              {currentStreak} day streak
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
