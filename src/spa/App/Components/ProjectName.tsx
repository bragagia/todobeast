import classNames from "classnames";
import { ProjectType } from "../../../db/projects";
import { ProjectIcon } from "./ProjectIcon";

export function ProjectName({
  project,
  className = "",
  iconClassName = "",
  overrideColor,
  overrideName,
}: {
  project: ProjectType | null;
  className?: string;
  iconClassName?: string;
  overrideColor?: string;
  overrideName?: string;
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
      <ProjectIcon
        className={iconClassName}
        overrideColor={overrideColor}
        project={project}
      />
      <span className="overflow-hidden break-words hyphens-auto whitespace-nowrap text-ellipsis">
        {overrideName ?? project.name}
      </span>
    </div>
  );
}
