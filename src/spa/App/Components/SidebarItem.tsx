import classNames from "classnames";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export function SidemenuItem({
  to,
  children,
  textColor = "text-gray-800",
  Icon,
  iconColor,
  emoji = "",
  chip = "",
  className = "",
}: {
  to: string;
  children: ReactNode;
  textColor?: string;
  Icon?: any;
  iconColor?: string;
  emoji?: string;
  chip?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <NavLink
        to={to}
        className={({ isActive, isPending }) =>
          classNames("flex items-center button mt-[1px] group", textColor, {
            "button-active": isActive,
          })
        }
      >
        {Icon ? (
          <div
            className={classNames(
              "flex-shrink-0 w-4 h-4 flex items-center",
              iconColor
            )}
          >
            <Icon />
          </div>
        ) : (
          /* If no emoji, still keep element to preserve spacing */
          <div className="flex-shrink-0 w-4 text-center">{emoji}</div>
        )}

        <span className="flex-1 ml-2 overflow-hidden font-light whitespace-nowrap text-ellipsis">
          {children}
        </span>

        {chip !== "" ? (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-3 text-xs text-black rounded-full bg-zinc-300">
            {chip}
          </span>
        ) : (
          ""
        )}
      </NavLink>
    </div>
  );
}
