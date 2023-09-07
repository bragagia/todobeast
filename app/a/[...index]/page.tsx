"use client";

import dynamic from "next/dynamic";

const TodobeastApp = dynamic(() => import("../../../src/spa/App"), {
  ssr: false,
});

export default function TodobeastPage() {
  return <TodobeastApp />;
}
