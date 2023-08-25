import dayjs, { Dayjs } from "dayjs";
import { useParams } from "react-router-dom";
import { dataTasks } from "../../FakeDat";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";
import { WeeklyCalendarNav } from "./Components/WeeklyCalendarNav";

export function PlannerPage() {
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
      <WeeklyCalendarNav />

      {!pageIsBeforeToday ? <TaskCreator /> : ""}

      <TaskList
        tasks={dataTasks.filter((task) => {
          return (
            task.date.startOf("day").isSame(date) ||
            (pageIsToday && !task.done_at && task.date.isBefore(date))
          );
        })}
      />
    </>
  );
}
