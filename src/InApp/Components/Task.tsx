import classNames from "classnames";
import { useState } from "react";
import { dataTasks } from "../../FakeData";
import { TaskCheckbox } from "./TaskCheckbox";
import { TaskDate } from "./TaskDate";
import { TaskProject } from "./TaskProject";
import { TaskTitle } from "./TaskTitle";

export function Task({ taskId }: { taskId: number }) {
  const [task, setTask] = useState(dataTasks[taskId]);

  return (
    <div id={"task-" + taskId} className="hover:bg-gray-50 animated">
      <div
        className={classNames(
          "flex flex-row items-center gap-2 py-2 border-b border-gray-200 rounded lg:py-1",
          { "opacity-40 hover:opacity-70": task.done_at }
        )}
      >
        <div className="ml-1">
          <TaskCheckbox taskId={taskId} />
        </div>

        <div className="flex flex-row flex-wrap items-center justify-between overflow-auto grow lg:flex-nowrap lg:justify-normal">
          <div className="flex-shrink-0 lg:basis-24">
            <TaskProject taskId={taskId} />
          </div>

          <div className="flex-shrink-0 lg:w-24">
            <TaskDate taskId={taskId} />
          </div>

          {/* = Flex line break */}
          <div className="block basis-full lg:hidden"></div>

          <div className="overflow-auto grow">
            <TaskTitle taskId={taskId} />
          </div>
        </div>
      </div>
    </div>
  );
}
