import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todobeast",
  description: "An app to actually do your todos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="nightwind">
      <head />
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
