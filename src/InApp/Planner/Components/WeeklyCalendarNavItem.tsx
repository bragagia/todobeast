import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { NavLink } from "react-router-dom";
import { WeeklyCalendarNavItemBeast } from "./WeeklyCalendarNavItemBeast";
import { WeeklyCalendarNavItemDate } from "./WeeklyCalendarNavItemDate";

export function WeeklyCalendarNavItem({ date }: { date: Dayjs }) {
  date = date.startOf("day");

  const itemIsToday = dayjs(date).startOf("day").isSame(dayjs().startOf("day"));

  return (
    <NavLink
      id={"weekly-calendar-nav-item-" + dayjs(date).format("YYYY/MM/DD")}
      key={"weekly-calendar-nav-item-" + dayjs(date).format("YYYY/MM/DD")}
      to={
        itemIsToday
          ? "/planner/today"
          : "/planner/" + dayjs(date).format("YYYY/MM/DD")
      }
      className={({ isActive, isPending }) =>
        classNames(
          "flex flex-row grow justify-center opacity-40 hover:opacity-90 animated",
          {
            "!opacity-100": isActive,
          }
        )
      }
    >
      {itemIsToday ? <WeeklyCalendarNavItemBeast date={date} /> : ""}
      <WeeklyCalendarNavItemDate date={date} />
    </NavLink>
  );
}
