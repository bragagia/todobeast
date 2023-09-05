"use client";

import dynamic from "next/dynamic";

const SPAApp = dynamic(
  () => import("../../../spa/App"),
  { ssr: false } // This line will disable server-side rendering for this component
);

export default function SPAPage() {
  return <SPAApp />;
}
