import "./styles/global.css";

import { ThemeProvider } from "next-themes";
import { StrictMode, useEffect } from "react";
import { AppRouter } from "./AppRouter";
import { AuthProvider } from "./AuthProvider";
import { LoaderPage } from "./Loader";
import { ReplicacheProvider } from "./ReplicacheProvider";
import { SupabaseProvider } from "./SupabaseProvider";

export default function TodobeastApp() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

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
