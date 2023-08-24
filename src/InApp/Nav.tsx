import classNames from "classnames";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { IconBurger, IconCalendar, IconInbox, IconSettings } from "../Icons";

export function NavContent({
  openSidebarHandler,
}: {
  openSidebarHandler: () => void;
}) {
  function handleCreateTask() {
    document.getElementById("task-creation-field")?.focus();
  }

  return (
    <div className="flex flex-row items-center justify-around h-full">
      <NavLink
        className={({ isActive, isPending }) =>
          classNames(
            "flex items-center justify-center w-20 h-full text-gray-400",
            { "text-gray-900": isActive }
          )
        }
        to="/projects"
      >
        <IconBurger />
      </NavLink>

      <NavLink
        className={({ isActive, isPending }) =>
          classNames(
            "flex items-center justify-center w-20 h-full text-gray-400",
            { "text-gray-900": isActive }
          )
        }
        to="/planner"
      >
        <IconCalendar />
      </NavLink>

      <NavLink
        className={({ isActive, isPending }) =>
          classNames(
            "flex items-center justify-center w-20 h-full text-gray-400",
            { "text-gray-900": isActive }
          )
        }
        to="/inbox"
      >
        <IconInbox />
      </NavLink>
    </div>
  );
}

export function SidemenuContent() {
  return (
    <ul className="flex flex-col px-4 py-4">
      <div className="flex flex-row items-center justify-between mt-4 mb-8">
        <h1
          className=" text-3xl text-center text-[#FD001A] align-middle josefin-sans"
          style={{ textShadow: "1px 1px black" }}
        >
          Todobeast
        </h1>
        <NavLink
          to="/settings"
          className={({ isActive, isPending }) =>
            classNames("text-gray-800 sidemenu-button", {
              "sidemenu-button-active": isActive,
            })
          }
        >
          <IconSettings />
        </NavLink>
      </div>

      <SidemenuItem
        to="/inbox"
        className="hidden sm:list-item"
        Icon={IconInbox}
        iconColor="text-blue-600"
      >
        Inbox
      </SidemenuItem>
      <SidemenuItem
        to="/planner/today"
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
      <SidemenuItem to="/" emoji="🤷">
        Unlabeled
      </SidemenuItem>
      <SidemenuItem to="/" emoji="">
        Archive
      </SidemenuItem>
    </ul>
  );
}

function SidemenuItem({
  to,
  children,
  Icon,
  iconColor,
  emoji = "",
  chip = "",
  className = "",
  active,
}: {
  to: string;
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
      <NavLink
        to={to}
        className={({ isActive, isPending }) =>
          classNames("flex items-center mb-1 sidemenu-button group", {
            "sidemenu-button-active": isActive,
          })
        }
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
      </NavLink>
    </li>
  );
}

export function SidemenuPage() {
  return <SidemenuContent />;
}
