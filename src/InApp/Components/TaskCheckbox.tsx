import classNames from "classnames";
import dayjs from "dayjs";
import { useState } from "react";
import { dataTasks } from "../../FakeData";
import { IconCheck } from "../../utils/Icons";

export function TaskCheckbox({ taskId }: { taskId: number }) {
  const [task, setTask] = useState(dataTasks[taskId]);

  function handleClick() {
    setTask((oldTask) => ({
      ...oldTask,
      done_at: task.done_at ? null : dayjs(),
    }));
  }

  return (
    <div
      className={classNames(
        "w-6 h-6 border border-black rounded-full p-1 flex items-center",
        { "bg-gray-200": task.done_at }
      )}
      onClick={handleClick}
    >
      {task.done_at ? <IconCheck /> : ""}
    </div>
  );
}
