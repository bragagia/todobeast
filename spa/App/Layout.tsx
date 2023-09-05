import { Outlet } from "react-router-dom";
import { MobileNavContent } from "./Components/MobileNavContent";
import { SidebarContent } from "./Components/SidebarContent";

export function InAppLayout() {
  return (
    <div className="flex flex-col-reverse w-screen h-screen sm:flex-row inter">
      <nav className="w-screen text-black border-t border-gray-100 h-14 sm:hidden">
        <MobileNavContent />
      </nav>

      <div className="flex-shrink-0 hidden h-screen overflow-scroll border-r border-gray-100 sm:block sm:w-48 md:w-64">
        <SidebarContent />
      </div>

      <div className="w-full h-screen overflow-scroll">
        <div className="container max-w-3xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
