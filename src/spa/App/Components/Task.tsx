import classNames from "classnames";
import { TaskType } from "../../../db/tasks";
import { TaskCheckbox } from "./TaskCheckbox";
import { TaskDate } from "./TaskDate";
import { TaskPriority } from "./TaskPriority";
import { TaskProject } from "./TaskProject";
import { TaskTitle } from "./TaskTitle";

export function Task({ task }: { task: TaskType }) {
  return (
    <div className="hover:bg-gray-50">
      <div
        className={classNames(
          "flex flex-row justify-normal py-1 task-padding border-b border-gray-200",
          {
            "opacity-40 hover:opacity-70": task?.done_at,
          }
        )}
      >
        <div className="flex flex-row-reverse items-center w-full gap-1 sm:flex-row">
          <div className="flex items-center self-stretch justify-center">
            <TaskCheckbox task={task} />
          </div>

          <div className="flex flex-col justify-start overflow-auto md:items-center grow md:flex-row">
            <div className="flex flex-row items-center flex-shrink-0 text-gray-600 md:text-black md:basis-60">
              <div className="shrink-0 grow-0">
                <TaskPriority task={task} />
              </div>

              {/* <div className="shrink-0 grow-0">
                <TaskPriority task={task} />
              </div> */}

              <div className="">
                <TaskProject task={task} />
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
