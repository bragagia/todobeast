import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { Outlet, useParams } from "react-router-dom";
import { IconPlus } from "../Icons";
import { dataProjects, dataTasks } from "../fakeData";
import { WeeklyCalendarNav } from "./WeeklyCalendarNav";

export function PlannerPage() {
  return (
    <>
      <WeeklyCalendarNav />

      <div className="flex flex-row items-center w-full my-4 button bg-gray-50 focus-within:bg-gray-100 ">
        <span className="text-gray-500">
          <IconPlus />
        </span>

        <input
          id="task-creation-field"
          className="w-full placeholder-gray-400 bg-transparent border-0 without-ring"
          placeholder="Add task. Press enter to create."
        ></input>
      </div>

      <Outlet />
    </>
  );
}

export function DailyTasks() {
  let { year, month, day } = useParams();
  let date: Dayjs;

  var isToday = false;

  if (day) {
    date = dayjs(year + "-" + month + "-" + day, "YYYY-MM-DD");
  } else {
    isToday = true;
    date = dayjs().startOf("day");
  }

  return (
    <div>
      {dataTasks
        .filter((task) => {
          return (
            task.date.startOf("day").isSame(date) ||
            (isToday && !task.done && task.date.isBefore(date))
          );
        })
        .map((task) => {
          return (
            <Task
              date={task.date}
              projectEmoji={dataProjects[task.projectId].icon}
              projectName={dataProjects[task.projectId].name}
              title={task.title}
              done={task.done}
            />
          );
        })}
    </div>
  );
}

function Task({
  date,
  projectEmoji,
  projectName,
  title,
  done,
}: {
  date: Dayjs;
  projectEmoji: string;
  projectName: string;
  title: string;
  done: boolean;
}) {
  date = date.startOf("day");

  let today = dayjs().startOf("day");

  let dateFormatted = "Today";
  let dateFormattedSecondLine = "";

  let taskIsLate = !done && date.isBefore(today);

  if (date != today) {
    dateFormatted = date.format("dddd");
    dateFormattedSecondLine = date.format("D MMMM");
    if (date.year() != dayjs().year()) {
      dateFormatted += date.format(" YYYY");
    }
  }

  return (
    <div className="flex flex-row items-center w-full gap-2 py-2 border-b border-gray-200 rounded sm:py-1 hover:bg-gray-50">
      <input
        type="checkbox"
        defaultChecked={done}
        className="w-6 h-6 bg-white border border-black rounded-full without-ring"
      />

      <div className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-between sm:justify-normal w-[calc(100%-1.5rem-0.5rem)]">
        <div className="flex-shrink-0 sm:basis-24">
          <button
            className={classNames(
              "text-xs font-light sm:text-center text-right button sm:text-sm",
              { "!font-bold text-red-700": taskIsLate }
            )}
          >
            {dateFormatted} <br className="hidden sm:block" />
            {dateFormattedSecondLine}
          </button>
        </div>

        <div className="flex-shrink-0 sm:w-24">
          <button className="flex flex-row items-center gap-1 text-xs font-light sm:text-sm button">
            <span>{projectEmoji}</span>
            <span className="overflow-auto break-words hyphens-auto">
              {projectName}
            </span>
          </button>
        </div>

        {/* = Flex break */}
        <div className="block basis-full sm:hidden"></div>

        <div
          contentEditable
          className="overflow-auto break-words button grow hyphens-auto without-ring"
        >
          {title}
        </div>
      </div>
    </div>
  );
}
