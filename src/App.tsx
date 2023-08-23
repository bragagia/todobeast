import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { AiOutlinePlus } from "react-icons/ai";
import {
  CiBrightnessUp,
  CiInboxIn,
  CiSquareChevLeft,
  CiSquareChevRight,
} from "react-icons/ci";
import { FiCheck } from "react-icons/fi";
import { PiPlusLight } from "react-icons/pi";

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
      <nav className="fixed bottom-0 z-20 flex flex-row items-center justify-between w-screen h-16 gap-8 px-4 text-black bg-gray-100 sm:hidden">
        <button
          aria-label="toggle sidebar"
          id="openSideBar"
          className="sm:hidden"
          onClick={() => {
            setSidebarOpened(!sidebarOpened);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <NavContent />
      </nav>

      <div>
        {/* Transparent black background to close sidebar */}
        <button
          aria-label="toggle sidebar"
          id="openSideBar"
          hidden={!sidebarOpened}
          className={classNames(
            "fixed left-0 z-30 backdrop-blur-md w-screen h-screen bg-black sm:hidden bg-opacity-30 transition duration-300 ease-in-out"
          )}
          onClick={() => {
            setSidebarOpened(!sidebarOpened);
          }}
        ></button>

        <div
          className={classNames(
            "fixed flex-col w-64 sm:w-48 md:w-64 bg-gray-100 shadow h-screen flex z-40 transition duration-150 ease-in-out sm:transform-none overflow-scroll px-4 py-4",
            {
              "translate-x-0": sidebarOpened,
              "-translate-x-64": !sidebarOpened,
            }
          )}
        >
          <SidemenuContent />
        </div>
      </div>

      <div className="pb-16 sm:pb-0 w-full sm:w-[calc(100vw-12rem)] md:w-[calc(100vw-16rem)] sm:ml-48 md:ml-64">
        <div className="container max-w-3xl px-3 py-4 mx-auto ">
          <TodayPage />
          {/* <div className="w-full h-[200vh] border-2 border-gray-300 border-dashed rounded">
            aaa
          </div> */}
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
      <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 group">
        <button>
          <CiSquareChevLeft className="w-6 h-6 text-gray-500 transition duration-150 ease-in-out no-touch:opacity-0 group-hover:opacity-100 hover:text-black" />
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
        <button>
          <CiSquareChevRight className="w-6 h-6 text-gray-500 transition duration-150 ease-in-out no-touch:opacity-0 group-hover:opacity-100 hover:text-black" />
        </button>
      </div>

      <div className="flex flex-row items-center w-full p-2 my-4 bg-gray-50 border border-gray-50 rounded-lg hover:border-gray-300 focus-within:!border-gray-500 focus-within:bg-gray-100">
        <PiPlusLight className="w-8 h-8 text-gray-500" />

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
          <button className="p-1 border border-transparent rounded-lg hover:border-gray-300">
            Saturday <br className="hidden sm:inline" />
            14 august
          </button>
        </div>

        <div className="flex-shrink-0 sm:w-24">
          <button className="flex flex-row items-center gap-1 p-1 text-xs font-light border border-transparent rounded-lg hover:border-gray-300 sm:text-sm">
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
          className="p-1 overflow-auto break-words border border-transparent rounded-lg grow hyphens-auto hover:border-gray-300 focus:border-gray-500 without-ring"
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
      <div className="flex flex-col items-center w-5 h-16 md:w-8">
        <div className="text-xs">{days[date.getDay()]}</div>

        <div>{date.getDate()}</div>

        <div
          className={classNames(
            "flex items-center justify-center w-3 h-3 text-xs text-white bg-black rounded-full",
            {
              invisible: false,
              "bg-green-600": beforeToday || isToday,
              "bg-transparent": beforeToday && tasksDone != tasksTotal,
            }
          )}
        >
          {beforeToday ? (
            tasksDone == tasksTotal ? (
              <FiCheck />
            ) : (
              "👻"
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
        "flex flex-row items-center border-b border-black hover:opacity-100 transition duration-150 ease-in-out",
        {
          "opacity-50": !isFocused,
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

function NavContent() {
  function handleCreateTask() {
    document.getElementById("task-creation-field")?.focus();
  }

  return (
    <>
      <button className="flex items-center justify-center w-20 h-full">
        <CiInboxIn className="w-8 h-8 text-blue-600" />
      </button>

      <button
        className="flex items-center justify-center w-20 h-full"
        onClick={handleCreateTask}
      >
        <AiOutlinePlus className="w-8 h-8 text-red-600" />
      </button>

      <button className="flex items-center justify-center w-20 h-full bg-gray-200">
        <CiBrightnessUp className="w-8 h-8 text-yellow-600" />
      </button>

      <button className="invisible w-10 h-10"></button>
    </>
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
        Icon={CiInboxIn}
        iconColor="text-blue-600"
      >
        Inbox
      </SidemenuItem>
      <SidemenuItem
        className="hidden sm:list-item"
        Icon={CiBrightnessUp}
        iconColor="text-yellow-600"
        chip="5"
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
}: {
  children: ReactNode;
  Icon?: IconType;
  iconColor?: string;
  emoji?: string;
  chip?: string;
  className?: string;
}) {
  return (
    <li className={className}>
      <a
        href="#"
        className="flex items-center px-2 py-1 mb-1 rounded-md hover:bg-gray-200 group"
      >
        {Icon ? (
          <Icon className={classNames("flex-shrink-0 w-5 h-5", iconColor)} />
        ) : (
          /* If no emoji, still keep element to preserve spacing */
          <div className="flex-shrink-0 w-5 text-center">{emoji}</div>
        )}

        <span className="flex-1 ml-3 font-light text-gray-800 whitespace-nowrap">
          {children}
        </span>

        {chip != "" ? (
          <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-xs text-black rounded-full bg-zinc-300">
            {chip}
          </span>
        ) : (
          ""
        )}
      </a>
    </li>
  );
}
