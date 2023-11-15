import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DP Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-white">
          {/* Header */}
          <Header />

          <main className="isolate">
            {/* Hero section */}
            <div className="relative isolate -z-10 overflow-hidden bg-gradient-to-b min-h-screen from-indigo-100/20 dark:from-indigo-800/90 dark:to-indigo-900 pt-14">
              <div
                className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white dark:bg-indigo-900 shadow-xl shadow-indigo-600/10 dark:shadow-indigo-800/90 ring-1 ring-indigo-50 dark:ring-indigo-800 sm:-mr-80 md:-mr-96"
                aria-hidden="true"
              />

              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
