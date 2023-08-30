import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Replicache, WriteTransaction } from "replicache";
import { appRouter } from "./Router";

export const rep = new Replicache({
  licenseKey: "le17c8453f94e462e92cae4e1797cd24b",
  name: "userTest1",
  mutators: {
    taskCreate: async (tx: WriteTransaction, delta: any) => {
      // Despite 'await' this get almost always responds instantly.
      // Same with `put` below.
      const prev = (await tx.get("count")) ?? 0;
      const next = prev + delta;
      await tx.put("count", next);
      return next;
    },
  },
});

export default function App() {
  const cleanup = () => {
    // your cleanup code here
    rep.close();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", cleanup);

    // return a cleanup function from useEffect
    // that will remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  return <RouterProvider router={appRouter} />;
}
