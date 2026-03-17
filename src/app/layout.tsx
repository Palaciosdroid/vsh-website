import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VSH — Verband Schweizer Hypnosetherapeuten",
    template: "%s | VSH",
  },
  description:
    "Finden Sie qualifizierte Hypnosetherapeuten in der Schweiz. Der Verband Schweizer Hypnosetherapeuten (VSH) — Ihr Verzeichnis für professionelle Hypnosetherapie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
