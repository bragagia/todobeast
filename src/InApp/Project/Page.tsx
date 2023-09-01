import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { rep } from "../../Replicache";
import { getProject, projectIdPrefix } from "../../db/projects";
import { getTasksOfProject } from "../../db/tasks";
import { PageTitle } from "../Components/PageTitle";
import { ProjectName } from "../Components/ProjectName";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";

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
    <>
      <PageTitle>
        <ProjectName
          project={project}
          className="justify-center gap-2 text-xl"
          iconClassName="w-5 h-5"
        />
      </PageTitle>

      <div className="page-padding">
        <TaskCreator projectId={projectId} />
      </div>

      <TaskList tasks={tasksofProject} />
    </>
  );
}
