import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dataTasks } from "../../FakeData";
import { UrlPlanner } from "../../Router";
import { AnimatedTranslate } from "../Components/AnimatedTranslate";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";
import { WeeklyCalendarNav } from "./Components/WeeklyCalendarNav";

export function PlannerPage() {
  const navigate = useNavigate();

  let { year, month, day } = useParams();
  let urlDate: Dayjs;

  var pageIsToday = false;
  if (day) {
    urlDate = dayjs(year + "-" + month + "-" + day, "YYYY-MM-DD").startOf(
      "day"
    );
  } else {
    pageIsToday = true;
    urlDate = dayjs().startOf("day");
  }

  const [prevDate, setPrevDate] = useState(urlDate);

  const [date, setDate] = useState(urlDate);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  function handleDateChange(date: Dayjs) {
    date = date.startOf("day");
    if (isTransitioning) return;
    if (date.isSame(prevDate)) return;

    setDate(date);
    setIsTransitioning(true);
    if (date.isBefore(prevDate)) {
      setDirection("prev");
    } else {
      setDirection("next");
    }
    navigate(UrlPlanner(date));
  }

  function handleAnimationEnd() {
    if (!isTransitioning) return;

    setPrevDate(date);
    setDirection(null);
    setIsTransitioning(false);
  }

  return (
    <div>
      <WeeklyCalendarNav dateChange={handleDateChange} />

      <AnimatedTranslate
        key={date.format("DD/MM/YYYY")}
        direction={direction}
        onRest={handleAnimationEnd}
      >
        <PageContent key={date.format("DD/MM/YYYY")} date={date} />
      </AnimatedTranslate>
    </div>
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
