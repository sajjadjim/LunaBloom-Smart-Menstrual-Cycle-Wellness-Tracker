import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LunaBloom — Smart Menstrual Cycle & Women's Wellness Tracker",
  description:
    "Your Cycle, Your Comfort, Your Confidence. A soft, privacy-first menstrual cycle tracking and holistic women's wellness application with smart predictions and gentle email reminders.",
  keywords: [
    "period tracker",
    "menstrual cycle calculator",
    "women wellness",
    "cycle prediction",
    "period reminder",
    "ovulation estimate",
    "LunaBloom",
  ],
  authors: [{ name: "LunaBloom Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${dmSans.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans bg-luna-gradient selection:bg-pink-300 selection:text-pink-950">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
