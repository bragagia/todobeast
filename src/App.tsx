import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import {
  IconBug,
  IconBurger,
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconInbox,
  IconPlus,
} from "./Icons";

export default function App() {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  useEffect(() => {
    if (sidebarOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [sidebarOpened]);

  return (
    <div className="inter">
      <nav className="fixed bottom-0 z-20 w-screen h-16 text-black bg-gray-100 sm:hidden">
        <NavContent
          openSidebarHandler={() => setSidebarOpened(!sidebarOpened)}
        />
      </nav>

      <div
        className={classNames(
          "fixed flex-col w-full sm:w-48 md:w-64 bg-white sm:bg-gray-100 h-[calc(100vh-4rem)] sm:h-screen flex z-40  overflow-scroll px-4 py-4 sm:transform-none",
          {
            "translate-x-0": sidebarOpened,
            "-translate-x-full": !sidebarOpened,
          }
        )}
      >
        <SidemenuContent />
      </div>

      <div className="pb-16 sm:pb-0 w-full sm:w-[calc(100vw-12rem)] md:w-[calc(100vw-16rem)] sm:ml-48 md:ml-64">
        <div className="container max-w-3xl px-3 py-4 mx-auto ">
          <TodayPage />
        </div>
      </div>
    </div>
  );
}

function TodayPage() {
  const today = new Date();

  function dayAdd(inc: number) {
    var newDate = new Date();
    newDate.setDate(today.getDate() + inc);

    return newDate;
  }

  return (
    <>
      <div className="flex flex-row items-center justify-center max-w-xl gap-3 mx-auto sm:gap-4 group">
        <button className="text-gray-500 animated no-touch:opacity-0 group-hover:opacity-100 hover:text-black">
          <IconChevronLeft />
        </button>
        <CalendarDayItem tasksDone={1} tasksTotal={3} date={dayAdd(-4)} />
        <CalendarDayItem tasksDone={1} tasksTotal={1} date={dayAdd(-3)} />
        <CalendarDayItem tasksDone={1} tasksTotal={3} date={dayAdd(-2)} />
        <CalendarDayItem tasksDone={12} tasksTotal={12} date={dayAdd(-1)} />
        <CalendarDayItem
          tasksDone={1}
          tasksTotal={3}
          date={dayAdd(0)}
          isFocused
        />
        <CalendarDayItem tasksDone={1} tasksTotal={1} date={dayAdd(1)} />
        <CalendarDayItem tasksDone={1} tasksTotal={7} date={dayAdd(2)} />
        <button className="text-gray-500 animated no-touch:opacity-0 group-hover:opacity-100 hover:text-black">
          <IconChevronRight />
        </button>
      </div>

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

      <div>
        <Task
          date={new Date()}
          projectEmoji="🤷"
          projectName="Unlabeled"
          title="Le voyageur contemplant une mer de nuages f/Duckomenta
        https://image.jimcdn.com/app/cms/image/transf/none/path/s2fd05c04c76e678d/image/i0a0b157e58d083d2/version/1428491099/image.jpg"
          done={false}
        />
        <Task
          date={new Date()}
          projectEmoji="🏛️"
          projectName="Pro"
          title="Improve SunriseBriefing"
          done={false}
        />
        <Task
          date={new Date()}
          projectEmoji="😄"
          projectName="Perso"
          title="Organiser un chalet pour le nouvel an"
          done={false}
        />
        <Task
          date={new Date()}
          projectEmoji="🏛️"
          projectName="Pro"
          title="Design Todobeast tasks"
          done={false}
        />
      </div>
    </>
  );
}

function Task({
  date,
  projectEmoji,
  projectName,

  title,
  done,
}: {
  date: Date;
  projectEmoji: string;
  projectName: string;
  title: string;
  done: boolean;
}) {
  return (
    <div className="flex flex-row items-center w-full gap-2 py-2 border-b border-gray-200 rounded sm:py-1 hover:bg-gray-50">
      <input
        type="checkbox"
        className="w-6 h-6 bg-white border border-black rounded-full without-ring"
      />

      <div className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-between sm:justify-normal w-[calc(100%-1.5rem-0.5rem)]">
        <div className="flex-shrink-0 text-xs font-light text-right sm:text-sm sm:basis-24 sm:text-center">
          <button className="button">
            Saturday <br className="hidden sm:inline" />
            14 august
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

function CalendarDayItem({
  tasksTotal = 0,
  tasksDone = 0,
  date,
  isFocused,
}: {
  tasksTotal?: number;
  tasksDone?: number;
  date: Date;
  isFocused?: boolean;
}) {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const todayTMP = new Date();
  const todayWithoutTime = new Date(
    todayTMP.getFullYear(),
    todayTMP.getMonth(),
    todayTMP.getDate()
  );

  const dateWithoutTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const beforeToday = dateWithoutTime < todayWithoutTime;
  const afterToday = dateWithoutTime > todayWithoutTime;
  const isToday = !beforeToday && !afterToday;

  const tasksPending = tasksTotal - tasksDone;

  function DateDisplay() {
    return (
      <div className="flex flex-col items-center h-16">
        <div className="text-xs">{days[date.getDay()]}</div>

        <div>{date.getDate()}</div>

        <div
          className={classNames(
            "flex items-center justify-center w-4 h-4 p-[2px] text-xs text-white bg-black rounded-full",
            {
              invisible: false,
              "bg-green-600": beforeToday || isToday,
              "bg-violet-600": beforeToday && tasksDone != tasksTotal,
            }
          )}
        >
          {beforeToday ? (
            tasksDone == tasksTotal ? (
              <IconCheck />
            ) : (
              <IconBug />
            )
          ) : tasksPending < 10 ? (
            tasksPending
          ) : (
            "+"
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      className={classNames(
        "flex flex-row grow items-center justify-center border-b border-black hover:opacity-100 animated",
        {
          "opacity-50": !isFocused,
          "w-18": isToday,
        }
      )}
    >
      {isToday ? (
        <img src="/beast-happy.png" className="w-8 h-8 mr-2" alt="" />
      ) : (
        ""
      )}
      <DateDisplay />
    </button>
  );
}

function NavContent({
  openSidebarHandler,
}: {
  openSidebarHandler: () => void;
}) {
  function handleCreateTask() {
    document.getElementById("task-creation-field")?.focus();
  }

  return (
    <div className="flex flex-row items-center justify-around h-full">
      <button
        className="flex items-center justify-center w-20 h-full text-gray-400"
        onClick={openSidebarHandler}
      >
        <IconBurger />
      </button>

      <button className="flex items-center justify-center w-20 h-full text-gray-600 border-t border-gray-600">
        <IconCalendar />
      </button>

      <button className="flex items-center justify-center w-20 h-full text-gray-400">
        <IconInbox />
      </button>
    </div>
  );
}

function SidemenuContent() {
  return (
    <ul>
      <div className="flex flex-row items-center justify-center gap-3 mt-4 mb-8">
        <h1
          className=" text-3xl text-center text-[#FD001A] align-middle josefin-sans"
          style={{ textShadow: "1px 1px black" }}
        >
          Todobeast
        </h1>
      </div>

      <SidemenuItem
        className="hidden sm:list-item"
        Icon={IconInbox}
        iconColor="text-blue-600"
      >
        Inbox
      </SidemenuItem>
      <SidemenuItem
        className="hidden sm:list-item"
        Icon={IconCalendar}
        iconColor="text-green-600"
        chip="5"
        active
      >
        Today
      </SidemenuItem>
      {/* <SidemenuItem Icon={CiCalendar} iconColor="text-green-600">
        Coming
      </SidemenuItem> */}

      <h3 className="mt-8 mb-2 text-sm font-medium text-gray-500">Projects</h3>
      <SidemenuItem emoji="🤷">Unlabeled</SidemenuItem>
      <SidemenuItem emoji="">Archive</SidemenuItem>
    </ul>
  );
}

function SidemenuItem({
  children,
  Icon,
  iconColor,
  emoji = "",
  chip = "",
  className = "",
  active,
}: {
  children: ReactNode;
  Icon?: any;
  iconColor?: string;
  emoji?: string;
  chip?: string;
  className?: string;
  active?: boolean;
}) {
  return (
    <li className={className}>
      <a
        href="#"
        className={classNames("flex items-center mb-1 sidemenu-button group", {
          "sidemenu-button-active": active,
        })}
      >
        {Icon ? (
          <div className={classNames("flex-shrink-0", iconColor)}>
            <Icon mini />
          </div>
        ) : (
          /* If no emoji, still keep element to preserve spacing */
          <div className="flex-shrink-0 w-4 text-center">{emoji}</div>
        )}

        <span className="flex-1 ml-3 font-light text-gray-800 whitespace-nowrap">
          {children}
        </span>

        {chip != "" ? (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-3 text-xs text-black rounded-full bg-zinc-300">
            {chip}
          </span>
        ) : (
          ""
        )}
      </a>
    </li>
  );
}
