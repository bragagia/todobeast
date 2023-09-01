import classNames from "classnames";
import dayjs from "dayjs";
import { IconCalendar } from "../../utils/Icons";
import { DayjsDate } from "../../utils/PlainDate";
import useDate from "../../utils/UseDate";
import { TaskType } from "../../db/tasks";

export function TaskDate({ task }: { task: TaskType }) {
  let taskDate = task.date ? new DayjsDate(task.date) : null;

  let today = useDate();

  let taskIsLate =
    taskDate &&
    taskDate.isBefore(today) &&
    (!task.done_at || dayjs(task.done_at).startOf("day").isAfter(task.date));

  let dateFormatted = "No date";

  if (taskDate) {
    if (taskDate.isSame(today)) {
      dateFormatted = "Today";
    } else {
      dateFormatted = taskDate.format("dddd\nD MMMM");

      if (taskDate.Year() !== dayjs().year()) {
        dateFormatted = taskDate.format("\nYYYY");
      }
    }
  }

  return (
    <button
      className={classNames(
        "text-xs font-light flex flex-row gap-2 items-center button md:text-sm w-full",
        { "!font-bold text-red-700": taskIsLate }
      )}
    >
      <div className="flex items-center justify-center w-4 h-4 overflow-hidden">
        <IconCalendar />
      </div>

      <div className="flex flex-row items-start gap-1 md:flex-col md:gap-0">
        {dateFormatted.split("\n").map((dateLine, i) => {
          return <div key={"date-line/" + i}>{dateLine}</div>;
        })}
      </div>
    </button>
  );
}
