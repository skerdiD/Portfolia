import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolia",
    template: "%s | Portfolia",
  },
  description:
    "Portfolia is an AI proposal operating system for freelancers and agencies to generate polished client proposals, faster.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.E2E_TEST_MODE === "1") {
    return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            inter.variable,
            manrope.variable,
            "min-h-screen bg-background font-body text-foreground antialiased",
          )}
        >
          {children}
        </body>
      </html>
    );
  }

  const { ClerkProvider } = await import("@clerk/nextjs");

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signInForceRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            inter.variable,
            manrope.variable,
            "min-h-screen bg-background font-body text-foreground antialiased",
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
