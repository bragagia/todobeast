import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

export const metadata: Metadata = {
  title: "Todobeast",
  description: "Just do your todos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="nightwind">
      <head>
        <meta name="application-name" content="Todobeast" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Todobeast" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="icon" href="/favicon.ico" />

        <link rel="manifest" href="/manifest.json" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />

        <meta name="msapplication-TileColor" content="#b91d47" />

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
      </head>

      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
