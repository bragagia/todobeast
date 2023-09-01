import { useSubscribe } from "replicache-react";
import { ProjectName } from "./ProjectName";
import { rep } from "../../Replicache";
import { getProject } from "../../db/projects";
import { TaskType } from "../../db/tasks";

export function TaskProject({ task }: { task: TaskType }) {
  const project = useSubscribe(rep, getProject(task.projectId), null, [
    rep,
    task,
  ]);

  return (
    <button className="flex items-center w-full text-xs font-light md:text-sm button">
      <ProjectName
        project={project}
        className="md:justify-center"
        iconClassName="w-4 h-4"
      />
    </button>
  );
}
