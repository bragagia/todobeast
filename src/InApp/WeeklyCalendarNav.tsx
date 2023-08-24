import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  IconBug,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
} from "../Icons";
import { dataTasks } from "../fakeData";

dayjs.extend(require("dayjs/plugin/weekday"));

declare module "dayjs" {
  interface Dayjs {
    weekday(): number;
  }
}

export function WeeklyCalendarNav() {
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
    <div className="flex flex-row items-center justify-center max-w-xl gap-3 mx-auto sm:gap-4 group">
      <button
        onClick={handlePreviousWeek}
        className="text-gray-500 animated no-touch:opacity-0 group-hover:opacity-100 hover:text-black"
      >
        <IconChevronLeft />
      </button>

      {weekDates.map((date) => {
        return <CalendarDayItem date={date} />;
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

function CalendarDayItem({ date }: { date: Dayjs }) {
  date = date.startOf("day");

  const dayLetter = dayjs(date).format("dd").substring(0, 1);

  const beforeToday = dayjs(date)
    .startOf("day")
    .isBefore(dayjs().startOf("day"));
  const isToday = dayjs(date).startOf("day").isSame(dayjs().startOf("day"));

  let dailyTasks = dataTasks.filter((task) => {
    return task.date.startOf("day").isSame(date);
  });

  let tasksDoneCount = dailyTasks.filter((task) => {
    return task.done;
  }).length;

  const tasksPendingCount = dailyTasks.length - tasksDoneCount;

  function DateDisplay() {
    return (
      <div className="flex flex-col items-center h-16">
        <div className="text-xs">{dayLetter}</div>

        <div>{date.date()}</div>

        <div
          className={classNames(
            "flex items-center justify-center w-4 h-4 p-[2px] text-xs text-white bg-black rounded-full",
            {
              invisible: false,
              "bg-green-600": beforeToday || isToday,
              "bg-violet-600":
                beforeToday && tasksDoneCount != dailyTasks.length,
            }
          )}
        >
          {beforeToday ? (
            tasksDoneCount == dailyTasks.length ? (
              <IconCheck />
            ) : (
              <IconBug />
            )
          ) : tasksPendingCount < 10 ? (
            tasksPendingCount
          ) : (
            "+"
          )}
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={
        isToday
          ? "/planner/today"
          : "/planner/" + dayjs(date).format("YYYY/MM/DD")
      }
      className={({ isActive, isPending }) =>
        classNames(
          "flex flex-row grow items-center justify-center opacity-40 hover:opacity-90 animated",
          {
            "!opacity-100": isActive,
            "w-18": isToday,
          }
        )
      }
    >
      {isToday ? (
        <img src="/beast-happy.png" className="w-8 h-8 mr-2" alt="" />
      ) : (
        ""
      )}
      <DateDisplay />
    </NavLink>
  );
}
