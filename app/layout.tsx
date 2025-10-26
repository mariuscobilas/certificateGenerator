import type { Metadata } from "next";
import "../app/globals.css";
import {inter, roboto, montserrat, greatVibes, playfairDisplay} from "@/app/utils/fonts";



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
        className={`${inter.variable}, ${roboto.variable}, ${montserrat.variable}, ${playfairDisplay.variable}, ${greatVibes.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
