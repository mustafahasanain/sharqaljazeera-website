import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sharq Aljazeera Co.",
  description:
    " Leading telecommunications company in Iraq since 2003. Expert in networking equipment, wireless solutions services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
