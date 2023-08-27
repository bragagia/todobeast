import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { dataTasks } from "../../../FakeData";
import { IconBug, IconCheck } from "../../../utils/Icons";

export function WeeklyCalendarNavItemDate({ date }: { date: Dayjs }) {
  date = date.startOf("day");

  const itemIsToday = dayjs(date).startOf("day").isSame(dayjs().startOf("day"));

  const dayLetter = dayjs(date).format("ddd");

  const beforeToday = dayjs(date)
    .startOf("day")
    .isBefore(dayjs().startOf("day"));

  let dailyTasks = dataTasks.filter((task) => {
    return task.date.startOf("day").isSame(date);
  });

  let tasksDoneCount = dailyTasks.filter((task) => {
    return task.done_at;
  }).length;

  const tasksPendingCount = dailyTasks.length - tasksDoneCount;
  return (
    <div className="flex flex-col items-center h-16">
      <div className={classNames("text-xs", { "font-bold": itemIsToday })}>
        {dayLetter}
      </div>

      <div className={classNames({ "font-bold": itemIsToday })}>
        {date.date()}
      </div>

      <div
        className={classNames(
          "flex items-center justify-center w-4 h-4 p-[2px] text-xs text-white bg-black rounded-full",
          {
            invisible: false,
            "bg-green-600": beforeToday || itemIsToday,
            "bg-violet-600": beforeToday && tasksDoneCount != dailyTasks.length,
            "bg-transparent text-transparent": dailyTasks.length == 0,
          }
        )}
      >
        {beforeToday ? (
          tasksDoneCount == dailyTasks.length ? (
            <IconCheck />
          ) : (
            <IconBug />
          )
        ) : tasksPendingCount == 0 ? (
          ""
        ) : tasksPendingCount < 10 ? (
          tasksPendingCount
        ) : (
          "+"
        )}
      </div>
    </div>
  );
}
