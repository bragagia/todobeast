import "./style.css";

import { StrictMode } from "react";
import { AppRouter } from "./AppRouter";
import { AuthProvider } from "./AuthProvider";

export default function SPAApp() {
  return (
    <AuthProvider>
      <StrictMode>
        <AppRouter />
      </StrictMode>
    </AuthProvider>
  );
}
