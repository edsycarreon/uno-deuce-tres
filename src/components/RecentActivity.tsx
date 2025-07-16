import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PoopSpinner from "@/components/ui/PoopSpinner";
import { Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PoopLogDocument } from "@/types";
import { toDateFromFirestore } from "@/lib/utils/utils";

interface RecentActivityProps {
  logs: PoopLogDocument[];
  logsLoading: boolean;
  logsError: unknown;
  poopLogsData: unknown;
}

export function RecentActivity({
  logs,
  logsLoading,
  logsError,
  poopLogsData,
}: RecentActivityProps) {
  const sortedLogs = [...logs].sort(
    (a, b) =>
      toDateFromFirestore(b.timestamp).getTime() -
      toDateFromFirestore(a.timestamp).getTime()
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest bathroom visits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {logsLoading || !poopLogsData ? (
          <div className="text-center py-8 text-muted-foreground">
            <PoopSpinner />
          </div>
        ) : logsError ? (
          <div className="text-center py-8 text-red-500">
            Failed to load logs
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No logs yet. Start tracking!
            </p>
          </div>
        ) : (
          sortedLogs.map((log) => {
            const logDate = toDateFromFirestore(log.timestamp);
            return (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 ${
                      log.isPublic ? "bg-green-500" : "bg-blue-500"
                    } rounded-full`}
                  ></div>
                  <div>
                    <p className="font-medium">
                      {formatDistanceToNow(logDate, { addSuffix: true })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.isPublic ? "Public log" : "Private log"}
                    </p>
                  </div>
                </div>
                <Badge variant={log.isPublic ? "secondary" : "outline"}>
                  {log.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
