import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { rep } from "../../App";
import { getAllTasks, getTasksByDays } from "../../FakeData";
import { DayjsDate } from "../../utils/PlainDate";
import useDate from "../../utils/UseDate";
import { AnimatedTranslate } from "../Components/AnimatedTranslate";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";
import { WeeklyCalendarNav } from "./Components/WeeklyCalendarNav";
import { PageTitle } from "../Components/PageTitle";

export function PlannerPage() {
  let { year, month, day } = useParams();

  const todayDate = useDate();

  const urlDate = useMemo(() => {
    return year && month && day ? new DayjsDate(year, month, day) : todayDate;
  }, [year, month, day, todayDate]);

  const allTasks = useSubscribe(rep, getAllTasks(), [], [rep]);

  const tasksByDays = useMemo(
    () => getTasksByDays(allTasks, todayDate),
    [allTasks, todayDate]
  );

  // TODO: Disable TaskCreator if pageisbeforetoday
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
