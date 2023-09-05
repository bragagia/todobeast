import classNames from "classnames";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useReplicache } from "../../ReplicacheProvider";
import { TaskType } from "../../db/tasks";
import { IconCalendar } from "../../utils/Icons";
import { DayjsDate } from "../../utils/PlainDate";
import useDate from "../../utils/UseDate";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import "react-day-picker/dist/style.css";

export function TaskDate({ task }: { task: TaskType }) {
  const rep = useReplicache();

  const [open, setOpen] = useState(false);

  let taskDate = task.date ? new DayjsDate(task.date) : null;

  let today = useDate();

  let taskIsLate =
    taskDate &&
    taskDate.isBefore(today) &&
    (!task.done_at || dayjs(task.done_at).startOf("day").isAfter(task.date));

  let dateFormatted = "Set date";
  let noDate = true;

  if (taskDate) {
    noDate = false;

    if (taskDate.isSame(today)) {
      dateFormatted = "Today";
    } else {
      dateFormatted = taskDate.format("dddd\nD MMMM");

      if (taskDate.Year() !== dayjs().year()) {
        dateFormatted = taskDate.format("\nYYYY");
      }
    }
  }

  const setTaskDate = useCallback(
    async function (date: Date | undefined) {
      setOpen(false);

      await rep.mutate.taskUpdate({
        id: task.id,
        date: date ? new DayjsDate(date.toISOString()).toString() : null,
      });
    },
    [task, rep]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={classNames(
            "text-xs font-light flex flex-row gap-2 items-center button w-full",
            { "text-gray-400": noDate },
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
      </PopoverTrigger>

      <PopoverContent className="">
        <DayPicker
          mode="single"
          // TODO: captionLayout="dropdown-buttons" is not working for some reason...
          fromDate={today.toDate()}
          selected={taskDate?.toDate()}
          onSelect={setTaskDate}
        />
      </PopoverContent>
    </Popover>
  );
}
