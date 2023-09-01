import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { rep } from "../../Replicache";
import { UrlNavLinkPlanner, UrlProject } from "../../Router";
import { getAllProjects } from "../../db/projects";
import { IconCalendar, IconMap, IconSettings } from "../../utils/Icons";
import { SidemenuItem } from "./SidebarItem";

export function SidebarContent() {
  const allProjects = useSubscribe(rep, getAllProjects(), [], [rep]);

  return (
    <ul className="flex flex-col p-4">
      <div className="flex flex-row items-center justify-between my-4">
        <h1
          className="text-5xl text-center text-red-500 align-middle sm:text-2xl md:text-3xl josefin-sans"
          style={{ textShadow: "1px 1px black" }}
        >
          Todobeast
        </h1>
        <NavLink
          to="/settings"
          className={({ isActive, isPending }) =>
            classNames("text-gray-800 button", {
              "button-active": isActive,
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

      <h3 className="mt-8 mb-2 text-sm font-medium text-gray-500">Projects</h3>

      {allProjects
        .sort((a, b) => a.order - b.order)
        .map((project) => (
          <SidemenuItem
            key={"sidebar/project/" + project.id}
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
