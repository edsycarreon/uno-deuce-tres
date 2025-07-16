import { TodaysLogsCard } from "@/components/dashboard/TodaysLogsCard";
import { CurrentStreakCard } from "@/components/dashboard/CurrentStreakCard";

interface StatsCardsProps {
  todaysLogsCount?: number;
  currentStreak?: number;
  isLoading: boolean;
}

export function StatsCards({
  todaysLogsCount,
  currentStreak,
  isLoading,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <TodaysLogsCard todaysLogsCount={todaysLogsCount} isLoading={isLoading} />
      <CurrentStreakCard currentStreak={currentStreak} isLoading={isLoading} />
    </div>
  );
}
