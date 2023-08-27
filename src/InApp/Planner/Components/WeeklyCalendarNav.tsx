import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "../../../utils/Icons";
import { WeeklyCalendarNavItem } from "./WeeklyCalendarNavItem";

dayjs.extend(require("dayjs/plugin/weekday"));

declare module "dayjs" {
  interface Dayjs {
    weekday(): number;
  }
}

export function WeeklyCalendarNav({
  dateChange,
}: {
  dateChange: (arg0: Dayjs) => void;
}) {
  const [selectedWeekStartDate, setSelectedWeekStartDate] = useState(
    dayjs().add(-dayjs().startOf("day").weekday(), "day")
  );

  function handlePreviousWeek() {
    setSelectedWeekStartDate(selectedWeekStartDate.add(-7, "day"));
  }

  function handleNextWeek() {
    setSelectedWeekStartDate(selectedWeekStartDate.add(7, "day"));
  }

  var weekDates: Dayjs[] = [];
  for (let i = 0; i < 7; i++) {
    weekDates.push(selectedWeekStartDate.add(i, "day"));
  }

  return (
    <div className="flex flex-row items-center justify-center max-w-xl gap-3 mx-auto mb-4 sm:gap-4 group">
      <button
        onClick={handlePreviousWeek}
        className="text-gray-500 animated no-touch:opacity-0 group-hover:opacity-100 hover:text-black"
      >
        <IconChevronLeft />
      </button>

      {weekDates.map((date) => {
        return <WeeklyCalendarNavItem dateChange={dateChange} date={date} />;
      })}

      <button
        onClick={handleNextWeek}
        className="text-gray-500 animated no-touch:opacity-0 group-hover:opacity-100 hover:text-black"
      >
        <IconChevronRight />
      </button>
    </div>
  );
}
