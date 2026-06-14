import { ReactNode } from "react";
import type { Metadata } from "next";
import { Noto_Sans, Oxanium } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import ConvexClientProvider from "@/components/ConvexProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const oxaniumHeading = Oxanium({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: "Summon",
  description: "An AI agent building SaaS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", notoSans.variable, oxaniumHeading.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ClerkProvider>
              <ConvexClientProvider>
                {children}
              </ConvexClientProvider>
            </ClerkProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
