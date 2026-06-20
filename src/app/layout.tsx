import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Startup Simulation | IT起業シミュレーション",
  description: "ITスタートアップの創業者となり、リソースを管理し、オフィスを拡張し、競合からシェアを奪い取って市場1位を目指す経営シミュレーションゲーム。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
