import classNames from "classnames";
import { TaskType } from "../../../db/tasks";
import { IconDrag } from "../../utils/Icons";
import { TaskCheckbox } from "./TaskCheckbox";
import { TaskDate } from "./TaskDate";
import { TaskDuration } from "./TaskDuration";
import { TaskPriority } from "./TaskPriority";
import { TaskProject } from "./TaskProject";
import { TaskTitle } from "./TaskTitle";

export function Task({ task }: { task: TaskType }) {
  return (
    <div
      className={classNames(
        "flex flex-row justify-normal py-1 task-padding border-t border-gray-200 bg-white hover:bg-gray-50"
      )}
    >
      <div className="flex flex-row items-center w-full gap-2">
        <div className="flex items-center justify-center w-3 h-3 text-gray-300">
          <IconDrag />
        </div>

        <div className="flex flex-row-reverse items-center w-full gap-1 sm:flex-row">
          <div className="flex items-center self-stretch justify-center">
            <TaskCheckbox task={task} />
          </div>

          <div className="flex flex-col justify-start overflow-auto lg:items-center grow lg:flex-row">
            <div className="flex flex-row items-center flex-shrink-0 text-gray-600 md:text-black lg:basis-60">
              <div className="">
                <TaskProject task={task} />
              </div>

              <div className="shrink-0 grow-0">
                <TaskPriority task={task} />
              </div>

              <div className="shrink-0 grow-0">
                <TaskDuration task={task} />
              </div>

              <div className="">
                <TaskDate task={task} />
              </div>
            </div>

            <div className="overflow-auto grow">
              <TaskTitle task={task} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
