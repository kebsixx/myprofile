import { TooltipProvider } from "@/components/ui/tooltip";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { AuthStubProvider } from "./components/auth/AuthStubProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "nvevam - Developer Portfolio",
  description:
    "Combination of Instagram and Telegram UI for showcasing my projects and contact info.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
        <AuthStubProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthStubProvider>
      </body>
    </html>
  );
}
