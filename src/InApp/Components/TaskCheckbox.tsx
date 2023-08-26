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
        "w-6 h-6 border rounded-full p-1 flex items-center text-white",
        { "bg-gray-500 border-gray-500": task.done_at },
        { "border-gray-800 ": !task.done_at }
      )}
      onClick={handleClick}
    >
      {task.done_at ? <IconCheck /> : ""}
    </div>
  );
}
