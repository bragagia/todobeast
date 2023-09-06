import { SupabaseClient } from "@supabase/supabase-js";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Replicache } from "replicache";
import { useUser } from "./AuthProvider";
import { LoaderPage } from "./Loader";
import { useSupabase } from "./SupabaseProvider";
import { ReplicacheMutators } from "./db/mutators";

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

export function ReplicacheProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  const user = useUser();

  const supabase = useSupabase();

  function createRep(userId: string) {
    if (!userId) return null;

    return new Replicache({
      licenseKey: "le17c8453f94e462e92cae4e1797cd24b",
      name: userId, // TODO: Add a cookie per-device key
      pushURL: `/api/replicache/push`,
      pullURL: `/api/replicache/pull`,
      mutators: ReplicacheMutators,
    });
  }

  const [rep, setRep] = useState<Replicache<typeof ReplicacheMutators> | null>(
    null
  );

  useEffect(() => {
    setLoading(true);

    const rep = createRep(user.id);
    setRep(rep);
    if (rep === null) return;

    rep.mutate.createInitData();

    const unlisten = listen(supabase, async () => rep.pull());

    window.addEventListener("beforeunload", () => {
      unlisten();
      rep.close();
    });

    setLoading(false);

    return () => {
      window.addEventListener("beforeunload", () => {
        unlisten();
        rep.close();
      });
    };
  }, [user.id, supabase]);

  if (loading || !rep) {
    return <LoaderPage />;
  }

  return (
    <ReplicacheContext.Provider value={rep}>
      {children}
    </ReplicacheContext.Provider>
  );
}

// Implements a Replicache poke using Supabase's realtime functionality.
// See: backend/poke/supabase.ts.
function listen(supabase: SupabaseClient, onPoke: () => Promise<void>) {
  const subscriptionChannel = supabase.channel("public:replicache_space");
  subscriptionChannel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "replicache_space",
      },
      () => {
        void onPoke();
      }
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(subscriptionChannel);
  };
}
