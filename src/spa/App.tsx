import "./styles/global.css";

import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { AppRouter } from "./AppRouter";
import { AuthProvider } from "./AuthProvider";
import { ReplicacheProvider } from "./ReplicacheProvider";
import { SupabaseProvider } from "./SupabaseProvider";
import { LoaderPage } from "./Loader";

export default function TodobeastApp() {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="nightwind-mode"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <SupabaseProvider>
        <AuthProvider>
          <ReplicacheProvider>
            <StrictMode>
              <LoaderPage>
                <AppRouter />
              </LoaderPage>
            </StrictMode>
          </ReplicacheProvider>
        </AuthProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
