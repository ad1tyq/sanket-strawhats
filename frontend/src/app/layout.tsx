import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ReportProvider } from "@/contexts/reportContext";
import { RiverLegendProvider } from "@/contexts/RiverLegendContext";
import { DiseaseLegendProvider } from "@/contexts/DiseaseLegendContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanket",
  description: "The signal that saves lives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <RiverLegendProvider>
            <DiseaseLegendProvider>
              <ReportProvider>

                {children}

              </ReportProvider>
            </DiseaseLegendProvider>
          </RiverLegendProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
