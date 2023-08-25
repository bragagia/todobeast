import classNames from "classnames";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { MobileNavContent } from "./Components/MobileNavContent";
import { SidebarContent } from "./Components/SidebarContent";

export function InAppLayout() {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  useEffect(() => {
    if (sidebarOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [sidebarOpened]);

  return (
    <div className="inter">
      <nav className="fixed bottom-0 z-20 w-screen h-16 text-black bg-gray-100 sm:hidden">
        <MobileNavContent
          openSidebarHandler={() => setSidebarOpened(!sidebarOpened)}
        />
      </nav>

      <div
        className={classNames(
          "fixed  w-full sm:w-48 md:w-64 bg-white sm:bg-gray-100 h-[calc(100vh-4rem)] sm:h-screen z-40  overflow-scroll sm:transform-none",
          {
            "translate-x-0": sidebarOpened,
            "-translate-x-full": !sidebarOpened,
          }
        )}
      >
        <SidebarContent />
      </div>

      <div className="pb-16 sm:pb-0 w-full sm:w-[calc(100vw-12rem)] md:w-[calc(100vw-16rem)] sm:ml-48 md:ml-64">
        <div className="container max-w-3xl px-3 py-4 mx-auto ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
