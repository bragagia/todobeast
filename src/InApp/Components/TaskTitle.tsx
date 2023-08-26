import { useState } from "react";
import { dataTasks } from "../../FakeData";

export function TaskTitle({ taskId }: { taskId: number }) {
  const [task, setTask] = useState(dataTasks[taskId]);

  return (
    <div
      contentEditable
      className="break-words button hyphens-auto without-ring"
    >
      {task.title}
    </div>
  );
}
