import classNames from "classnames";
import { Link, NavLink } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { rep } from "../../Replicache";
import { UrlNavLinkPlanner, UrlProject, UrlProjectsNew } from "../../Router";
import { getAllProjects } from "../../db/projects";
import {
  IconCalendar,
  IconMap,
  IconPlus,
  IconSettings,
} from "../../utils/Icons";
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

      <div className="group">
        <div className="flex flex-row items-center justify-between mt-8 mb-2">
          <h3 className="text-sm font-medium text-gray-500 ">Projects</h3>
          <Link
            className="flex w-5 h-5 text-gray-400 no-touch:invisible group-hover:visible hover:text-gray-900"
            to={UrlProjectsNew()}
          >
            <IconPlus />
          </Link>
        </div>

        {allProjects.map((project) => (
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
      </div>
    </ul>
  );
}
