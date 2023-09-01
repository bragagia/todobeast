import { ReactNode } from "react";

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-center h-28">
      {children}
    </div>
  );
}
