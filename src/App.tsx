import "./style.css";

import { StrictMode } from "react";
import { AppRouter } from "./AppRouter";
import { AuthProvider } from "./AuthProvider";
import { ReplicacheProvider } from "./ReplicacheProvider";
import { SupabaseProvider } from "./SupabaseProvider";

export default function TodobeastApp() {
  // note : Supabase provider must be outside StrictMode to prevent double instanciation
  return (
    <SupabaseProvider>
      <StrictMode>
        <AuthProvider>
          <ReplicacheProvider>
            <AppRouter />
          </ReplicacheProvider>
        </AuthProvider>
      </StrictMode>
    </SupabaseProvider>
  );
}
