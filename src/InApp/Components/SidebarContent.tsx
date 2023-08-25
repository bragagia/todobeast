import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { dataProjects } from "../../FakeData";
import { UrlProject } from "../../Router";
import { IconCalendar, IconMap, IconSettings } from "../../utils/Icons";
import { SidemenuItem } from "./SidebarItem";

export function SidebarContent() {
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
        to="/planner/today"
        className="hidden sm:list-item"
        Icon={IconCalendar}
        iconColor="text-green-600"
        active
      >
        Today
      </SidemenuItem>

      <h3 className="mt-8 mb-2 text-sm font-medium text-gray-500">Projects</h3>

      {dataProjects.map((project) => (
        <SidemenuItem
          key={project.id}
          to={UrlProject(project.id, project.name)}
          Icon={IconMap[project.icon]}
          emoji={project.icon}
          iconColor={project.icon_color}
        >
          {project.name}
        </SidemenuItem>
      ))}
    </ul>
  );
}
