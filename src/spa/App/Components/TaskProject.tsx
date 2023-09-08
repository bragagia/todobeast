import classNames from "classnames";
import { Check } from "lucide-react";
import { useState } from "react";
import { useSubscribe } from "replicache-react";
import { getAllProjects, getProject } from "../../../db/projects";
import { TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import { ProjectName } from "./ProjectName";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function TaskProject({ task }: { task: TaskType }) {
  const rep = useReplicache();

  const [open, setOpen] = useState(false);

  const project = useSubscribe(rep, getProject(task.projectId), null, [
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
        <button className="flex items-center w-full text-xs font-light button max-w-[8rem] md:max-w-[7rem] md:w-[7rem] overflow-hidden md:justify-center">
          <ProjectName project={project} iconClassName="w-4 h-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-48">
        <Command>
          {/* <CommandInput placeholder="Search project..." /> */}

          <CommandEmpty>No project found.</CommandEmpty>

          <CommandGroup className="max-h-[16rem] overflow-scroll">
            {allProjects?.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => {
                  setOpen(false);
                  if (project.id === task.projectId) return;

                  setTaskProject(task.id, project.id);
                }}
                className="w-full"
              >
                <Check
                  className={classNames(
                    "mr-2 h-4 w-4 shrink-0",
                    task.projectId === project.id ? "visible" : "invisible"
                  )}
                />
                <ProjectName project={project} iconClassName="w-4 h-4" />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
