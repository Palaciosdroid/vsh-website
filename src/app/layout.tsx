import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://v-s-h.ch"),
  title: {
    default: "VSH — Verband Schweizer Hypnosetherapeuten",
    template: "%s | VSH",
  },
  description:
    "Finden Sie qualifizierte Hypnosetherapeuten in der Schweiz. Der Verband Schweizer Hypnosetherapeuten (VSH) — Ihr Verzeichnis für professionelle Hypnosetherapie.",
  keywords: [
    "Hypnosetherapie",
    "Hypnose",
    "Therapeut",
    "Schweiz",
    "VSH",
    "Verband Schweizer Hypnosetherapeuten",
    "Hypnosetherapeut finden",
    "Raucherentwöhnung",
    "Angsttherapie",
  ],
  authors: [{ name: "VSH — Verband Schweizer Hypnosetherapeuten" }],
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "VSH — Verband Schweizer Hypnosetherapeuten",
    title: "VSH — Verband Schweizer Hypnosetherapeuten",
    description:
      "Finden Sie qualifizierte Hypnosetherapeuten in der Schweiz. Ihr Verzeichnis für professionelle Hypnosetherapie.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
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
