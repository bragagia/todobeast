import { AnimatedMount } from "../Components/AnimatedMount";
import { SidebarContent } from "../Components/SidebarContent";

export function ProjectListPage() {
  return (
    <AnimatedMount key="project-list">
      <SidebarContent />
    </AnimatedMount>
  );
}
