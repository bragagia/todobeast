import classNames from "classnames";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import { IconCalendar, IconCircleArrowUp } from "../../utils/Icons";
import { DayjsDate } from "../../utils/PlainDate";
import useDate from "../../utils/UseDate";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import "react-day-picker/dist/style.css";

import "./TaskDate.css";

export function TaskDate({
  task,
  mode = "default",
}: {
  task: TaskType;
  mode?: "default" | "priority-peek";
}) {
  const rep = useReplicache();

  const [open, setOpen] = useState(false);

  let taskDate = task.date ? new DayjsDate(task.date) : null;

  let today = useDate();
  let tomorrow = useMemo(() => today.addDays(1), [today]);
  let nextWeek = useMemo(() => today.addDays(7).startOfWeek(), [today]);

  let taskIsLate =
    taskDate &&
    taskDate.isBefore(today) &&
    (!task.done_at || dayjs(task.done_at).startOf("day").isAfter(task.date));

  let dateFormatted = "Set date";
  let noDate = true;

  if (mode == "default") {
    if (taskDate) {
      noDate = false;

      if (taskDate.isSame(today)) {
        dateFormatted = "Today";
      } else if (
        taskDate.isAfter(today) &&
        taskDate.addDays(-7).isBefore(today)
      ) {
        // Task in less than a week
        dateFormatted = taskDate.format("dddd");
      } else {
        dateFormatted = taskDate.format("ddd D MMM");

        if (taskDate.Year() !== dayjs().year()) {
          dateFormatted += taskDate.format("\nYYYY");
        }
      }
    }
  } else {
    noDate = false;
    dateFormatted = "Set today";
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

  const handleButtonClick = useCallback(() => {
    if (mode == "default") {
      setOpen(!open);
    } else {
      setTaskDate(today.toDate());
    }
  }, [open, mode, today, setTaskDate]);

  return (
    <Popover open={open} onOpenChange={handleButtonClick}>
      <PopoverTrigger asChild>
        <button
          className={classNames(
            "h-full text-xs font-light flex flex-row gap-2 items-center button lg:w-28",
            { "text-gray-300": noDate },
            { "!font-bold text-red-700": taskIsLate }
          )}
        >
          <div className="flex items-center justify-center w-4 h-4">
            {mode == "default" ? <IconCalendar /> : <IconCircleArrowUp />}
          </div>

          <div className="flex flex-row items-start gap-1 lg:flex-col lg:gap-0">
            {dateFormatted.split("\n").map((dateLine, i) => {
              return (
                <div key={"date-line/" + i} className="text-left">
                  {dateLine}
                </div>
              );
            })}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col items-start">
        <button
          className={classNames("popover-button", {
            "popover-button-active": taskDate?.isSame(today),
          })}
          onClick={() => setTaskDate(today.toDate())}
        >
          <span>Today</span>
          <span className="text-gray-500">{today.format("ddd")}</span>
        </button>

        <button
          className={classNames("popover-button", {
            "popover-button-active": taskDate?.isSame(tomorrow),
          })}
          onClick={() => setTaskDate(tomorrow.toDate())}
        >
          <span>Tomorrow</span>
          <span className="text-gray-500">{tomorrow.format("ddd")}</span>
        </button>

        <button
          className={classNames("popover-button", {
            "popover-button-active": taskDate?.isSame(nextWeek),
          })}
          onClick={() => setTaskDate(nextWeek.toDate())}
        >
          <span>Next week</span>
          <span className="text-gray-500">{nextWeek.format("ddd")}</span>
        </button>

        <button
          className={classNames("popover-button", {
            "popover-button-active": !taskDate,
          })}
          onClick={() => setTaskDate(undefined)}
        >
          <span>No date</span>
        </button>

        <DayPicker
          mode="single"
          captionLayout="dropdown-buttons"
          fromDate={today.toDate()}
          toYear={today.addDays(365 * 100).Year()}
          selected={taskDate?.toDate()}
          defaultMonth={taskDate?.toDate()}
          onSelect={setTaskDate}
          modifiersClassNames={{
            selected: "rdp-my-selected",
            today: "rdp-my-today",
          }}
          formatters={{
            formatWeekdayName: (date) =>
              new DayjsDate(date.toISOString()).format("ddd"),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
