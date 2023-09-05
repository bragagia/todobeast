import { StrictMode } from "react";
import { AppRouter } from "./AppRouter";
import { AuthProvider } from "./AuthProvider";
import NoSSR from "./utils/NoSSR";

export default function SPAApp() {
  return (
    <StrictMode>
      <NoSSR>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </NoSSR>
    </StrictMode>
  );
}
