import dayjs, { Dayjs } from "dayjs";
import { useParams } from "react-router-dom";
import { dataTasks } from "../../../FakeData";
import { IconPlus } from "../../../utils/Icons";
import { Task } from "../../Components/Task";

export function PlannerTasksPage() {
  let { year, month, day } = useParams();
  let date: Dayjs;

  var pageIsToday = false;
  if (day) {
    date = dayjs(year + "-" + month + "-" + day, "YYYY-MM-DD");
  } else {
    pageIsToday = true;
    date = dayjs().startOf("day");
  }

  const pageIsBeforeToday = dayjs(date)
    .startOf("day")
    .isBefore(dayjs().startOf("day"));

  return (
    <>
      {!pageIsBeforeToday ? (
        <div className="flex flex-row items-center w-full my-4 button bg-gray-50 focus-within:bg-gray-100 ">
          <span className="text-gray-500">
            <IconPlus />
          </span>

          <input
            id="task-creation-field"
            className="w-full placeholder-gray-400 bg-transparent border-0 without-ring"
            placeholder="Add task. Press enter to create."
          ></input>
        </div>
      ) : (
        ""
      )}
      <div>
        {dataTasks
          .filter((task) => {
            return (
              task.date.startOf("day").isSame(date) ||
              (pageIsToday && !task.done_at && task.date.isBefore(date))
            );
          })
          .sort((a, b) => {
            if (!a.done_at && b.done_at) return -1;
            if (a.done_at && !b.done_at) return 1;

            if (a.projectId < b.projectId) return -1;
            if (a.projectId > b.projectId) return 1;

            if (a.date.isBefore(b.date)) return -1;
            if (b.date.isBefore(a.date)) return 1;

            return 0;
          })
          .map((task) => {
            return <Task taskId={task.id} />;
          })}
      </div>
    </>
  );
}
