import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Droplet,
  Clock,
  Heart,
  ShoppingCart,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { complexes, analyses, labs } from "@/data/mock";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ComplexPage({ params }: Props) {
  const { slug } = await params;
  const complex = complexes.find((c) => c.slug === slug);

  if (!complex) {
    notFound();
  }

  const includedAnalyses = analyses.filter((a) =>
    complex.includes.includes(a.id)
  );

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Москва", href: "/?city=msk" },
            { label: "Чекапы и комплексы", href: "/complexes" },
            { label: "Сердечно-сосудистые", href: "/complexes" },
            { label: complex.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div>
            <h1 className="text-3xl font-bold text-[#101828]">
              {complex.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">Комплекс</Badge>
              <Badge variant="secondary" className="text-xs">Кардиология</Badge>
            </div>

            <p className="mt-4 text-[#475467]">{complex.short}</p>

            {/* МЕТА */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-[#E4E7EC] bg-white p-4 md:grid-cols-4">
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
                  <Droplet className="h-3 w-3 text-[#1677FF]" />
                  Биоматериал
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  Кровь + моча
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <Clock className="h-3 w-3 text-[#1677FF]" />
                  Срок
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {complex.duration}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <Heart className="h-3 w-3 text-[#1677FF]" />
                  Популярность
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  Популярный
                </div>
              </div>
            </div>

            {/* НАВИГАЦИЯ */}
            <div className="mt-8 overflow-x-auto border-b border-[#E4E7EC]">
              <div className="flex gap-6 whitespace-nowrap text-sm">
                {[
                  "О комплексе",
                  `Состав (${complex.analysesCount})`,
                  "Подготовка",
                  "Показания",
                  "Предложения лабораторий",
                ].map((tab, i) => (
                  <button
                    key={tab}
                    className={`pb-3 ${
                      i === 0
                        ? "border-b-2 border-[#1677FF] font-medium text-[#1677FF]"
                        : "text-[#667085] hover:text-[#101828]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* БЛОКИ */}
            <div className="mt-8 space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-[#101828]">О комплексе</h2>
                <p className="mt-3 text-[#475467]">
                  Комплексное обследование для оценки состояния
                  сердечно-сосудистой системы и выявления основных факторов
                  риска.
                </p>
              </section>

              {/* СОСТАВ КОМПЛЕКСА */}
              <section>
                <h2 className="text-xl font-semibold text-[#101828]">
                  Состав комплекса ({complex.analysesCount} исследований)
                </h2>
                <div className="mt-3 space-y-2">
                  {includedAnalyses.map((a, i) => (
                    <Card key={a.id} className="border-[#E4E7EC]">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F4F7] text-sm font-medium text-[#667085]">
                            {i + 1}
                          </div>
                          <Link
                            href={`/catalog/${a.slug}`}
                            className="font-medium text-[#101828] hover:text-[#1677FF]"
                          >
                            {a.name}
                          </Link>
                        </div>
                        <Badge variant="secondary" className="text-xs text-[#12B76A]">
                          Входит в комплекс
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* ПОДГОТОВКА */}
              <section>
                <h2 className="text-xl font-semibold text-[#101828]">Подготовка</h2>
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

              {/* ПРЕДЛОЖЕНИЯ */}
              <section>
                <h2 className="text-xl font-semibold text-[#101828]">
                  Предложения лабораторий
                </h2>
                <div className="mt-3 space-y-2">
                  {labs.slice(0, 3).map((lab) => (
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

                          <Button className="bg-[#1677FF] hover:bg-[#0969E8]">
                            В корзину
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* ПРАВАЯ — ЗАКРЕПЛЁННАЯ */}
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

                <Button className="mt-4 w-full bg-[#1677FF] hover:bg-[#0969E8]">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  В корзину
                </Button>

                <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-[#E4E7EC] py-2 text-sm text-[#475467] hover:bg-[#F2F4F7]">
                  <Heart className="h-4 w-4" />
                  В избранное
                </button>

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