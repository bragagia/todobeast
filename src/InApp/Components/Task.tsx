import classNames from "classnames";
import dayjs from "dayjs";
import { useState } from "react";
import { dataTasks } from "../../FakeData";
import { IconCheck } from "../../utils/Icons";
import { ProjectName } from "./ProjectName";

export function Task({ taskId }: { taskId: number }) {
  const [task, setTask] = useState(dataTasks[taskId]);

  let taskDate = task.date.startOf("day");

  let today = dayjs().startOf("day");

  let taskIsLate =
    taskDate.isBefore(today) &&
    (!task.done_at || task.done_at.isAfter(task.date));

  let dateFormatted = "Today";
  let dateFormattedSecondLine = "";

  if (!taskDate.isSame(today)) {
    dateFormatted = taskDate.format("dddd");
    dateFormattedSecondLine = taskDate.format("D MMMM");
    if (taskDate.year() != dayjs().year()) {
      dateFormatted += taskDate.format(" YYYY");
    }
  }

  function handleCheckClick() {
    setTask((oldTask) => ({
      ...oldTask,
      done_at: task.done_at ? null : dayjs(),
    }));
  }

  return (
    <div id={"task-" + taskId} className="hover:bg-gray-50 animated">
      <div
        className={classNames(
          "flex flex-row items-center w-full gap-2 py-2 border-b border-gray-200 rounded sm:py-1",
          { "opacity-40 hover:opacity-70": task.done_at }
        )}
      >
        <div
          className={classNames(
            "w-6 h-6 border border-black rounded-full p-1 flex items-center",
            { "bg-gray-200": task.done_at }
          )}
          onClick={handleCheckClick}
        >
          {task.done_at ? <IconCheck /> : ""}
        </div>

        <div className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-between sm:justify-normal w-[calc(100%-1.5rem-0.5rem)]">
          <div className="flex-shrink-0 sm:basis-24">
            <button
              className={classNames(
                "text-xs font-light sm:text-center text-right button sm:text-sm w-full",
                { "!font-bold text-red-700": taskIsLate }
              )}
            >
              {dateFormatted} <br className="hidden sm:block" />
              {dateFormattedSecondLine}
            </button>
          </div>

          <div className="flex-shrink-0 sm:w-24">
            <button className="w-full text-xs font-light sm:text-sm button">
              <ProjectName
                projectId={task.projectId}
                className="sm:justify-center"
                iconClassName="w-4 h-4"
              />
            </button>
          </div>

          {/* = Flex break */}
          <div className="block basis-full sm:hidden"></div>

          <div
            contentEditable
            className="overflow-auto break-words button grow hyphens-auto without-ring"
          >
            {task.title}
          </div>
        </div>
      </div>
    </div>
  );
}
