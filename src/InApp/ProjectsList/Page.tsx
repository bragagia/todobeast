import { AnimatedMount } from "../Components/AnimatedMount";
import { SidebarContent } from "../Components/SidebarContent";

export function ProjectListPage() {
  return (
    <AnimatedMount>
      <SidebarContent key="project-list" />
    </AnimatedMount>
  );
}
