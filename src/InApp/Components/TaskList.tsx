import dayjs from "dayjs";
import { TaskType } from "../../db/tasks";
import { DayjsDate } from "../../utils/PlainDate";
import { Task } from "./Task";

export function TaskList({ tasks }: { tasks: TaskType[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="pt-10 font-bold text-center text-gray-400">
        Task list is empty!
      </p>
    );
  }

  return (
    <div className="pt-4">
      {tasks
        .sort((a, b) => {
          if (!a.done_at && b.done_at) return -1;
          if (a.done_at && !b.done_at) return 1;

          if (a.projectId < b.projectId) return -1;
          if (a.projectId > b.projectId) return 1;

          if (a.date && !b.date) return -1;
          if (!a.date && b.date) return 1;

          if (
            a.date &&
            b.date &&
            new DayjsDate(a.date).isBefore(new DayjsDate(b.date))
          )
            return -1;
          if (
            a.date &&
            b.date &&
            new DayjsDate(b.date).isBefore(new DayjsDate(a.date))
          )
            return 1;

          if (dayjs(a.created_at).isBefore(dayjs(b.created_at))) return -1;
          if (dayjs(b.created_at).isBefore(dayjs(a.created_at))) return 1;

          return 0;
        })
        .map((task) => {
          return <Task key={task.id} task={task} />;
        })}
    </div>
  );
}

//const [showDoneTasks, setshowDoneTasks] = useState(false);

// function handleToggleTasksDone() {
//   setshowDoneTasks(!showDoneTasks);
// }

/* <div>
    <button onClick={handleToggleTasksDone}>Open</button>
    <div
      className={classNames("transition-all duration-150 ease-in-out h-0", {
        "h-full": showDoneTasks,
      })}
    >
      COUCOU
      <br />
      COUCOU
      <br />
      COUCOU
      <br />
      COUCOU
      <br />
      COUCOU
      <br />
      COUCOU
      <br />
      COUCOU
      <br />
    </div>
  </div>
  */
