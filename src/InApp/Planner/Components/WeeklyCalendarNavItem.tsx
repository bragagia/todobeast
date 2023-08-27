import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { useParams } from "react-router-dom";
import { WeeklyCalendarNavItemBeast } from "./WeeklyCalendarNavItemBeast";
import { WeeklyCalendarNavItemDate } from "./WeeklyCalendarNavItemDate";

export function WeeklyCalendarNavItem({
  date: itemDate,
  dateChange,
}: {
  date: Dayjs;
  dateChange: (arg0: Dayjs) => void;
}) {
  let { year, month, day } = useParams();
  let selectedDate: Dayjs;
  if (day) {
    selectedDate = dayjs(year + "-" + month + "-" + day, "YYYY-MM-DD");
  } else {
    selectedDate = dayjs().startOf("day");
  }

  itemDate = itemDate.startOf("day");
  const itemIsToday = dayjs(itemDate)
    .startOf("day")
    .isSame(dayjs().startOf("day"));

  let itemIsActive = itemDate.isSame(selectedDate);

  function handleClick() {
    dateChange(itemDate);
  }

  return (
    <button
      id={"weekly-calendar-nav-item-" + dayjs(itemDate).format("YYYY/MM/DD")}
      key={"weekly-calendar-nav-item-" + dayjs(itemDate).format("YYYY/MM/DD")}
      onClick={handleClick}
      className={classNames(
        "flex flex-row grow justify-center opacity-40 hover:opacity-90 animated",
        {
          "!opacity-100": itemIsActive,
        }
      )}
    >
      {itemIsToday ? <WeeklyCalendarNavItemBeast date={itemDate} /> : ""}
      <WeeklyCalendarNavItemDate date={itemDate} />
    </button>
  );
}
