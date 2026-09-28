import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://labfinder-batkovich.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LabFinder — агрегатор медицинских анализов",
    template: "%s | LabFinder",
  },
  description:
    "Поиск анализов и медицинских комплексов, сравнение цен в лабораториях, выбор места сдачи. Актуальные предложения — ГЕМОТЕСТ, ИНВИТРО, KDL, CMD.",
  keywords: [
    "анализы",
    "медицинские анализы",
    "лаборатория",
    "сдать анализы",
    "сравнение цен",
    "комплексы анализов",
    "чекап",
    "кровь на анализ",
  ],
  authors: [{ name: "LabFinder" }],
  creator: "LabFinder",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "LabFinder",
    title: "LabFinder — агрегатор медицинских анализов",
    description:
      "Найдите анализы, сравните цены в лабораториях и выберите место сдачи.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LabFinder — агрегатор медицинских анализов",
    description:
      "Найдите анализы, сравните цены в лабораториях и выберите место сдачи.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#F8FAFC]`}>
        <CartProvider>
          <FavoritesProvider>
            <Header />
            {children}
            <Footer />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}