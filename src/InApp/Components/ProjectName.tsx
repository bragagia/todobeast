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
    <div
      className={classNames(
        className,
        "flex flex-row items-center gap-1 overflow-hidden"
      )}
    >
      <span
        className={classNames(
          iconClassName,
          "flex items-center overflow-hidden shrink-0",
          project.icon_color
        )}
      >
        {Icon ? <Icon /> : emoji}
      </span>
      <span className="overflow-hidden break-words hyphens-auto whitespace-nowrap text-ellipsis">
        {project.name}
      </span>
    </div>
  );
}
