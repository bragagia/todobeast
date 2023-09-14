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
    <div className={classNames("sticky top-0 z-30", className)}>
      <div className="w-full bg-white pb-[1px] overflow-x-hidden">
        {children}
      </div>

      <div className="h-4 from-white bg-gradient-to-b"></div>
    </div>
  );
}
