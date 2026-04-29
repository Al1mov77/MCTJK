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
  description: "Experience luxury stay across Tajikistan with VIP rewards. Book premium hotels, enjoy concierge services, and elevate your travel experience.",
  keywords: ["MCTJK", "hotel booking", "luxury travel", "Tajikistan hotels", "VIP concierge", "premium resorts"],
  authors: [{ name: "MCTJK" }],
  openGraph: {
    title: "MCTJK | Luxury Hotel Bookings",
    description: "Book premium hotels across Tajikistan and enjoy exclusive VIP perks.",
    url: "https://mctjk-frontend.vercel.app",
    siteName: "MCTJK",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "MCTJK Premium Hotels",
      },
    ],
    locale: "en_US",
    type: "website",
  },
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
