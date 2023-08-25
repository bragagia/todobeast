import { Outlet } from "react-router-dom";
import { WeeklyCalendarNav } from "./Components/WeeklyCalendarNav";

export function PlannerPage() {
  return (
    <>
      <WeeklyCalendarNav />

      <Outlet />
    </>
  );
}
