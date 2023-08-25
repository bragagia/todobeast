import { Dayjs } from "dayjs";
import { useParams } from "react-router-dom";
import { dataProjects, dataTasks } from "../../FakeData";
import { ProjectName } from "../Components/ProjectName";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";

export function ProjectPage() {
  let { id } = useParams();
  let date: Dayjs;

  if (!id) {
    return <p>Error: Missing project id</p>;
  }

  let projectId = +id;
  let project = dataProjects[projectId];

  return (
    <>
      <h2 className="mt-6 mb-8">
        <ProjectName
          projectId={projectId}
          className="justify-center gap-2 text-xl"
          iconClassName="w-5 h-5"
        />
      </h2>

      <TaskCreator />

      <TaskList
        tasks={dataTasks.filter((task) => {
          return task.projectId == projectId;
        })}
      />
    </>
  );
}
