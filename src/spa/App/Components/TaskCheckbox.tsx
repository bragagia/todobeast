import classNames from "classnames";
import dayjs from "dayjs";
import { TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import { IconCheck } from "../../utils/Icons";

export function TaskCheckbox({ task }: { task: TaskType }) {
  const rep = useReplicache();

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
          "w-5 h-5 self-strech border rounded-full p-1 flex items-center justify-center mr-2 sm:mr-0",
          { "text-black border-black": task?.done_at },
          {
            "border-gray-800 text-opacity-0 hover:text-opacity-100 text-gray-500":
              !task?.done_at,
          }
        )}
      >
        <div className="flex items-center justify-center w-3 h-3">
          <IconCheck />
        </div>
      </div>
    </button>
  );
}
