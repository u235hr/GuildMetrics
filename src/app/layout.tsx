import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/adaptive-layout.css";
import AntdRegistry from '@/lib/AntdRegistry';
import AppProviders from "./AppProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "直播公会流水看板",
  description: "一个用于分析直播公会主播流水数据的仪表盘。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`${inter.className} viewport-container h-full overflow-hidden`}>
        <AntdRegistry>
          <AppProviders>
            <div className="adaptive-layout-root">
              {children}
            </div>
          </AppProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}