import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/globals.css";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Certificate Generator",
  description: "Created and managed by @mariuscobilas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
