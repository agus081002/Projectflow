import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View project deadlines and team schedules.
          </p>
        </div>
      
      <Card>
        <CardContent className="p-2">
          <Calendar
            mode="range"
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
