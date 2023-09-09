import classNames from "classnames";
import { NavLink, useNavigate } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { getAllProjects, newProjectId } from "../../../db/projects";
import { UrlNavLinkPlanner, UrlProject } from "../../AppRouter";
import { useReplicache } from "../../ReplicacheProvider";
import {
  IconCalendar,
  IconPlus,
  IconSettings,
  projectIconMap,
} from "../../utils/Icons";
import { SidemenuItem } from "./SidebarItem";

export function SidebarContent() {
  const rep = useReplicache();

  const navigate = useNavigate();

  const allProjects = useSubscribe(rep, getAllProjects(), [], [rep]);

  async function createProject() {
    let id = newProjectId();

    await rep.mutate.projectCreate({
      id: id,
      name: "",
      icon: "dot",
      icon_color: "black",
      special: null,
    });

    navigate(UrlProject(id, ""));
  }

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
          <button
            className="flex w-5 h-5 text-gray-400 pointer-fine:invisible group-hover:visible hover:text-gray-900"
            onClick={createProject}
          >
            <IconPlus />
          </button>
        </div>

        {allProjects.map((project) => (
          <SidemenuItem
            key={"sidebar/project/" + project.id}
            to={UrlProject(project.id, project.name)}
            Icon={projectIconMap[project.icon]}
            emoji={project.icon}
            iconColor={project.icon_color}
            textColor={
              project.special === "archive" ? project.icon_color : undefined
            }
          >
            {project.name != "" ? project.name : "New project"}
          </SidemenuItem>
        ))}
      </div>
    </ul>
  );
}
