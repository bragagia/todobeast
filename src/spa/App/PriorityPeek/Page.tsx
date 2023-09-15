import classNames from "classnames";
import { useState } from "react";
import { useSubscribe } from "replicache-react";
import { getPriorityPeekTasks, getTasksByDays } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import {
  IconBolt,
  IconCollapsed,
  IconCollapsible,
  IconFire,
} from "../../utils/Icons";
import useDate from "../../utils/UseDate";
import { PageHeader } from "../Components/PageHeader";
import { TaskList } from "../Components/TaskList";

export function PriorityPeekPage() {
  const [todaysCollapsed, setTodaysCollapsed] = useState(true);

  const rep = useReplicache();

  const todayDate = useDate();

  const tasksByDays = useSubscribe(rep, getTasksByDays(todayDate), {}, [
    rep,
    todayDate,
  ]);

  const priorityPeekTasks = useSubscribe(
    rep,
    getPriorityPeekTasks(),
    [],
    [rep, todayDate]
  );

  const todayTasks = tasksByDays[todayDate.toString()] || [];

  const todayTodosCount = todayTasks.filter((task) => !task.done_at).length;

  return (
    <>
      <PageHeader>
        <div className="flex flex-row items-center justify-normal w-full pt-5 pb-1 page-padding">
          <div className="flex flex-row items-center gap-2">
            <span className="text-purple-600">
              <IconBolt />
            </span>

            <p className="text-xl">Priority Peek</p>
          </div>
        </div>
      </PageHeader>

      <button
        className="flex flex-row items-center page-padding py-2 text-gray-800 gap-1 hover:bg-gray-100 w-full text-lg"
        onClick={() => setTodaysCollapsed(!todaysCollapsed)}
      >
        <span className="flex items-center justify-center w-4 h-4">
          {todaysCollapsed ? <IconCollapsed /> : <IconCollapsible />}
        </span>
        <span>Today</span>
        <span className="font-light text-gray-400">{todayTodosCount}</span>
      </button>

      <div className={classNames({ hidden: todaysCollapsed })}>
        <TaskList tasks={todayTasks} className="mb-16" />
      </div>

      <div className="page-padding">
        <div className="flex flex-row items-center py-2 mt-4 text-gray-800 gap-1 w-full text-lg">
          <span className="flex items-center justify-center w-4 h-4">
            {<IconFire />}
          </span>

          <span>Top priority</span>
        </div>

        <p className="text-gray-500 text-sm">
          Plan your day like a beast with the four highest priority tasks from
          each project highlighted here.{" "}
          <span className="text-gray-400 font-light">
            (Planned tasks are excluded)
          </span>
        </p>
      </div>

      <div className="mt-3">
        <TaskList
          tasks={priorityPeekTasks}
          mode="priority-peek"
          className="mb-32"
        />
      </div>
    </>
  );
}
