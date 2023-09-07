import "./styles/global-reset.css";

import "react-day-picker/dist/style.css";

import "./styles/global.css";

import { StrictMode } from "react";
import { AppRouter } from "./AppRouter";
import { AuthProvider } from "./AuthProvider";
import { ReplicacheProvider } from "./ReplicacheProvider";
import { SupabaseProvider } from "./SupabaseProvider";

export default function TodobeastApp() {
  // note : Supabase provider must be outside StrictMode to prevent double instanciation
  return (
    <SupabaseProvider>
      <AuthProvider>
        <ReplicacheProvider>
          <StrictMode>
            <AppRouter />
          </StrictMode>
        </ReplicacheProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}
