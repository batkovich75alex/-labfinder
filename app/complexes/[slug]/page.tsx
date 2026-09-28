"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation";
import {
  Clock,
  Heart,
  ShoppingCart,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Share2,
  Check,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { complexes, analyses, labs } from "@/data/mock";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function ComplexPage({ params }: Props) {
  const { slug } = use(params);
  const complex = complexes.find((c) => c.slug === slug);
  const { toggleItem, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  const [shareCopied, setShareCopied] = useState(false);

  if (!complex) {
    notFound();
  }

  const inCart = isInCart(complex.id);
  const inFav = isFavorite(complex.id);

  // Все анализы, входящие в комплекс
  const includedAnalyses = analyses.filter((a) =>
    complex.includes.includes(a.id)
  );

  const handleToggle = () => {
    toggleItem({
      id: complex.id,
      slug: complex.slug,
      type: "complex",
      name: complex.name,
      price: complex.priceFrom,
      duration: complex.duration,
    });
  };

  const handleSelectLab = () => {
    if (!inCart) {
      toggleItem({
        id: complex.id,
        slug: complex.slug,
        type: "complex",
        name: complex.name,
        price: complex.priceFrom,
        duration: complex.duration,
      });
    }
    router.push("/cart");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: complex.name,
          text: complex.short,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (e) {}
  };

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Москва", href: "/?city=msk" },
            { label: "Чекапы и комплексы", href: "/complexes" },
            { label: complex.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <h1 className="text-2xl font-bold text-[#101828] md:text-3xl">
              {complex.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Комплекс
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {complex.analysesCount} исследований
              </Badge>
            </div>

            <p className="mt-4 text-[#475467]">{complex.short}</p>

            {/* МЕТА */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-[#E4E7EC] bg-white p-4 md:grid-cols-3">
              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <CheckCircle2 className="h-3 w-3 text-[#1677FF]" />
                  Исследований
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {complex.analysesCount}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <Clock className="h-3 w-3 text-[#1677FF]" />
                  Срок готовности
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {complex.duration}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <AlertCircle className="h-3 w-3 text-[#1677FF]" />
                  Подготовка
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  8–12 часов
                </div>
              </div>
            </div>

            {/* О КОМПЛЕКСЕ */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-[#101828]">
                О комплексе
              </h2>
              <p className="mt-3 text-[#475467]">
                {complex.name} — комплексное обследование для оценки состояния
                организма и выявления ключевых отклонений. Включает{" "}
                {includedAnalyses.length} исследований, которые помогают врачу
                составить полную картину.
              </p>
            </section>

            {/* СОСТАВ */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-[#101828]">
                Состав комплекса ({includedAnalyses.length} исследований)
              </h2>

              <div className="mt-3 space-y-2">
                {includedAnalyses.map((a, i) => (
                  <Card key={a.id} className="border-[#E4E7EC]">
                    <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-sm font-medium text-[#667085]">
                          {i + 1}
                        </div>
                        <Link
                          href={`/catalog/${a.slug}`}
                          className="font-medium text-[#101828] hover:text-[#1677FF]"
                        >
                          {a.name}
                        </Link>
                      </div>
                      <Badge
                        variant="secondary"
                        className="self-start text-xs text-[#12B76A] md:self-center"
                      >
                        Входит в комплекс
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* ПОДГОТОВКА */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-[#101828]">
                Подготовка
              </h2>
              <ul className="mt-3 space-y-2 text-[#475467]">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#12B76A]" />
                  Кровь сдаётся натощак (8–12 часов голода).
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#12B76A]" />
                  За сутки исключить алкоголь и жирную пищу.
                </li>
              </ul>
            </section>

            {/* ПРЕДЛОЖЕНИЯ ЛАБОРАТОРИЙ */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-[#101828]">
                Предложения лабораторий
              </h2>

              <div className="mt-3 space-y-2">
                {labs.map((lab) => (
                  <Card key={lab.id} className="border-[#E4E7EC]">
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF] text-xl font-bold text-[#1677FF]">
                          {lab.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-[#101828]">
                            {lab.name}
                          </div>
                          <div className="text-xs text-[#667085]">
                            ★ {lab.rating} · {lab.reviews} отзывов
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#101828]">
                            {complex.priceFrom} ₽
                          </div>
                          <div className="text-xs text-[#667085]">
                            +300 ₽ взятие
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className={
                            inCart
                              ? "bg-[#12B76A] hover:bg-[#0E9B58]"
                              : "bg-[#1677FF] hover:bg-[#0969E8]"
                          }
                          onClick={handleSelectLab}
                        >
                          {inCart ? "В корзине" : "Выбрать"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Link
                href="/labs"
                className="mt-4 inline-flex items-center gap-1 text-sm text-[#1677FF] hover:underline"
              >
                Все лаборатории <ChevronRight className="h-4 w-4" />
              </Link>
            </section>
          </div>

          {/* ЗАКРЕПЛЁННАЯ КАРТОЧКА СПРАВА */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-[#E4E7EC]">
              <CardContent className="p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-[#667085]">от</span>
                  <span className="text-3xl font-bold text-[#101828]">
                    {complex.priceFrom} ₽
                  </span>
                </div>
                <div className="mt-1 text-xs text-[#667085]">
                  Стоимость комплекса
                </div>

                <Button
                  onClick={handleToggle}
                  className={`mt-4 w-full ${
                    inCart
                      ? "bg-[#12B76A] hover:bg-[#0E9B58]"
                      : "bg-[#1677FF] hover:bg-[#0969E8]"
                  }`}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {inCart ? "В корзине" : "В корзину"}
                </Button>

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(complex.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md border py-2 text-sm transition ${
                      inFav
                        ? "border-[#F04438] bg-[#FEF3F2] text-[#F04438]"
                        : "border-[#E4E7EC] text-[#475467] hover:bg-[#F2F4F7]"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${inFav ? "fill-[#F04438]" : ""}`}
                    />
                    {inFav ? "В избранном" : "В избранное"}
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[#E4E7EC] py-2 text-sm text-[#475467] transition hover:bg-[#F2F4F7]"
                  >
                    {shareCopied ? (
                      <>
                        <Check className="h-4 w-4 text-[#12B76A]" />
                        Скопировано
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        Поделиться
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#E4E7EC] pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Взятие биоматериала</span>
                    <span className="font-medium text-[#101828]">+300 ₽</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E4E7EC] pt-2">
                    <span className="text-[#667085]">Итого</span>
                    <span className="font-semibold text-[#101828]">
                      от {complex.priceFrom + 300} ₽
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-[#667085]">
                  Цены в Москве, актуальны на 27.09.2026
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}