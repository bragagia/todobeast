import { TaskType } from "../../FakeData";
import { ProjectName } from "./ProjectName";

export function TaskProject({ task }: { task: TaskType }) {
  return (
    <button className="flex items-center w-full text-xs font-light md:text-sm button">
      <ProjectName
        projectId={task.projectId}
        className="md:justify-center"
        iconClassName="w-4 h-4"
      />
    </button>
  );
}
