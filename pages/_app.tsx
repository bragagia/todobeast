import "./global.css";

import { AppProps } from "next/app";

export default function AppGlobalStyleWrapper({
  Component,
  pageProps,
}: AppProps) {
  return <Component {...pageProps} />;
}
