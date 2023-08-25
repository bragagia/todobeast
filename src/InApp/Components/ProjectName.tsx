import classNames from "classnames";
import { dataProjects } from "../../FakeDat";
import { IconMap } from "../../utils/Icons";

export function ProjectName({
  projectId,
  className = "",
  iconClassName = "",
}: {
  projectId: number;
  className?: string;
  iconClassName?: string;
}) {
  let project = dataProjects[projectId];
  let Icon = IconMap[project.icon];
  let emoji = !Icon ? project.icon : "";

  return (
    <div className={classNames(className, "flex flex-row items-center gap-1")}>
      <span
        className={classNames(
          iconClassName,
          "flex items-center",
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
