import classNames from "classnames";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export function MobileNavItem({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <NavLink
      className={({ isActive, isPending }) =>
        classNames(
          "flex items-center justify-center w-20 h-full",
          {
            "text-black": isActive,
          },
          { "text-gray-400": !isActive }
        )
      }
      to={to}
    >
      {children}
    </NavLink>
  );
}
