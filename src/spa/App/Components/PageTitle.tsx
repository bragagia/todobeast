import classNames from "classnames";
import { ReactNode } from "react";

export function PageTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "flex flex-row items-center justify-center py-6 page-padding group",
        className
      )}
    >
      {children}
    </div>
  );
}
