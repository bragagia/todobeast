import { createBrowserRouter, Navigate } from "react-router-dom";
import { InAppLayout } from "./InApp/Layout";
import { PlannerLayout } from "./InApp/Planner/Layout";
import { PlannerPage } from "./InApp/Planner/Page";
import { ProjectPage } from "./InApp/Project/Page";
import { ProjectListPage } from "./InApp/ProjectsList/Page";
import { DayjsDate } from "./utils/PlainDate";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <InAppLayout />,
    children: [
      { index: true, element: <Navigate to={UrlPlanner()} /> },
      {
        path: "planner",
        element: <PlannerLayout />,
        children: [
          {
            index: true,
            element: <PlannerPage />,
          },
          {
            path: "today/",
            element: <PlannerPage />,
          },
          { path: ":year/:month/:day", element: <PlannerPage /> },
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

export function UrlNavLinkPlanner() {
  return "/planner";
}

export function UrlPlanner(date?: DayjsDate, today?: DayjsDate) {
  if (!date || !today) return "/planner/today";

  if (date.isSame(today)) return "/planner/today";

  return "/planner/" + date.toString("/");
}

export function UrlProjectList() {
  return "/projects/";
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
  return "/projects/0/inbox";
}
