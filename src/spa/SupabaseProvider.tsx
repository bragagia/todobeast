import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import { ReactNode, createContext, useContext } from "react";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function useSupabase() {
  const supabase = useContext(SupabaseContext);

  if (!supabase) {
    throw new Error("Missing supabase context");
  }
  return supabase;
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient();

  // TODO: Remove if working
  // const supabase = useMemo(
  //   () =>
  //     createClient(
  //       process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  //     ),
  //   []
  // );

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
