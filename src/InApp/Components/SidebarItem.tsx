import classNames from "classnames";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export function SidemenuItem({
  to,
  children,
  Icon,
  iconColor,
  emoji = "",
  chip = "",
  className = "",
  active,
}: {
  to: string;
  children: ReactNode;
  Icon?: any;
  iconColor?: string;
  emoji?: string;
  chip?: string;
  className?: string;
  active?: boolean;
}) {
  return (
    <li className={className}>
      <NavLink
        to={to}
        className={({ isActive, isPending }) =>
          classNames("flex items-center mb-1 sidemenu-button group", {
            "sidemenu-button-active": isActive,
          })
        }
      >
        {Icon ? (
          <div
            className={classNames(
              "flex-shrink-0 w-5 h-5 flex items-center",
              iconColor
            )}
          >
            <Icon />
          </div>
        ) : (
          /* If no emoji, still keep element to preserve spacing */
          <div className="flex-shrink-0 w-5 text-center">{emoji}</div>
        )}

        <span className="flex-1 ml-3 font-light text-gray-800 whitespace-nowrap">
          {children}
        </span>

        {chip != "" ? (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-3 text-xs text-black rounded-full bg-zinc-300">
            {chip}
          </span>
        ) : (
          ""
        )}
      </NavLink>
    </li>
  );
}