import type { Metadata } from "next";
import Script from "next/script";
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
      <body suppressHydrationWarning>
        <Script id="disable-splash-screen-android">
          {`
          document.addEventListener("DOMContentLoaded", () => {
            document
              .querySelector("#splash")
              .addEventListener("transitionend", (event) => {
                event.target.remove();
              });
            requestAnimationFrame(() => {
              document.querySelector("#splash").classList.add("animate");
            });
          });
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
