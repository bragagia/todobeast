import dayjs, { Dayjs } from "dayjs";
import { useParams } from "react-router-dom";
import { dataTasks } from "../../FakeData";
import { AnimatedTranslate } from "../Components/AnimatedTranslate";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";
import { WeeklyCalendarNav } from "./Components/WeeklyCalendarNav";

export function PlannerPage() {
  let { year, month, day } = useParams();

  let urlDate: Dayjs;
  if (day) {
    urlDate = dayjs(year + "-" + month + "-" + day, "YYYY-MM-DD");
  } else {
    urlDate = dayjs().startOf("day");
  }

  return (
    <>
      <WeeklyCalendarNav />

      <AnimatedTranslate childKey={urlDate.format("YYYY/MM/DD")}>
        <PageContent date={urlDate} />
      </AnimatedTranslate>
    </>
  );
}

function PageContent({ date }: { date: Dayjs }) {
  const pageIsBeforeToday = dayjs(date)
    .startOf("day")
    .isBefore(dayjs().startOf("day"));

  const pageIsToday = dayjs(date).isSame(dayjs().startOf("day"));

  return (
    <>
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
