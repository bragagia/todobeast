import { useParams } from "react-router-dom";
import { dataTasks } from "../../FakeData";
import { AnimatedMount } from "../Components/AnimatedMount";
import { ProjectName } from "../Components/ProjectName";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";

export function ProjectPage() {
  let { id } = useParams();

  if (!id) {
    return <p>Error: Missing project id</p>;
  }

  let projectId = +id;

  return (
    <AnimatedMount key={id}>
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
    </AnimatedMount>
  );
}
