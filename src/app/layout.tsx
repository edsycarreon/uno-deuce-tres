import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { GlobalErrorModal } from "@/components/ui/error-modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poop Tracker",
  description: "Track your bathroom activities and compete with friends!",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Poop Tracker" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <ReactQueryProvider>
          <ErrorProvider>
            {children}
            <Toaster />
            <GlobalErrorModal />
          </ErrorProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
