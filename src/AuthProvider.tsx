import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "@supabase/supabase-js";
import { Login } from "./Login";
import { useSupabase } from "./SupabaseProvider";
import { AppLoader } from "./Loader";

const UserContext = createContext<User | null>(null);

export function useUser() {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("Missing user context");
  }

  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const supabase = useSupabase();

  useEffect(() => {
    const fn = async () => {
      const { data, error } = await supabase.auth.refreshSession();

      setUser(data.user);
      setLoading(false);
    };
    fn();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return <AppLoader />;
  }

  if (user) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }

  return <Login />;
}
