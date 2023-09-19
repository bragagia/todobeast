import classNames from "classnames";
import { useState } from "react";
import { useSubscribe } from "replicache-react";
import { getAllProjects, getProject, projectInbox } from "../../../db/projects";
import { TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import { ProjectName } from "./ProjectName";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function TaskProject({ task }: { task: TaskType }) {
  const rep = useReplicache();

  const [open, setOpen] = useState(false);

  const project = useSubscribe(rep, getProject(task.projectId), projectInbox, [
    rep,
    task,
  ]);

  const allProjects = useSubscribe(rep, getAllProjects(), null, [rep]);

  async function setTaskProject(taskId: string, projectId: string) {
    await rep.mutate.taskUpdate({
      id: taskId,
      projectId: projectId,
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          title={project?.name}
          className={classNames(
            "flex h-full justify-normal items-center w-full text-xs font-light button-gray-200 max-w-[8rem] lg:max-w-[7rem] lg:w-[7rem] overflow-hidden group/projectbutton",
            {
              "text-gray-300 hover:text-gray-500": project?.special === "inbox",
            }
          )}
        >
          {project?.special === "inbox" ? (
            <ProjectName
              project={project}
              iconClassName="w-4 h-4"
              overrideColor="text-gray-300 group-hover/projectbutton:text-gray-500"
              overrideName="Set project"
            />
          ) : (
            <ProjectName project={project} iconClassName="w-4 h-4" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-48 flex flex-col items-start py-1">
        {allProjects?.map((project) => (
          <button
            key={project.id}
            onClick={() => {
              setOpen(false);
              if (project.id === task.projectId) return;

              setTaskProject(task.id, project.id);
            }}
            className={classNames("popover-button", {
              "popover-button-active": project.id === task.projectId,
            })}
          >
            {project?.special === "inbox" ? (
              <ProjectName
                project={project}
                className="text-gray-400"
                iconClassName="w-4 h-4"
                overrideColor="text-gray-400"
                overrideName="No project"
              />
            ) : (
              <ProjectName project={project} iconClassName="w-4 h-4" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
