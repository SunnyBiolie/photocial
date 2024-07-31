import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AccountProvider } from "@/components/providers/account-provider";
import { Toaster } from "sonner";

const openSans = Open_Sans({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Photocial",
  description: "A social networking site for posting photos and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={openSans.className}>
          <AccountProvider>
            <Toaster richColors position="bottom-right" closeButton />
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AccountProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
