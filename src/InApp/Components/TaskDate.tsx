import classNames from "classnames";
import dayjs from "dayjs";
import { useState } from "react";
import { dataTasks } from "../../FakeData";

export function TaskDate({ taskId }: { taskId: number }) {
  const [task, setTask] = useState(dataTasks[taskId]);

  let taskDate = task.date.startOf("day");

  let today = dayjs().startOf("day");

  let taskIsLate =
    taskDate.isBefore(today) &&
    (!task.done_at || task.done_at.isAfter(task.date));

  let dateFormatted = "Today";
  let dateFormattedSecondLine = "";

  if (!taskDate.isSame(today)) {
    dateFormatted = taskDate.format("dddd");
    dateFormattedSecondLine = taskDate.format("D MMMM");
    if (taskDate.year() != dayjs().year()) {
      dateFormatted += taskDate.format(" YYYY");
    }
  }

  return (
    <button
      className={classNames(
        "text-xs font-light sm:text-center text-right button sm:text-sm w-full",
        { "!font-bold text-red-700": taskIsLate }
      )}
    >
      {dateFormatted} <br className="hidden sm:block" />
      {dateFormattedSecondLine}
    </button>
  );
}
