import dayjs from "dayjs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { rep } from "../../App";
import { getAllTasks } from "../../FakeData";
import { AnimatedTranslate } from "../Components/AnimatedTranslate";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";
import { WeeklyCalendarNav } from "./Components/WeeklyCalendarNav";

export function PlannerPage() {
  const allTasks = useSubscribe(rep, getAllTasks(), [], [rep]);

  let { year, month, day } = useParams();
  const urlDate = useMemo(() => {
    return day
      ? dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD")
      : dayjs().startOf("day");
  }, [year, month, day]);

  const pageIsBeforeToday = useMemo(() => {
    return dayjs(urlDate).startOf("day").isBefore(dayjs().startOf("day"));
  }, [urlDate]);

  const pageIsToday = useMemo(() => {
    return dayjs(urlDate).isSame(dayjs().startOf("day"));
  }, [urlDate]);

  const tasksOfDay = useMemo(() => {
    return allTasks.filter((task) => {
      return (
        dayjs(task.date).startOf("day").isSame(urlDate) ||
        (pageIsToday && !task.done_at && dayjs(task.date).isBefore(urlDate))
      );
    });
  }, [allTasks, urlDate, pageIsToday]);

  // TODO: Disable TaskCreator if pageisbeforetoday
  return (
    <>
      <WeeklyCalendarNav />

      <TaskCreator />

      <AnimatedTranslate childKey={urlDate.format("YYYY/MM/DD")}>
        <TaskList tasks={tasksOfDay} />
      </AnimatedTranslate>
    </>
  );
}
