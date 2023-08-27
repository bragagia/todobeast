import { Outlet } from "react-router-dom";
import { AnimatedMount } from "../Components/AnimatedMount";

export function PlannerLayout() {
  return (
    <AnimatedMount key="planner-layout">
      <Outlet key="planner" />
    </AnimatedMount>
  );
}
