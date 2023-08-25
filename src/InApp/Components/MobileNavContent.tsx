import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { UrlInbox, UrlPlanner, UrlProjectList } from "../../Router";
import { IconBurger, IconCalendar, IconInbox } from "../../utils/Icons";

export function MobileNavContent({
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
        to={UrlProjectList()}
        end
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
        to={UrlPlanner()}
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
        to={UrlInbox()}
      >
        <IconInbox />
      </NavLink>
    </div>
  );
}
