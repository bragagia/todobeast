import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { getTasksByDays } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import { DayjsDate } from "../../utils/PlainDate";
import useDate from "../../utils/UseDate";
import { AnimatedTranslate } from "../Components/AnimatedTranslate";
import { PageHeader } from "../Components/PageTitle";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";
import { WeeklyCalendarNav } from "./Components/WeeklyCalendarNav";

export function PlannerPage() {
  const rep = useReplicache();

  let { year, month, day } = useParams();

  const todayDate = useDate();

  const urlDate = useMemo(() => {
    return year && month && day ? new DayjsDate(year, month, day) : todayDate;
  }, [year, month, day, todayDate]);

  const tasksByDays = useSubscribe(rep, getTasksByDays(todayDate), {}, [
    rep,
    todayDate,
  ]);

  return (
    <>
      <PageHeader>
        <div className="py-4 page-container">
          <WeeklyCalendarNav tasksByDays={tasksByDays} />
        </div>

        <TaskCreator date={urlDate} />
      </PageHeader>

      <AnimatedTranslate childKey={"planner-day/" + urlDate.toString()}>
        <TaskList tasks={tasksByDays[urlDate.toString()]} />
      </AnimatedTranslate>
    </>
  );
}
