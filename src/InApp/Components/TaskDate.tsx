import classNames from "classnames";
import dayjs from "dayjs";
import { TaskType } from "../../FakeData";
import { IconCalendar } from "../../utils/Icons";

export function TaskDate({ task }: { task: TaskType }) {
  let taskDate = dayjs(task.date).startOf("day");

  let today = dayjs().startOf("day");

  let taskIsLate =
    taskDate.isBefore(today) &&
    (!task.done_at || dayjs(task.done_at).isAfter(task.date));

  let dateFormatted = "Today";

  if (!taskDate.isSame(today)) {
    dateFormatted = taskDate.format("dddd\nD MMMM");

    if (taskDate.year() != dayjs().year()) {
      dateFormatted = taskDate.format("\nYYYY");
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
          return <div key={i}>{dateLine}</div>;
        })}
      </div>
    </button>
  );
}
