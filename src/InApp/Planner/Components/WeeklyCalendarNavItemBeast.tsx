import { Dayjs } from "dayjs";

export function WeeklyCalendarNavItemBeast({ date }: { date: Dayjs }) {
  return (
    <div className="flex flex-col items-center gap-1 mr-2">
      <span className="text-xs font-bold text-center text-red-600">
        Streak 2
      </span>
      <img src="/beast-happy.png" className="w-8 h-8" alt="" />
    </div>
  );
}
