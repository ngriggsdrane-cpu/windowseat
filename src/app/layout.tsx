import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800", "900"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WindowSeat — Take the long way. On purpose.",
  description:
    "Scenic Route for rideshare, walking and biking: short detours past the landmarks worth seeing, priced upfront and narrated as you pass.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${display.variable} ${body.variable} font-body antialiased bg-cream text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
