import { ReactNode } from "react";

export function PageContent({ children }: { children: ReactNode }) {
  return <div className="overflow-scroll h-full">{children}</div>;
}
