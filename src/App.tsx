import { nanoid } from "nanoid";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Replicache, WriteTransaction } from "replicache";
import { TaskType } from "./FakeData";
import { appRouter } from "./Router";

export const taskIdPrefix = "tasks/";

export const rep = new Replicache({
  licenseKey: "le17c8453f94e462e92cae4e1797cd24b",
  name: "mathias.bragagia.pro+test2@gmail.com",
  mutators: {
    taskCreate: async (tx: WriteTransaction, task: Omit<TaskType, "id">) => {
      let taskId = taskIdPrefix + nanoid();

      await tx.put(taskId, { id: taskId, ...task });

      return taskId;
    },
    taskUpdate: async (
      tx: WriteTransaction,
      task: Required<Pick<TaskType, "id">> & Partial<TaskType>
    ) => {
      const prev = (await tx.get(task.id)) as TaskType;
      const next = { ...prev, ...task };

      await tx.put(task.id, next);
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
