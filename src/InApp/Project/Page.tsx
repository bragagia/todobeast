import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { AnimatedMount } from "../Components/AnimatedMount";
import { PageTitle } from "../Components/PageTitle";
import { ProjectName } from "../Components/ProjectName";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";
import { rep } from "../../Replicache";
import { projectIdPrefix, getProject } from "../../db/projects";
import { getTasksOfProject } from "../../db/tasks";

export function ProjectPage() {
  let { id } = useParams();

  let projectId = useMemo(() => (id ? projectIdPrefix + id : ""), [id]);

  const project = useSubscribe(rep, getProject(projectId), null, [
    rep,
    projectId,
  ]);

  const tasksofProject = useSubscribe(
    rep,
    getTasksOfProject(projectId),
    [],
    [rep, projectId]
  );

  if (!projectId || !project) {
    return <p>Error: Missing project id</p>;
  }

  return (
    <AnimatedMount key={projectId}>
      <PageTitle>
        <ProjectName
          project={project}
          className="justify-center gap-2 text-xl"
          iconClassName="w-5 h-5"
        />
      </PageTitle>

      <TaskCreator projectId={projectId} />

      <TaskList tasks={tasksofProject} />
    </AnimatedMount>
  );
}
