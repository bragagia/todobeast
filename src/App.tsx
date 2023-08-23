import { ReactNode, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { CiBrightnessUp, CiInboxIn } from "react-icons/ci";

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
      <nav className="fixed bottom-0 z-20 flex flex-row items-center w-screen h-16 px-4 space-x-4 text-white bg-red-600 sm:hidden">
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
          className={
            "fixed left-0 z-30 w-screen h-screen bg-black sm:hidden bg-opacity-0 transition duration-300 ease-in-out" +
            (sidebarOpened ? " !bg-opacity-30" : "")
          }
          onClick={() => {
            setSidebarOpened(!sidebarOpened);
          }}
        ></button>

        <div
          className={
            "fixed flex-col w-64 bg-gray-100 shadow h-screen flex z-40 transition duration-150 ease-in-out sm:transform-none overflow-scroll px-4 py-4 " +
            (sidebarOpened ? "translate-x-0" : "-translate-x-64")
          }
        >
          <SidemenuContent />
        </div>
      </div>

      <div className="pb-16 sm:pb-0 w-full sm:w-[calc(100vw-16rem)]">
        <div className="container px-4 py-4 mx-auto sm:ml-64">
          <div className="w-full h-[200vh] border-2 border-gray-300 border-dashed rounded">
            {/* Place your content here */}
            aaa
          </div>
        </div>
      </div>
    </div>
  );
}

function NavContent() {
  return <></>;
}

function SidemenuContent() {
  return (
    <ul>
      <div className="flex flex-row items-center justify-center gap-3 mt-4 mb-8">
        <img src="/beast-happy.png" className="w-12 h-12" alt="" />
        <h1
          className=" text-3xl text-center text-[#FD001A] align-middle josefin-sans"
          style={{ textShadow: "1px 1px black" }}
        >
          Todobeast
        </h1>
      </div>

      <NavItem Icon={CiInboxIn} iconColor="text-blue-600">
        Inbox
      </NavItem>
      <NavItem Icon={CiBrightnessUp} iconColor="text-yellow-500" chip="5">
        Today
      </NavItem>
      {/* <NavItem Icon={CiCalendar} iconColor="text-green-600">
        Coming
      </NavItem> */}

      <h3 className="mt-8 mb-2 text-sm font-medium text-gray-500">Projects</h3>
      <NavItem emoji="🤷">Unlabeled</NavItem>
      <NavItem emoji="">Archive</NavItem>
    </ul>
  );
}

function NavItem({
  children,
  Icon,
  iconColor,
  emoji = "",
  chip = "",
}: {
  children: ReactNode;
  Icon?: IconType;
  iconColor?: string;
  emoji?: string;
  chip?: string;
}) {
  return (
    <li>
      <a
        href="#"
        className="flex items-center px-2 py-1 mb-1 rounded-md hover:bg-gray-200 group"
      >
        {Icon ? (
          <Icon className={"flex-shrink-0 w-5 h-5 " + iconColor} />
        ) : (
          /* If no emoji, still keep element to preserve spacing */
          <div
            className="flex-shrink-0 w-5 text-center"
            //  text-transparent
            // style={{ textShadow: "0 0 #000000" }}
          >
            {emoji}
          </div>
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
