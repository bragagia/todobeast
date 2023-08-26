import classNames from "classnames";
import dayjs from "dayjs";
import { useState } from "react";
import { dataTasks } from "../../FakeData";
import { IconCalendar } from "../../utils/Icons";

export function TaskDate({ taskId }: { taskId: number }) {
  const [task, setTask] = useState(dataTasks[taskId]);

  let taskDate = task.date.startOf("day");

  let today = dayjs().startOf("day");

  let taskIsLate =
    taskDate.isBefore(today) &&
    (!task.done_at || task.done_at.isAfter(task.date));

  let dateFormattedFirstLine = "Today";
  let dateFormattedSecondLine = "";
  let dateFormattedThirdLine = "";

  if (!taskDate.isSame(today)) {
    dateFormattedFirstLine = taskDate.format("dddd");
    dateFormattedSecondLine = taskDate.format("D MMMM");

    if (taskDate.year() != dayjs().year()) {
      dateFormattedThirdLine = taskDate.format(" YYYY");
    }
  }

  return (
    <button
      className={classNames(
        "text-xs font-light flex flex-row gap-2 items-center button sm:text-sm w-full",
        { "!font-bold text-red-700": taskIsLate }
      )}
    >
      <div className="flex items-center justify-center w-4 h-4 overflow-hidden">
        <IconCalendar />
      </div>

      <div className="flex flex-row gap-1 md:flex-col md:gap-0">
        <div>{dateFormattedFirstLine}</div>
        <div>{dateFormattedSecondLine}</div>
        <div>{dateFormattedThirdLine}</div>
      </div>
    </button>
  );
}
