import classNames from "classnames";
import { Check } from "lucide-react";
import { useState } from "react";
import { DurationType, TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import { IconHourglass } from "../../utils/Icons";
import { Command, CommandGroup, CommandItem } from "./ui/command";
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
      value: "zero" as DurationType,
      text: "zero",
      icon: <span>0</span>,
      icon_color: "",
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
      hide_selector_icon: true,
    },
    {
      value: "longer" as DurationType,
      text: "Longer",
      icon: <span>∞</span>,
      icon_color: "",
    },
    {
      value: null as DurationType,
      text: "No duration",
      icon: <span className="text-lg">-</span>,
      icon_color: "text-gray-500",
    },
  ];

  function getDurationIcon(duration: (typeof durations)[0]) {
    return (
      <div
        className={classNames(
          "flex items-center justify-center w-5 h-5",
          duration.icon_color
        )}
      >
        {duration.icon}
      </div>
    );
  }

  const TaskDuration =
    durations.find((duration) => duration.value === task.duration) ||
    durations[durations.length - 1];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex h-full items-center w-full text-lg font-light button-gray-200 text-gray-300 hover:text-gray-500">
          {TaskDuration.value ? (
            <div className="w-4 h-4 flex items-center justify-center text-gray-700">
              {getDurationIcon(TaskDuration)}
            </div>
          ) : (
            <div className="flex items-center justify-center w-4 h-4">
              <IconHourglass />
            </div>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="">
        <Command>
          <CommandGroup className="max-h-[80vh] overflow-scroll">
            {durations.map((duration) => (
              <CommandItem
                key={duration.value}
                onSelect={() => {
                  setOpen(false);
                  if (duration.value === task.duration) return;

                  setTaskDuration(task.id, duration.value);
                }}
                className="w-full pr-4"
              >
                <Check
                  className={classNames(
                    "mr-2 h-4 w-4 shrink-0",
                    task.duration === duration.value ? "visible" : "invisible"
                  )}
                />
                <div className="flex flex-row items-center">
                  <div className="text-sm w-5">
                    {!duration.hide_selector_icon && getDurationIcon(duration)}
                  </div>

                  <span className="ml-1">{duration.text}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
