import classNames from "classnames";
import { Check } from "lucide-react";
import { useState } from "react";
import { useSubscribe } from "replicache-react";
import { rep } from "src/Replicache";
import { getAllProjects, getProject } from "src/db/projects";
import { TaskType } from "src/db/tasks";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../@/components/ui/popover";
import { ProjectName } from "./ProjectName";

export function TaskProject({ task }: { task: TaskType }) {
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
        <button
          role="combobox"
          aria-expanded={open}
          className="flex items-center w-full text-xs font-light md:text-sm button"
        >
          <ProjectName project={project} iconClassName="w-4 h-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-48">
        <Command>
          <CommandInput placeholder="Search project..." />

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
