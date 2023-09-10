import classNames from "classnames";
import { ProjectType } from "../../../db/projects";
import { projectIconMap } from "../../utils/Icons";

export function ProjectIcon({
  className,
  project,
  overrideColor,
}: {
  className?: string;
  project: ProjectType;
  overrideColor?: string;
}) {
  let Icon = projectIconMap[project.icon];
  let emoji = !Icon ? project.icon : "";

  return (
    <span
      className={classNames(
        "flex items-center overflow-hidden shrink-0",
        overrideColor ?? project.icon_color,
        className
      )}
    >
      {Icon ? <Icon /> : emoji}
    </span>
  );
}
