import type { Metadata } from "next";
import { Fraunces, Archivo, JetBrains_Mono } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import HeaderBar from "@/components/header-bar";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mtb — Boutique Cinema Booking",
  description: "Browse what's playing, hold your seats, and walk in with the ticket in hand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${archivo.variable} ${jetbrainsMono.variable} antialiased`}>
        <Providers>
          <div className="flex justify-center items-center">
            <div className="w-full">
              <HeaderBar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
