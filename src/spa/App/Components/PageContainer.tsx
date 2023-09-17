import { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {children}
    </div>
  );
}
