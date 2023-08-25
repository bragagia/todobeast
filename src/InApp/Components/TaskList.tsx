import { useState } from "react";
import { TaskType } from "../../FakeData";
import { Task } from "./Task";

export function TaskList({ tasks }: { tasks: TaskType[] }) {
  const [showDoneTasks, setshowDoneTasks] = useState(false);

  function handleToggleTasksDone() {
    setshowDoneTasks(!showDoneTasks);
  }

  return (
    <div>
      {tasks
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
          return <Task key={task.id} taskId={task.id} />;
        })}
      {/* <div>
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
      </div> */}
    </div>
  );
}
