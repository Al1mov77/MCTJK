import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import VipAssistant from "../components/VipAssistant";
import { LanguageProvider } from '../lib/LanguageContext';
import { ThemeProvider } from '../lib/ThemeContext';
import { Providers } from "../components/Providers";

const outfit = Outfit({
  variable: "--font-outfit",
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

export const metadata: Metadata = {
  title: "MCTJK | Premium Hotel Booking",
  description: "Experience luxury stay across Tajikistan with VIP rewards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider>
          <ThemeProvider>
            <Providers>
              {children}
              <VipAssistant />
            </Providers>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
