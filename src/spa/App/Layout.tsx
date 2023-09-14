import classNames from "classnames";
import { Outlet } from "react-router-dom";
import { useReplicacheStatus } from "../ReplicacheProvider";
import { IconSignalSlash } from "../utils/Icons";
import { MobileNavContent } from "./Components/MobileNavContent";
import { SidebarContent } from "./Components/SidebarContent";

export function InAppLayout() {
  const repStatus = useReplicacheStatus();

  return (
    <div>
      {!repStatus.isOnline && (
        <div className="w-full bg-gray-200 flex flex-row items-center justify-center border-b border-b-gray-400 text-xs gap-1 font-bold text-gray-500 h-6">
          <div className="flex justify-center items-center h-4 w-4">
            <IconSignalSlash />
          </div>
          Offline mode
        </div>
      )}

      <div
        className={classNames(
          "flex flex-col w-screen sm:flex-row inter",
          { "h-screen": repStatus.isOnline },
          { "h-[calc(100vh-1.5rem)]": !repStatus.isOnline }
        )}
      >
        <div className="flex-shrink-0 hidden h-full overflow-scroll border-r border-gray-100 sm:block sm:w-48 md:w-64">
          <SidebarContent />
        </div>

        <div className="w-full h-full overflow-scroll">
          <div className="mx-auto">
            <Outlet />
          </div>
        </div>

        <nav className="w-full text-black border-t border-gray-100 h-14 sm:hidden">
          <MobileNavContent />
        </nav>
      </div>
    </div>
  );
}
