import type { Metadata } from "next";
import { ReactNode } from "react";
import { Noto_Sans, Oxanium } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "@/components/ConvexProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const oxaniumHeading = Oxanium({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: "Summon",
  description: "An AI agent building tool for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", notoSans.variable, oxaniumHeading.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
