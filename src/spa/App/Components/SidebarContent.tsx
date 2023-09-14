import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  ResponderProvided,
} from "@hello-pangea/dnd";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import {
  ProjectType,
  getAllProjects,
  newProjectId,
} from "../../../db/projects";
import {
  UrlNavLinkPlanner,
  UrlPriorityPeek,
  UrlProject,
  UrlSettings,
} from "../../AppRouter";
import { useReplicache } from "../../ReplicacheProvider";
import {
  IconBolt,
  IconCalendar,
  IconPlus,
  IconSettings,
  projectIconMap,
} from "../../utils/Icons";
import { calcNewOrder } from "../../utils/Orderring";
import { SidemenuItem } from "./SidebarItem";

export function SidebarContent() {
  const rep = useReplicache();

  const navigate = useNavigate();

  const allProjects = useSubscribe(rep, getAllProjects(), [], [rep]);

  const uncachedAllNonSpecialProjects = useMemo(
    () => allProjects.filter((project) => project.special == null),
    [allProjects]
  );

  const [allNonSpecialProjects, setAllNonSpecialProjects] = useState(
    uncachedAllNonSpecialProjects
  );

  useEffect(
    () => setAllNonSpecialProjects(uncachedAllNonSpecialProjects),
    [uncachedAllNonSpecialProjects]
  );

  const projectInbox = useMemo(
    () => allProjects.find((project) => project.special == "inbox"),
    [allProjects]
  );

  const projectArchive = useMemo(
    () => allProjects.find((project) => project.special == "archive"),
    [allProjects]
  );

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

  function getProjectItem(project: ProjectType) {
    return (
      <SidemenuItem
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
    );
  }

  const onDragProject = useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      let draggedId = result.source.index;
      let draggedProject = allNonSpecialProjects[result.source.index];

      let destinationId = result.destination.index;

      let newOrder = calcNewOrder(
        draggedId < destinationId,
        destinationId,
        allNonSpecialProjects
      );

      const projectUpdate = {
        id: draggedProject.id,
        order: newOrder,
      };

      // We update the task in cache in order to prevent blinking during the time when replicache update its state
      setAllNonSpecialProjects(
        allNonSpecialProjects.map((project) =>
          project.id === draggedProject.id
            ? { ...draggedProject, ...projectUpdate }
            : project
        )
      );

      rep.mutate.projectUpdate(projectUpdate);
    },
    [allNonSpecialProjects, rep]
  );

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-row items-center justify-between my-4">
        <h1
          className="text-5xl text-center text-red-500 align-middle sm:text-2xl md:text-3xl josefin-sans"
          style={{ textShadow: "1px 1px black" }}
        >
          Todobeast
        </h1>
        <NavLink
          to={UrlSettings()}
          className={({ isActive, isPending }) =>
            classNames("text-gray-600 button", {
              "button-active": isActive,
            })
          }
        >
          <IconSettings />
        </NavLink>
      </div>

      <div className="hidden mt-6 sm:block">
        <SidemenuItem
          to={UrlNavLinkPlanner()}
          Icon={IconCalendar}
          iconColor="text-green-600"
          active
        >
          Today
        </SidemenuItem>

        <SidemenuItem
          to={UrlPriorityPeek()}
          Icon={IconBolt}
          iconColor="text-purple-600"
          active
        >
          Priority Peek
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

        {projectInbox ? getProjectItem(projectInbox) : null}

        <DragDropContext onDragEnd={onDragProject}>
          <Droppable droppableId="project-list-orderable">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {allNonSpecialProjects.map((project, id) => (
                  <Draggable
                    key={"sidebar/project/" + project.id}
                    draggableId={"sidebar/project/" + project.id}
                    index={id}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {getProjectItem(project)}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        {projectArchive ? getProjectItem(projectArchive) : null}
      </div>
    </div>
  );
}
