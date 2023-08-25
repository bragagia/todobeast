import dayjs, { Dayjs } from "dayjs";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { InAppLayout } from "./InApp/Layout";
import { PlannerPage } from "./InApp/Planner/Page";
import { ProjectPage } from "./InApp/Project/Page";
import { ProjectListPage } from "./InApp/ProjectsList/Page";
import { areSameDay } from "./utils/Dates";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <InAppLayout />,
    children: [
      { index: true, element: <Navigate to={UrlPlanner()} /> },
      {
        path: "planner/today/",
        element: <PlannerPage />,
      },
      { path: "planner/:year/:month/:day", element: <PlannerPage /> },
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
