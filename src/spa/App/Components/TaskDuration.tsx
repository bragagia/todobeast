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

  // | "zero"
  // | "sixteenth"
  // | "eighth"
  // | "quarter"
  // | "half"
  // | "full"
  // | "double"
  // | "quadruple"
  // | "longer"
  // | null;

  const durations = [
    {
      value: "zero" as DurationType,
      text: "zero",
      icon: <span>0</span>,
      icon_color: "text-black",
    },
    {
      value: "sixteenth" as DurationType,
      text: "30 min",
      icon: <span>¹⁄₁₆</span>,
      icon_color: "text-black",
    },
    {
      value: "eighth" as DurationType,
      text: "1 hour",
      icon: <span>⅛</span>,
      icon_color: "text-black",
    },
    {
      value: "quarter" as DurationType,
      text: "2 hours",
      icon: <span>¼</span>,
      icon_color: "text-black",
    },
    {
      value: "half" as DurationType,
      text: "4 hours",
      icon: <span>½</span>,
      icon_color: "text-black",
    },
    {
      value: "full" as DurationType,
      text: "Full day",
      icon: <span>1</span>,
      icon_color: "text-black",
    },
    {
      value: "double" as DurationType,
      text: "Two days",
      icon: <span>2</span>,
      icon_color: "text-black",
    },
    {
      value: "quadruple" as DurationType,
      text: "Four days",
      icon: <span>4</span>,
      icon_color: "text-black",
    },
    {
      value: "longer" as DurationType,
      text: "Longer",
      icon: <span>∞</span>,
      icon_color: "text-black",
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
        <button className="flex items-center w-full text-lg font-light button">
          {TaskDuration.value ? (
            getDurationIcon(TaskDuration)
          ) : (
            <div className="flex items-center justify-center w-5 h-5">
              <div className="flex items-center justify-center w-4 h-4 text-gray-300">
                <IconHourglass />
              </div>
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
                  <span className="text-sm">{getDurationIcon(duration)}</span>
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
