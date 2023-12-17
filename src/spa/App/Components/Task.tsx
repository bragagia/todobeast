import classNames from "classnames";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { TaskType } from "../../../db/tasks";
import { IconDrag } from "../../utils/Icons";
import { TaskCheckbox } from "./TaskCheckbox";
import { TaskDate } from "./TaskDate";
import { TaskDuration } from "./TaskDuration";
import { TaskPriority } from "./TaskPriority";
import { TaskProject } from "./TaskProject";
import { TaskTitle } from "./TaskTitle";

export function Task({
  task,
  mode = "default",
  dragHandleProps,
}: {
  task: TaskType;
  mode?: "default" | "priority-peek";
  dragHandleProps?: any;
}) {
  const taskRef = useRef<HTMLDivElement>(null);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!task || !taskRef || !taskRef.current) {
      return;
    }

    if (dayjs(task.created_at).isAfter(dayjs().add(-2, "second"))) {
      taskRef.current.scrollIntoView({ block: "center", behavior: "instant" });
      setBlinking(true);
    }
  }, [task, taskRef]);

  return (
    <div
      ref={taskRef}
      className={classNames(
        "group flex flex-row justify-normal py-1 px-1 bg-white hover:bg-gray-50 dark:hover:bg-[#0C111A]",
        { "animate-pulse-fast": blinking }
      )}
    >
      <div className="flex flex-row items-center w-full">
        <div
          className="flex items-center self-stretch w-6 pointer-fine:invisible group-hover:visible text-gray-400 hover:text-gray-600 shrink-0 justify-center"
          {...dragHandleProps}
        >
          <div className="flex items-center justify-center w-3 h-3">
            <IconDrag />
          </div>
        </div>

        <div className="flex flex-row-reverse items-center w-full gap-2 sm:flex-row">
          <div className="flex items-center self-stretch justify-center">
            <TaskCheckbox task={task} />
          </div>

          <div className="flex flex-col-reverse justify-start overflow-visible lg:items-center grow lg:flex-row lg:self-stretch min-h-[2.5rem] py-1 lg:py-0 lg:gap-2">
            {/* TODO: py-0 on pointer-fine */}
            <div className="flex flex-row items-center flex-shrink-0 text-gray-800 lg:self-stretch">
              <div className="self-stretch">
                <TaskProject task={task} />
              </div>

              <div className="self-stretch">
                <TaskPriority task={task} />
              </div>

              <div className="self-stretch">
                <TaskDuration task={task} />
              </div>

              <div className="self-stretch">
                <TaskDate task={task} mode={mode} />
              </div>
            </div>

            <div className="overflow-auto grow lg:self-stretch flex flex-row items-center w-full">
              <TaskTitle task={task} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
