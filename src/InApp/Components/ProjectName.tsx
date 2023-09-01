import classNames from "classnames";
import { ProjectType } from "../../db/projects";
import { IconMap } from "../../utils/Icons";

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

  let Icon = IconMap[project.icon];
  let emoji = !Icon ? project.icon : "";

  return (
    <div className={classNames(className, "flex flex-row items-center gap-1")}>
      <span
        className={classNames(
          iconClassName,
          "flex items-center overflow-hidden",
          project.icon_color
        )}
      >
        {Icon ? <Icon /> : emoji}
      </span>
      <span className="overflow-auto break-words hyphens-auto">
        {project.name}
      </span>
    </div>
  );
}
