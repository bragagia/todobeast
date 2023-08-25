import dayjs, { Dayjs } from "dayjs";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { InAppLayout } from "./InApp/Layout";
import { ProjectPage } from "./InApp/Project/Page";
import { ProjectListPage } from "./InApp/ProjectsList/Page";
import { areSameDay } from "./utils/Dates";
import { PlannerPage } from "./InApp/Planner/Page";
import { PlannerTasksPage } from "./InApp/Planner/PlannerTasks/Page";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <InAppLayout />,
    children: [
      { index: true, element: <Navigate to="/planner" /> },
      {
        path: "planner/",
        element: <PlannerPage />,
        children: [
          { index: true, element: <Navigate to="/planner/today" /> },
          { path: "today/", element: <PlannerTasksPage /> },
          { path: ":year/:month/:day", element: <PlannerTasksPage /> },
        ],
      },
      {
        path: "projects/",
        element: <ProjectListPage />,
      },
      { path: "projects/:id/:name/", element: <ProjectPage /> },
    ],
    errorElement: <p>An error happened</p>,
  },
]);

export function UrlPlanner(date?: Dayjs) {
  if (!date) return "/planner/today";

  if (areSameDay(date, dayjs())) return "/planner/today";

  return "/planner/" + dayjs(date).format("YYYY/MM/DD");
}

export function UrlProjectList() {
  return "/projects";
}

export function UrlProject(projectId: number, projectName: string) {
  return (
    "/projects/" +
    projectId +
    "/" +
    projectName.replaceAll(" ", "-").toLowerCase()
  );
}

export function UrlInbox() {
  return "/projects/" + 0 + "/" + "inbox";
}
