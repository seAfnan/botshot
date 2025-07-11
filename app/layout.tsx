import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DarkModeContext from "./Providers/ThemeContext";
import { Inter } from "next/font/google";
import AuthProvider from "./auth/Provider";

const inter = Inter({
  subsets: ["latin"],
  // display: "swap",
  variable: "--font-inter",
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
  title: "Botshot",
  description: "Build for Cloneathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DarkModeContext>
          <AuthProvider>{children}</AuthProvider>
        </DarkModeContext>
      </body>
    </html>
  );
}
