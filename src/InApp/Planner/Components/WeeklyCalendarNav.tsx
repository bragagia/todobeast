import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { IconChevronLeft, IconChevronRight } from "../../../utils/Icons";
import { AnimatedTranslate } from "../../Components/AnimatedTranslate";
import { WeeklyCalendarNavItem } from "./WeeklyCalendarNavItem";

dayjs.extend(require("dayjs/plugin/weekday"));

declare module "dayjs" {
  interface Dayjs {
    weekday(): number;
  }
}

export function WeeklyCalendarNav() {
  let { year, month, day } = useParams();

  let urlDate: Dayjs;
  if (day) {
    urlDate = dayjs(year + "-" + month + "-" + day, "YYYY-MM-DD");
  } else {
    urlDate = dayjs().startOf("day");
  }

  const [selectedWeekStartDate, setSelectedWeekStartDate] = useState(
    urlDate.add(-urlDate.startOf("day").weekday(), "day")
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
    <div className="flex flex-row items-center justify-center mx-auto mb-4 group">
      <button
        onClick={handlePreviousWeek}
        className="flex items-center self-stretch justify-center w-12 text-gray-500 bg-white md:w-16 grow animated no-touch:opacity-0 group-hover:opacity-100 hover:text-black hover:bg-gray-100"
      >
        <IconChevronLeft />
      </button>

      <AnimatedTranslate
        childKey={"week-" + selectedWeekStartDate.format("YYYY/MM/DD")}
      >
        <div className="flex flex-row items-center justify-center w-full">
          {weekDates.map((date) => {
            return (
              <WeeklyCalendarNavItem
                key={"day-nav-item-" + date.format("YYYY/MM/DD")}
                date={date}
              />
            );
          })}
        </div>
      </AnimatedTranslate>

      <button
        onClick={handleNextWeek}
        className="flex items-center self-stretch justify-center w-12 text-gray-500 bg-white md:w-16 grow animated no-touch:opacity-0 group-hover:opacity-100 hover:text-black hover:bg-gray-100"
      >
        <IconChevronRight />
      </button>
    </div>
  );
}
