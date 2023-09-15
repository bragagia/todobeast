import classNames from "classnames";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import {
  IconCalendar,
  IconChevronDoubleRight,
  IconChevronRight,
  IconCircleArrowUp,
} from "../../utils/Icons";
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

  let taskIsLate = taskDate && taskDate.isBefore(today) && !task.done_at;

  let dateFormatted = "Set date";
  let dateTooltip: string | undefined;
  let noDate = true;

  if (mode == "default") {
    if (taskDate) {
      noDate = false;
      dateTooltip = taskDate.format("dddd, MMMM D, YYYY");

      if (taskDate.isSame(today)) {
        dateFormatted = "Today";
      } else if (taskDate.isSame(today.addDays(-1))) {
        dateFormatted = "Yesterday";
      } else if (taskIsLate) {
        dateFormatted = taskDate.relativeFrom(today);
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
          title={dateTooltip}
          className={classNames(
            "h-full text-xs font-light flex flex-row gap-2 items-center button-gray-200 lg:w-28",
            { "text-gray-300 hover:text-gray-500": noDate },
            { "text-red-700": taskIsLate }
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

      <PopoverContent className="flex flex-col items-start py-1">
        <button
          className={classNames("popover-button text-gray-400", {
            "popover-button-active": !taskDate,
          })}
          onClick={() => setTaskDate(undefined)}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex items-center justify-center w-4 h-4">
              <IconCalendar />
            </div>

            <span>No date</span>
          </div>
        </button>

        <button
          className={classNames("popover-button", {
            "popover-button-active": taskDate?.isSame(today),
          })}
          onClick={() => setTaskDate(today.toDate())}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="relative flex items-center justify-center w-4 h-4">
              <IconCalendar />

              <span className="absolute top-[0.03rem] text-[0.4rem]">
                {today.format("DD")}
              </span>
            </div>

            <span>Today</span>
          </div>

          <span className="text-gray-400">{today.format("ddd")}</span>
        </button>

        <button
          className={classNames("popover-button", {
            "popover-button-active": taskDate?.isSame(tomorrow),
          })}
          onClick={() => setTaskDate(tomorrow.toDate())}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex items-center justify-center w-4 h-4">
              <IconChevronRight />
            </div>

            <span>Tomorrow</span>
          </div>

          <span className="text-gray-400">{tomorrow.format("ddd")}</span>
        </button>

        <button
          className={classNames("popover-button", {
            "popover-button-active": taskDate?.isSame(nextWeek),
          })}
          onClick={() => setTaskDate(nextWeek.toDate())}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex items-center justify-center w-4 h-4">
              <IconChevronDoubleRight />
            </div>

            <span>Next week</span>
          </div>

          <span className="text-gray-400">{nextWeek.format("ddd")}</span>
        </button>

        <div className="border-b border-gray-200 w-full my-1"></div>

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
