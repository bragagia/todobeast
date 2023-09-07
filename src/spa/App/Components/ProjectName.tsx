import classNames from "classnames";
import { ProjectType } from "../../../db/projects";
import { ProjectIcon } from "./ProjectIcon";

export function ProjectName({
  project,
  className = "",
  iconClassName = "",
}: {
  project: ProjectType | null;
  className?: string;
  iconClassName?: string;
}) {
  if (!project) {
    return <></>;
  }

  return (
    <div
      className={classNames(
        className,
        "flex flex-row items-center gap-1 overflow-hidden"
      )}
    >
      <ProjectIcon className={iconClassName} project={project} />
      <span className="overflow-hidden break-words hyphens-auto whitespace-nowrap text-ellipsis">
        {project.name}
      </span>
    </div>
  );
}
