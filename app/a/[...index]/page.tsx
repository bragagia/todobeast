"use client";

import dynamic from "next/dynamic";

const SPAApp = dynamic(() => import("../../../spa/App"), { ssr: false });

export default function SPAPage() {
  return <SPAApp />;
}
