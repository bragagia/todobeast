import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { rep } from "./Replicache";
import { appRouter } from "./Router";

export default function App() {
  const cleanup = () => {
    // your cleanup code here
    rep.close();
  };

  useEffect(() => {
    rep.mutate.createInitData();

    window.addEventListener("beforeunload", cleanup);

    // return a cleanup function from useEffect
    // that will remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  return <RouterProvider router={appRouter} />;
}
