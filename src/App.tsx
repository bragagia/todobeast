import { RouterProvider } from "react-router-dom";
import { appRouter } from "./Router";

export default function App() {
  return <RouterProvider router={appRouter} />;
}
