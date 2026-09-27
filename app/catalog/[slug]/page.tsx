import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Droplet,
  Clock,
  FlaskConical,
  Hash,
  Heart,
  ShoppingCart,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { analyses, labs, articles } from "@/data/mock";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AnalysisPage({ params }: Props) {
  const { slug } = await params;
  const analysis = analyses.find((a) => a.slug === slug);

  if (!analysis) {
    notFound();
  }

  const relatedArticle = articles.find((a) => a.relatedAnalysis === analysis.id);

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Москва", href: "/?city=msk" },
            { label: "Анализы", href: "/catalog" },
            { label: analysis.categoryName, href: `/catalog/${analysis.category}` },
            { label: analysis.name },
          ]}
        />

        {/* ПЕРВЫЙ ЭКРАН */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div>
            <h1 className="text-3xl font-bold text-[#101828]">
              {analysis.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">Анализ</Badge>
              <Badge variant="secondary" className="text-xs">{analysis.categoryName}</Badge>
            </div>

            <p className="mt-4 text-[#475467]">{analysis.short}</p>

            {/* МЕТА */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-[#E4E7EC] bg-white p-4 md:grid-cols-5">
              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <Droplet className="h-3 w-3 text-[#1677FF]" />
                  Биоматериал
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {analysis.biomaterial}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <Clock className="h-3 w-3 text-[#1677FF]" />
                  Срок готовности
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {analysis.duration}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <FlaskConical className="h-3 w-3 text-[#1677FF]" />
                  Метод
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {analysis.method || "—"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <Hash className="h-3 w-3 text-[#1677FF]" />
                  Код
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {analysis.code || "—"}
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

            {/* СИНОНИМЫ + СТАТЬЯ */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="text-[#667085]">
                <span className="font-medium text-[#101828]">Синонимы:</span>{" "}
                {analysis.synonyms || "—"}
              </div>

              {relatedArticle && (
                <div className="text-[#667085]">
                  <span className="font-medium text-[#101828]">Связанная статья:</span>{" "}
                  <Link
                    href={`/library/${relatedArticle.slug}`}
                    className="text-[#1677FF] hover:underline"
                  >
                    {relatedArticle.title} →
                  </Link>
                </div>
              )}
            </div>

            {/* НАВИГАЦИЯ ПО РАЗДЕЛАМ */}
            <div className="mt-8 overflow-x-auto border-b border-[#E4E7EC]">
              <div className="flex gap-6 whitespace-nowrap text-sm">
                {[
                  "Коротко об анализе",
                  "Подготовка",
                  "Показания",
                  "Как читать результаты",
                  "Что важно сообщить врачу",
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
              {/* Коротко об анализе */}
              <section>
                <h2 className="text-xl font-semibold text-[#101828]">
                  Коротко об анализе
                </h2>
                <p className="mt-3 text-[#475467]">
                  {analysis.name} — это показатель, который помогает оценить
                  состояние организма и выявить отклонения. Исследование
                  проводится для диагностики и контроля лечения.
                </p>
              </section>

              {/* Подготовка */}
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
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#12B76A]" />
                    Утром можно пить воду.
                  </li>
                </ul>
              </section>

              {/* Показания */}
              <section>
                <h2 className="text-xl font-semibold text-[#101828]">Показания</h2>
                <ul className="mt-3 space-y-2 text-[#475467]">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#12B76A]" />
                    Профилактические осмотры.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#12B76A]" />
                    Оценка сердечно-сосудистых рисков.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#12B76A]" />
                    Контроль лечения.
                  </li>
                </ul>
              </section>

              {/* Как читать результаты */}
              <section>
                <h2 className="text-xl font-semibold text-[#101828]">
                  Как читать результаты
                </h2>
                <p className="mt-3 text-[#475467]">
                  Результаты оценивает врач с учётом вашего возраста, пола,
                  симптомов и других показателей.
                </p>
              </section>

              {/* Что важно сообщить врачу */}
              <section>
                <h2 className="text-xl font-semibold text-[#101828]">
                  Что важно сообщить врачу
                </h2>
                <ul className="mt-3 space-y-2 text-[#475467]">
                  <li className="flex gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#F79009]" />
                    Приём лекарственных препаратов.
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#F79009]" />
                    Наличие хронических заболеваний.
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#F79009]" />
                    Беременность и период грудного вскармливания.
                  </li>
                </ul>
              </section>

              {/* Предложения лабораторий */}
              <section>
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
                              ★ {lab.rating} · {lab.reviews} отзывов ·{" "}
                              {lab.cities}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#101828]">
                              {analysis.priceFrom} ₽
                            </div>
                            <div className="text-xs text-[#667085]">
                              +250 ₽ взятие
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

                <Link
                  href="/labs"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-[#1677FF] hover:underline"
                >
                  Все лаборатории <ChevronRight className="h-4 w-4" />
                </Link>
              </section>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ — ЗАКРЕПЛЁННАЯ КАРТОЧКА */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-[#E4E7EC]">
              <CardContent className="p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-[#667085]">от</span>
                  <span className="text-3xl font-bold text-[#101828]">
                    {analysis.priceFrom} ₽
                  </span>
                </div>
                <div className="mt-1 text-xs text-[#667085]">
                  Стоимость исследования
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
                    <span className="font-medium text-[#101828]">+250 ₽</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E4E7EC] pt-2">
                    <span className="text-[#667085]">Итого</span>
                    <span className="font-semibold text-[#101828]">
                      от {analysis.priceFrom + 250} ₽
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-[#667085]">
                  Цены в Москве, актуальны на 27.09.2026
                </div>

                {relatedArticle && (
                  <Link
                    href={`/library/${relatedArticle.slug}`}
                    className="mt-4 flex items-center gap-1 text-sm text-[#1677FF] hover:underline"
                  >
                    Связанная статья <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}