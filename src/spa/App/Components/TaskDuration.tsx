import classNames from "classnames";
import { useState } from "react";
import { DurationType, TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import { IconHourglass } from "../../utils/Icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function TaskDuration({ task }: { task: TaskType }) {
  const rep = useReplicache();

  const [open, setOpen] = useState(false);

  async function setTaskDuration(taskId: string, duration: DurationType) {
    await rep.mutate.taskUpdate({
      id: taskId,
      duration: duration,
    });
  }

  const durations = [
    {
      value: null as DurationType,
      text: "No duration",
      icon: <IconHourglass />,
      icon_color: "text-gray-400",
      text_color: "text-gray-400",
    },
    {
      value: "zero" as DurationType,
      text: "zero",
      icon: <span>0</span>,
      icon_color: "",
      text_color: "text-black",
      hide_selector_icon: true,
    },
    {
      value: "sixteenth" as DurationType,
      text: "30 min",
      icon: (
        <span className="flex flex-col items-center text-[0.6rem] leading-tight">
          <span>30</span>
          <span>min</span>
        </span>
      ),
      icon_color: "",
      text_color: "text-black",
      hide_selector_icon: true,
    },
    {
      value: "eighth" as DurationType,
      text: "1 hour",
      icon: (
        <span className="flex flex-col items-center text-[0.6rem] leading-tight">
          <span>1</span>
          <span>hour</span>
        </span>
      ),
      icon_color: "",
      text_color: "text-black",
      hide_selector_icon: true,
    },
    {
      value: "quarter" as DurationType,
      text: "2 hours",
      icon: (
        <span className="flex flex-col items-center text-[0.6rem] leading-tight">
          <span>2</span>
          <span>hours</span>
        </span>
      ),
      icon_color: "",
      text_color: "text-black",
      hide_selector_icon: true,
    },
    {
      value: "half" as DurationType,
      text: "4 hours",
      icon: (
        <span className="flex flex-col items-center text-[0.6rem] leading-tight">
          <span>4</span>
          <span>hours</span>
        </span>
      ),
      icon_color: "",
      text_color: "text-black",
      hide_selector_icon: true,
    },
    {
      value: "full" as DurationType,
      text: "1 day",
      icon: (
        <span className="flex flex-col items-center text-[0.6rem] leading-tight">
          <span>1</span>
          <span>day</span>
        </span>
      ),
      icon_color: "",
      text_color: "text-black",
      hide_selector_icon: true,
    },
    {
      value: "double" as DurationType,
      text: "2 days",
      icon: (
        <span className="flex flex-col items-center text-[0.6rem] leading-tight">
          <span>2</span>
          <span>days</span>
        </span>
      ),
      icon_color: "",
      text_color: "text-black",
      hide_selector_icon: true,
    },
    {
      value: "quadruple" as DurationType,
      text: "4 days",
      icon: (
        <span className="flex flex-col items-center text-[0.6rem] leading-tight">
          <span>4</span>
          <span>days</span>
        </span>
      ),
      icon_color: "",
      text_color: "text-black",
      hide_selector_icon: true,
    },
    {
      value: "longer" as DurationType,
      text: "Longer",
      icon: <span>∞</span>,
      icon_color: "",
      text_color: "text-black",
    },
  ];

  const TaskDuration =
    durations.find((duration) => duration.value === task.duration) ||
    durations[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={classNames(
            "flex h-full items-center w-full text-lg font-light button-gray-200",
            { "text-gray-300 hover:text-gray-500": !TaskDuration.value }
          )}
        >
          <div
            className={classNames(
              "flex items-center justify-center w-5 h-5",
              TaskDuration.value ? TaskDuration.icon_color : ""
            )}
          >
            {TaskDuration.icon}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="max-h-[80vh] overflow-scroll flex flex-col items-start py-1">
        {durations.map((duration) => (
          <button
            key={duration.value}
            onClick={() => {
              setOpen(false);
              if (duration.value === task.duration) return;

              setTaskDuration(task.id, duration.value);
            }}
            className={classNames("popover-button", {
              "popover-button-active": task.duration === duration.value,
            })}
          >
            <div className="flex flex-row items-center">
              <div className="text-sm w-5">
                {!duration.hide_selector_icon && (
                  <div
                    className={classNames(
                      "flex items-center justify-center w-5 h-5",
                      duration.icon_color
                    )}
                  >
                    {duration.icon}
                  </div>
                )}
              </div>

              <span className={classNames("ml-1", duration.text_color)}>
                {duration.text}
              </span>
            </div>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
