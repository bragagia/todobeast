import { ReactNode } from "react";

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-center py-6 page-padding group page-container">
      {children}
    </div>
  );
}
