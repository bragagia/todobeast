import { SupabaseClient } from "@supabase/supabase-js";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Replicache } from "replicache";
import { useSubscribe } from "replicache-react";
import { ReplicacheMutators } from "../db/mutators";
import { getAllProjects } from "../db/projects";
import { useUser } from "./AuthProvider";
import { LoaderPage } from "./Loader";
import { useSupabase } from "./SupabaseProvider";

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

export type ReplicacheStatus = {
  isOnline: boolean;
};

const ReplicacheStatusContext = createContext<ReplicacheStatus | null>(null);

export function useReplicacheStatus() {
  const repStatus = useContext(ReplicacheStatusContext);

  if (!repStatus) {
    throw new Error("Missing replicache status context");
  }
  return repStatus;
}

export function ReplicacheProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  const [isOnline, setIsOnline] = useState(true);
  const [status, setStatus] = useState<ReplicacheStatus>({
    isOnline: isOnline,
  });
  useEffect(() => {
    setStatus({ isOnline: isOnline });
  }, [isOnline]);

  const user = useUser();

  const supabase = useSupabase();
  const [rep, setRep] = useState<Replicache<typeof ReplicacheMutators> | null>(
    null
  );

  const allProjects = useSubscribe(rep, getAllProjects(), null, [rep]);

  useEffect(() => {
    setLoading(true);

    if (!user.id || user.id == "") return;

    let rep = new Replicache({
      licenseKey: process.env.NEXT_PUBLIC_REPLICACHE_LICENSE!,
      name: user.id,
      pushURL: `/api/replicache/push`,
      pullURL: `/api/replicache/pull`,
      // TODO: schemaVersion: "1",
      mutators: ReplicacheMutators,
      pullInterval: 60000,
      pushDelay: 1000,
    });
    rep.onOnlineChange = (online) => {
      setIsOnline(online);
    };
    rep.getAuth = () => {
      supabase.auth.refreshSession();
      return null; // ?? Not sure what I should return
    };

    setRep(rep);

    const firstPull = async () => {
      // TODO: rep.onSync
      // TODO: rep.onUpdateNeeded

      await rep.pull();

      setLoading(false);
    };
    firstPull();

    const unlisten = listen(supabase, async () => rep.pull());

    window.addEventListener("beforeunload", () => {
      unlisten();
      rep.close();
    });

    return () => {
      unlisten();
      rep.close();
    };
  }, [user.id, supabase]);

  // Wait for allProjects population before displaying the page
  if (loading || !rep || !allProjects || allProjects.length == 0) {
    return <LoaderPage />;
  }

  return (
    <ReplicacheContext.Provider value={rep}>
      <ReplicacheStatusContext.Provider value={status}>
        {children}
      </ReplicacheStatusContext.Provider>
    </ReplicacheContext.Provider>
  );
}

// Implements a Replicache poke using Supabase's realtime functionality.
// See: backend/poke/supabase.ts.
function listen(supabase: SupabaseClient, onPoke: () => Promise<void>) {
  function createChannel() {
    return supabase
      .channel("any")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "replicache_space",
        },
        () => {
          onPoke();
        }
      )
      .subscribe();
  }

  let channel = createChannel();

  async function handleVisibilityChange() {
    if (!document.hidden) {
      // Tab is in view again, restart listener just in case, and poke to be sure we didn't miss something.
      await supabase.removeChannel(channel);
      channel = createChannel();
      onPoke();
    }
  }
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    supabase.removeChannel(channel);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
