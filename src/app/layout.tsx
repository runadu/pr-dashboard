import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { getThemeInitScript } from "@/lib/theme";
import ReduxProvider from "./providers";

export const metadata: Metadata = {
  title: "PR Dashboard",
  description: "跨 Repo GitHub Pull Request 管理介面",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{getThemeInitScript()}</Script>
      </head>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
