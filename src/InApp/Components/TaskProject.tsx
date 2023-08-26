import { useState } from "react";
import { dataTasks } from "../../FakeData";
import { ProjectName } from "./ProjectName";

export function TaskProject({ taskId }: { taskId: number }) {
  const [task, setTask] = useState(dataTasks[taskId]);

  return (
    <button className="w-full text-xs font-light sm:text-sm button">
      <ProjectName
        projectId={task.projectId}
        className="sm:justify-center"
        iconClassName="w-4 h-4"
      />
    </button>
  );
}
