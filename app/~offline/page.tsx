"use client";

import { redirect, usePathname } from "next/navigation";

export default function OfflinePage() {
  const pathname = usePathname();

  if (pathname !== "/a") {
    redirect("/a");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen v-screen text-center gap-2">
      <p>You are offline and Todobeast app isn't available in your cache.</p>

      {/* Use a instead of Link because next-pwa does support it on offline page */}
      <a href="/a/planner" className="text-blue-500 underline">
        Click here to reload.
      </a>
    </div>
  );
}
