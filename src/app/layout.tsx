import ThemeClient from "@/@components/common/ThemeClient";
import Topbar from "@/@components/common/Topbar";
import { ReduxProvider } from "@/@store/ReduxProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo Pro App",
  description: "A modern task manager built with Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {/* PWA manifest link */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <ReduxProvider>
          <ThemeClient />
          <Topbar />
          {/* <MSWLoader /> */}
          <ToastContainer position="top-right" theme="dark" autoClose={2500} />
          <Suspense fallback={<div className="p-6">Loading…</div>}>
            {children}
          </Suspense>
        </ReduxProvider>
        {/* Minimal SW registration; ensure a service worker is present if needed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}`,
          }}
        />
      </body>
    </html>
  );
}
