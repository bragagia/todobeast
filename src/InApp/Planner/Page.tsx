import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { rep } from "../../Replicache";
import { getTasksByDays } from "../../db/tasks";
import { DayjsDate } from "../../utils/PlainDate";
import useDate from "../../utils/UseDate";
import { PageTitle } from "../Components/PageTitle";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";
import { WeeklyCalendarNav } from "./Components/WeeklyCalendarNav";
import { AnimatedTranslate } from "../Components/AnimatedTranslate";

export function PlannerPage() {
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
      <PageTitle>
        <WeeklyCalendarNav tasksByDays={tasksByDays} />
      </PageTitle>

      <TaskCreator date={urlDate} />

      <AnimatedTranslate childKey={"planner-day/" + urlDate.toString()}>
        <TaskList tasks={tasksByDays[urlDate.toString()]} />
      </AnimatedTranslate>
    </>
  );
}
