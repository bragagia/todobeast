import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { projectIdRemovePrefix } from "../db/projects";
import { InAppLayout } from "./App/Layout";
import { PlannerPage } from "./App/Planner/Page";
import { PriorityPeekPage } from "./App/PriorityPeek/Page";
import { ProjectPage } from "./App/Project/Page";
import { ProjectListPage } from "./App/ProjectsList/Page";
import { SettingsPage } from "./App/Settings/Page";
import { SettingsUpdatePasswordPage } from "./App/Settings/UpdatePassword/Page";
import { DayjsDate } from "./utils/PlainDate";

export function AppRouter() {
  const appRouter = createBrowserRouter(
    [
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
          { path: "priority-peek/", element: <PriorityPeekPage /> },
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
          {
            path: "/settings/update-password",
            element: <SettingsUpdatePasswordPage />,
          },
        ],
        errorElement: <p>The page you're looking for does not exist</p>,
      },
    ],
    { basename: "/a" }
  );

  return <RouterProvider router={appRouter} />;
}
export function UrlNavLinkPlanner() {
  return "/planner";
}

export function UrlPriorityPeek() {
  return "/priority-peek";
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

export function UrlSettings() {
  return "/settings";
}

export function UrlSettingsUpdatePassword() {
  return "/settings/update-password";
}
