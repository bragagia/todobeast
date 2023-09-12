import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TaskType } from "../../../../db/tasks";
import { IconChevronLeft, IconChevronRight } from "../../../utils/Icons";
import { DayjsDate } from "../../../utils/PlainDate";
import useDate from "../../../utils/UseDate";
import { AnimatedTranslate } from "../../Components/AnimatedTranslate";
import { WeeklyCalendarNavItem } from "./WeeklyCalendarNavItem";

export function WeeklyCalendarNav({
  tasksByDays,
}: {
  tasksByDays: {
    [key: string]: TaskType[];
  };
}) {
  let { year, month, day } = useParams();

  const todayDate = useDate();

  const urlDate = useMemo(() => {
    return year && month && day ? new DayjsDate(year, month, day) : todayDate;
  }, [year, month, day, todayDate]);

  const [selectedWeekStartDate, setSelectedWeekStartDate] = useState(
    urlDate.startOfWeek()
  );

  useEffect(() => {
    let newSelectedWeekStartDate = urlDate.startOfWeek();
    setSelectedWeekStartDate(newSelectedWeekStartDate);
  }, [urlDate]);

  const weekDates = useMemo(() => {
    var weekDates: DayjsDate[] = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(selectedWeekStartDate.addDays(i));
    }
    return weekDates;
  }, [selectedWeekStartDate]);

  function handlePreviousWeek() {
    setSelectedWeekStartDate(selectedWeekStartDate.addDays(-7));
  }

  function handleNextWeek() {
    setSelectedWeekStartDate(selectedWeekStartDate.addDays(7));
  }

  return (
    <div className="flex flex-row items-center justify-center w-full mx-auto group">
      <button
        onClick={handlePreviousWeek}
        className="flex items-center self-stretch justify-center w-12 text-gray-500 md:w-16 grow pointer-fine:invisible group-hover:visible hover:text-black button"
      >
        <IconChevronLeft />
      </button>

      <AnimatedTranslate
        childKey={"week-planner/week/" + selectedWeekStartDate.toString()}
      >
        <div className="flex flex-row items-center justify-center w-full">
          {weekDates.map((date) => {
            return (
              <WeeklyCalendarNavItem
                key={"day-nav-item/" + date.toString()}
                date={date}
                tasksByDays={tasksByDays}
              />
            );
          })}
        </div>
      </AnimatedTranslate>

      <button
        onClick={handleNextWeek}
        className="flex items-center self-stretch justify-center w-12 text-gray-500 md:w-16 grow pointer-fine:invisible group-hover:visible hover:text-black button"
      >
        <IconChevronRight />
      </button>
    </div>
  );
}
