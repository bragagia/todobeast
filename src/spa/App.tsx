import "./styles/global.css";

import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { AppRouter } from "./AppRouter";
import { AuthProvider } from "./AuthProvider";
import { ReplicacheProvider } from "./ReplicacheProvider";
import { SupabaseProvider } from "./SupabaseProvider";

export default function TodobeastApp() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <ReplicacheProvider>
          <StrictMode>
            <ThemeProvider
              attribute="class"
              storageKey="nightwind-mode"
              defaultTheme="system"
              disableTransitionOnChange
            >
              <AppRouter />
            </ThemeProvider>
          </StrictMode>
        </ReplicacheProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}
