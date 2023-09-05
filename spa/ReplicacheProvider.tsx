import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Replicache } from "replicache";
import { initDataMutators } from "./db/initData";
import { projectsMutators } from "./db/projects";
import { tasksMutators } from "./db/tasks";

const ReplicacheMutators = {
  ...tasksMutators,
  ...projectsMutators,
  ...initDataMutators,
};

const ReplicacheContext = createContext<Replicache<
  typeof ReplicacheMutators
> | null>(null);

export function useReplicache() {
  const rep = useContext(ReplicacheContext);

  if (!rep) {
    throw new Error("Missing replicache context");
  }
  return rep;
}

export function ReplicacheProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string;
}) {
  function createRep(userId: string) {
    if (!userId) return null;

    return new Replicache({
      licenseKey: "le17c8453f94e462e92cae4e1797cd24b",
      name: userId,
      mutators: ReplicacheMutators,
    });
  }

  const [rep, setRep] = useState<Replicache<typeof ReplicacheMutators> | null>(
    null
  );

  useEffect(() => {
    setRep(createRep(userId));
    if (!rep) return; // TS complaining

    rep.mutate.createInitData();

    window.addEventListener("beforeunload", () => rep.close());

    return () => {
      window.removeEventListener("beforeunload", () => rep.close());
    };
  }, [userId]);

  if (!rep) {
    return <></>;
  }

  return (
    <ReplicacheContext.Provider value={rep}>
      {children}
    </ReplicacheContext.Provider>
  );
}
