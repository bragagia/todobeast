import classNames from "classnames";
import dayjs from "dayjs";
import { rep } from "../../App";
import { TaskType } from "../../FakeData";
import { IconCheck } from "../../utils/Icons";

export function TaskCheckbox({ task }: { task: TaskType }) {
  function handleClick() {
    rep.mutate.taskUpdate({
      id: task.id,
      done_at: task.done_at ? null : dayjs().toISOString(),
    });
  }

  return (
    <button
      className="flex items-center self-stretch justify-center"
      onClick={handleClick}
    >
      <div
        className={classNames(
          "w-6 h-6 self-strech border rounded-full p-1 flex items-center",
          { "bg-gray-800 text-white border-gray-800": task?.done_at },
          {
            "border-gray-800 text-white hover:text-gray-800": !task?.done_at,
          }
        )}
      >
        <IconCheck />
      </div>
    </button>
  );
}
