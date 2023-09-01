import classNames from "classnames";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TaskType } from "../../../FakeData";
import { UrlPlanner } from "../../../Router";
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
      className={classNames("grow opacity-40 hover:opacity-90 border-b", {
        "!opacity-100 border-gray-600": itemIsActive,
        "border-gray-300": !itemIsActive,
      })}
    >
      <div
        className={classNames("flex flex-row justify-center mb-2 button", {
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
