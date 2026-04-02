import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${brand.name} - Mechanic Services & Fleet Management`,
  description: brand.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <ThemeToggle />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
