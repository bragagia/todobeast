import classNames from "classnames";
import dayjs from "dayjs";
import { useReplicache } from "../../ReplicacheProvider";
import { TaskType } from "../../db/tasks";
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
          "w-5 h-5 self-strech border rounded-full p-1 flex items-center mr-2 sm:mr-0",
          { "bg-gray-800 text-white border-gray-800": task?.done_at },
          {
            "border-gray-800 text-white no-touch:hover:text-gray-500":
              !task?.done_at,
          }
        )}
      >
        <IconCheck />
      </div>
    </button>
  );
}
