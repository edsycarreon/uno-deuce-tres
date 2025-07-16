import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TodaysLogsCardProps {
  todaysLogsCount: number;
  currentStreak: number;
}

export function TodaysLogsCard({
  todaysLogsCount,
  currentStreak,
}: TodaysLogsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Today&apos;s Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{todaysLogsCount}</div>
        <p className="text-xs text-muted-foreground">
          {currentStreak} day streak
        </p>
      </CardContent>
    </Card>
  );
}

interface CurrentStreakCardProps {
  currentStreak: number;
}

export function CurrentStreakCard({ currentStreak }: CurrentStreakCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentStreak}</div>
        <p className="text-xs text-muted-foreground">days in a row</p>
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  todaysLogsCount: number;
  currentStreak: number;
}

export function StatsCards({
  todaysLogsCount,
  currentStreak,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <TodaysLogsCard
        todaysLogsCount={todaysLogsCount}
        currentStreak={currentStreak}
      />
      <CurrentStreakCard currentStreak={currentStreak} />
    </div>
  );
}
