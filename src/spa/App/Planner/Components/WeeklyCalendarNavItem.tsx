import classNames from "classnames";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TaskType } from "../../../../db/tasks";
import { UrlPlanner } from "../../../AppRouter";
import { DayjsDate } from "../../../utils/PlainDate";
import useDate from "../../../utils/UseDate";
import { WeeklyCalendarNavItemBeast } from "./WeeklyCalendarNavItemBeast";
import { WeeklyCalendarNavItemDate } from "./WeeklyCalendarNavItemDate";

export function WeeklyCalendarNavItem({
  date,
  tasksByDays,
}: {
  date: DayjsDate;
  tasksByDays: {
    [key: string]: TaskType[];
  };
}) {
  const navigate = useNavigate();

  let { year, month, day } = useParams();

  const todayDate = useDate();

  const selectedDate = useMemo(() => {
    return year && month && day ? new DayjsDate(year, month, day) : todayDate;
  }, [year, month, day, todayDate]);

  const itemIsToday = useMemo(() => date.isSame(todayDate), [date, todayDate]);

  let itemIsActive = date.isSame(selectedDate);

  function handleClick() {
    navigate(UrlPlanner(date, todayDate));
  }

  return (
    <button
      onClick={handleClick}
      className={classNames("grow  hover:opacity-90", {
        "opacity-100": itemIsActive,
        "opacity-40": !itemIsActive,
      })}
    >
      <div
        className={classNames("flex flex-row justify-center button", {
          "button-active": itemIsActive,
        })}
      >
        {itemIsToday ? <WeeklyCalendarNavItemBeast date={date} /> : ""}
        <WeeklyCalendarNavItemDate
          date={date}
          dailyTasks={tasksByDays[date.toString()]}
        />
      </div>
    </button>
  );
}
