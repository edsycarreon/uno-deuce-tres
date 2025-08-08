import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface TodaysLogsCardProps {
  todaysLogsCount?: number;
  isLoading: boolean;
}

export function TodaysLogsCard({
  todaysLogsCount,
  isLoading,
}: TodaysLogsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Today&apos;s Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? 0 : todaysLogsCount}
        </div>
        <p className="text-xs text-muted-foreground">bombs dropped</p>
      </CardContent>
    </Card>
  );
}
