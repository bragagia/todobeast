import classNames from "classnames";
import { TaskCheckbox } from "./TaskCheckbox";
import { TaskDate } from "./TaskDate";
import { TaskProject } from "./TaskProject";
import { TaskTitle } from "./TaskTitle";
import { TaskType } from "../../db/tasks";

export function Task({ task }: { task: TaskType }) {
  return (
    <div className="hover:bg-gray-50">
      <div
        className={classNames(
          "flex flex-row-reverse sm:flex-row items-center gap-2 py-2 border-b border-gray-200 rounded md:py-1",
          { "opacity-40 hover:opacity-70": task?.done_at }
        )}
      >
        <div className="flex items-center self-stretch justify-center mr-1 sm:ml-1">
          <TaskCheckbox task={task} />
        </div>

        <div className="flex flex-col justify-start overflow-auto md:items-center grow md:flex-row">
          <div className="flex flex-row items-center flex-shrink-0 text-gray-600 md:text-black md:basis-60">
            <div className="mr-2 md:mr-0 md:basis-24">
              <TaskProject task={task} />
            </div>

            <div className="md:basis-36">
              <TaskDate task={task} />
            </div>
          </div>

          <div className="overflow-auto grow">
            <TaskTitle task={task} />
          </div>
        </div>
      </div>
    </div>
  );
}
