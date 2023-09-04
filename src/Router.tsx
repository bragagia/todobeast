import { createBrowserRouter, Navigate } from "react-router-dom";
import { projectIdRemovePrefix } from "./db/projects";
import { InAppLayout } from "./InApp/Layout";
import { PlannerPage } from "./InApp/Planner/Page";
import { ProjectPage } from "./InApp/Project/Page";
import { ProjectListPage } from "./InApp/ProjectsList/Page";
import { SettingsPage } from "./InApp/Settings/Page";
import { DayjsDate } from "./utils/PlainDate";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <InAppLayout />,
    children: [
      { index: true, element: <Navigate to={UrlPlanner()} /> },
      {
        path: "planner/",
        element: <PlannerPage />,
      },
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
      { path: "projects/:id/", element: <ProjectPage /> },
      {
        path: "settings/",
        element: <SettingsPage />,
      },
    ],
    errorElement: <p>The page you're looking for does not exist</p>,
  },
]);

export function UrlNavLinkPlanner() {
  return "/planner";
}

export function UrlPlanner(date?: DayjsDate, today?: DayjsDate) {
  if (!date || !today) return "/planner/today";

  if (date.isSame(today)) return "/planner/today";

  return "/planner/" + date.toString("/");
}

export function UrlProjectsList() {
  return "/projects/";
}

export function UrlProject(projectId: string, projectName: string) {
  return (
    "/projects/" +
    projectIdRemovePrefix(projectId) +
    "/" +
    projectName.replaceAll(" ", "-").toLowerCase()
  );
}
