import classNames from "classnames";
import { TaskType } from "../../../../db/tasks";
import { IconBug, IconCheck } from "../../../utils/Icons";
import { DayjsDate } from "../../../utils/PlainDate";
import useDate from "../../../utils/UseDate";

export function WeeklyCalendarNavItemDate({
  date,
  dailyTasks,
}: {
  date: DayjsDate;
  dailyTasks: TaskType[];
}) {
  const todayDate = useDate();

  const itemIsToday = date.isSame(todayDate);

  const dayLetter = date.format("ddd");

  const beforeToday = date.isBefore(new DayjsDate());

  let tasksCount = dailyTasks ? dailyTasks.length : 0;

  let tasksDoneCount = dailyTasks
    ? dailyTasks.filter((task) => {
        return task.done_at;
      }).length
    : 0;

  const tasksPendingCount = tasksCount - tasksDoneCount;

  return (
    <div className="flex flex-col items-center h-16">
      <div className={classNames("text-xs", { "font-bold": itemIsToday })}>
        {dayLetter}
      </div>

      <div className={classNames({ "font-bold": itemIsToday })}>
        {date.Day()}
      </div>

      <div
        className={classNames(
          "flex items-center border justify-center w-4 h-4 p-[2px] text-xs rounded-full border-black text-black",
          {
            "!border-green-600 !text-green-600": beforeToday || itemIsToday,
            "!border-violet-600 !text-violet-600":
              beforeToday && tasksDoneCount !== tasksCount,
            invisible: tasksCount === 0,
          }
        )}
      >
        {beforeToday ? (
          tasksDoneCount === tasksCount ? (
            <IconCheck />
          ) : (
            <IconBug />
          )
        ) : tasksPendingCount === 0 ? (
          itemIsToday ? (
            <IconCheck />
          ) : (
            ""
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
