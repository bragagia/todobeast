import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { dataProjects } from "../../FakeData";
import { UrlNavLinkPlanner, UrlProject } from "../../Router";
import { IconCalendar, IconMap, IconSettings } from "../../utils/Icons";
import { SidemenuItem } from "./SidebarItem";

export function SidebarContent() {
  return (
    <ul className="flex flex-col py-4">
      <div className="flex flex-row items-center justify-between px-4 my-4">
        <h1
          className="text-3xl text-center text-red-500 align-middle josefin-sans"
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

      <div className="hidden mt-6 sm:list-item">
        <SidemenuItem
          to={UrlNavLinkPlanner()}
          Icon={IconCalendar}
          iconColor="text-green-600"
          active
        >
          Today
        </SidemenuItem>
      </div>

      <h3 className="px-4 mt-8 mb-2 text-sm font-medium text-gray-500">
        Projects
      </h3>

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
