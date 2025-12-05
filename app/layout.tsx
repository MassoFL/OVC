import type { Metadata } from "next";
import { Open_Sans, Inter } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OCV Partenor - Veille Concurrentielle",
  description: "Plateforme de veille concurrentielle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${openSans.variable} ${inter.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-open-sans), var(--font-inter), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
