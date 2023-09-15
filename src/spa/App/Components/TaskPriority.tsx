import classNames from "classnames";
import { Check } from "lucide-react";
import { useState } from "react";
import { PriorityType, TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import {
  IconChartFull,
  IconChartLow,
  IconChartMid,
  IconFire,
  IconFlag,
} from "../../utils/Icons";
import { Command, CommandGroup, CommandItem } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function TaskPriority({ task }: { task: TaskType }) {
  const rep = useReplicache();

  const [open, setOpen] = useState(false);

  async function setTaskPriority(taskId: string, priority: PriorityType) {
    setOpen(false);

    await rep.mutate.taskUpdatePriorityAndReorder({
      projectId: task.projectId,
      task: {
        id: taskId,
        priority: priority,
      },
    });
  }

  const priorities = [
    {
      value: null as PriorityType,
      text: "No priority",
      icon: <IconFlag />,
      icon_color: "text-gray-400",
      text_color: "text-gray-400",
    },
    {
      value: "urgent" as PriorityType,
      text: "Urgent",
      icon: <IconFire />,
      icon_color: "text-red-500",
      text_color: "text-black",
    },
    {
      value: "high" as PriorityType,
      text: "High",
      icon: <IconChartFull />,
      icon_color: "",
      text_color: "text-black",
    },
    {
      value: "medium" as PriorityType,
      text: "Medium",
      icon: <IconChartMid />,
      icon_color: "",
      text_color: "text-black",
    },
    {
      value: "low" as PriorityType,
      text: "Low",
      icon: <IconChartLow />,
      icon_color: "",
      text_color: "text-black",
    },
  ];

  const TaskPriority =
    priorities.find((priority) => priority.value === task.priority) ||
    priorities[priorities.length - 1];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={classNames(
            "flex h-full items-center justify-center text-xs font-light button-gray-200",
            { "text-gray-300 hover:text-gray-500": !TaskPriority.value }
          )}
        >
          <div
            className={classNames(
              "flex items-center justify-center w-4 h-4",
              TaskPriority.value ? TaskPriority.icon_color : ""
            )}
          >
            {TaskPriority.icon}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="">
        <Command>
          <CommandGroup className="max-h-[16rem] overflow-scroll">
            {priorities.map((priority) => (
              <CommandItem
                key={priority.value}
                onSelect={() => {
                  setOpen(false);
                  if (priority.value === task.priority) return;

                  setTaskPriority(task.id, priority.value);
                }}
                className="w-full pr-4"
              >
                <Check
                  className={classNames(
                    "mr-2 h-4 w-4 shrink-0",
                    task.priority === priority.value ? "visible" : "invisible"
                  )}
                />

                <div className="flex flex-row items-center">
                  <div
                    className={classNames(
                      "flex items-center justify-center w-4 h-4",
                      priority.icon_color
                    )}
                  >
                    {priority.icon}
                  </div>

                  <span className={classNames("ml-1", priority.text_color)}>
                    {priority.text}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
