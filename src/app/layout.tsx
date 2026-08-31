import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convo-Cortex",
  description: "Convo-Cortex is a powerful AI-powered platform that enables users to create and manage intelligent agents for various applications. With Convo-Cortex, you can easily build, deploy, and monitor AI agents that can interact with users, automate tasks, and provide valuable insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
    <TRPCReactProvider>
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
    </TRPCReactProvider>
    </NuqsAdapter>
  );
}
