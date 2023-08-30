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
    <button
      className="flex items-center self-stretch justify-center"
      onClick={handleClick}
    >
      <div
        className={classNames(
          "w-6 h-6 self-strech border rounded-full p-1 flex items-center",
          { "bg-gray-500 text-white border-gray-500": task.done_at },
          {
            "border-gray-800 text-white hover:text-gray-800": !task.done_at,
          }
        )}
      >
        <IconCheck />
      </div>
    </button>
  );
}
