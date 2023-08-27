import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { UrlPlanner } from "../../../Router";
import { WeeklyCalendarNavItemBeast } from "./WeeklyCalendarNavItemBeast";
import { WeeklyCalendarNavItemDate } from "./WeeklyCalendarNavItemDate";

export function WeeklyCalendarNavItem({ date }: { date: Dayjs }) {
  const navigate = useNavigate();

  let { year, month, day } = useParams();
  let selectedDate: Dayjs;
  if (day) {
    selectedDate = dayjs(year + "-" + month + "-" + day, "YYYY-MM-DD");
  } else {
    selectedDate = dayjs().startOf("day");
  }

  date = date.startOf("day");
  const itemIsToday = dayjs(date).startOf("day").isSame(dayjs().startOf("day"));

  let itemIsActive = date.isSame(selectedDate);

  function handleClick() {
    navigate(UrlPlanner(date));
  }

  return (
    <button
      id={"weekly-calendar-nav-item-" + dayjs(date).format("YYYY/MM/DD")}
      key={"weekly-calendar-nav-item-" + dayjs(date).format("YYYY/MM/DD")}
      onClick={handleClick}
      className={classNames(
        "pt-2 flex flex-row grow justify-center opacity-40 hover:opacity-90 animated border-b hover:bg-gray-100",
        {
          "!opacity-100 border-gray-600": itemIsActive,
          "border-gray-300 hover:border-black": !itemIsActive,
        }
      )}
    >
      {itemIsToday ? <WeeklyCalendarNavItemBeast date={date} /> : ""}
      <WeeklyCalendarNavItemDate date={date} />
    </button>
  );
}
