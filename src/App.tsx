import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { InboxPage } from "./InApp/InboxPage";
import { InAppLayout } from "./InApp/Layout";
import { SidemenuPage } from "./InApp/Nav";
import { DailyTasks, PlannerPage } from "./InApp/PlannerPage";

export default function App() {
  const router = createBrowserRouter([
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
            { path: "today/", element: <DailyTasks /> },
            { path: ":year/:month/:day", element: <DailyTasks /> },
          ],
        },
        { path: "inbox/", element: <InboxPage /> },
        { path: "projects/", element: <SidemenuPage /> },
      ],
      errorElement: <p>An error happened</p>,
    },
  ]);

  return <RouterProvider router={router} />;
}
