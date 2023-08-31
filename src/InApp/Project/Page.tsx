import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { rep } from "../../App";
import { getAllTasks, getTasksOfProject } from "../../FakeData";
import { AnimatedMount } from "../Components/AnimatedMount";
import { ProjectName } from "../Components/ProjectName";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";

export function ProjectPage() {
  let { id } = useParams();

  let projectId = useMemo(() => (id ? +id : 0), [id]);

  const allTasks = useSubscribe(rep, getAllTasks(), [], [rep]);

  const tasksofProject = useMemo(
    () => getTasksOfProject(allTasks, projectId),
    [allTasks, projectId]
  );

  if (!id) {
    return <p>Error: Missing project id</p>;
  }

  return (
    <AnimatedMount key={id}>
      <h2 className="mt-6 mb-8">
        <ProjectName
          projectId={projectId}
          className="justify-center gap-2 text-xl"
          iconClassName="w-5 h-5"
        />
      </h2>

      <TaskCreator projectId={projectId} />

      <TaskList tasks={tasksofProject} />
    </AnimatedMount>
  );
}
