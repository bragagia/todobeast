import classNames from "classnames";
import { ProjectType } from "src/db/projects";
import { projectIconMap } from "src/utils/Icons";

export function ProjectIcon({
  className,
  project,
}: {
  className?: string;
  project: ProjectType;
}) {
  let Icon = projectIconMap[project.icon];
  let emoji = !Icon ? project.icon : "";

  return (
    <span
      className={classNames(
        className,
        "flex items-center overflow-hidden shrink-0",
        project.icon_color
      )}
    >
      {Icon ? <Icon /> : emoji}
    </span>
  );
}
