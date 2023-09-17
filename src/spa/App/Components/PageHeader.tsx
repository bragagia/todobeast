import classNames from "classnames";
import { ReactNode } from "react";

export function PageHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={classNames("z-30 w-full", className)}>
      <div className="w-full pb-4 overflow-x-hidden">{children}</div>
    </div>
  );
}
