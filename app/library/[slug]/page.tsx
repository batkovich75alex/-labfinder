"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { articles, analyses } from "@/data/mock";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function ArticlePage({ params }: Props) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedAnalysis = analyses.find(
    (a) => a.id === article.relatedAnalysis
  );

  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const toc = [
    "Что такое холестерин",
    "Почему важно контролировать",
    "Как подготовиться к анализу",
    "Как расшифровать результат",
  ];

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Библиотека", href: "/library" },
            { label: article.category, href: "/library" },
            { label: article.title },
          ]}
        />

        {/* Назад */}
        <Link
          href="/library"
          className="mt-6 inline-flex items-center gap-1 text-sm text-[#1677FF] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Все статьи
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* ОСНОВНОЙ КОНТЕНТ */}
          <article>
            <h1 className="text-3xl font-bold text-[#101828] md:text-4xl">
              {article.title}
            </h1>

            {/* Мета */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#667085]">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readingTime}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Иван Петров, врач-терапевт
              </span>
            </div>

            {/* Теги */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {article.category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Расшифровка
              </Badge>
            </div>

            {/* Картинка */}
            <div className="mt-6 h-64 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#F2F4F7]" />

            {/* ОГЛАВЛЕНИЕ — mobile */}
            <div className="mt-6 rounded-xl border border-[#E4E7EC] bg-white p-4 lg:hidden">
              <div className="mb-2 text-sm font-semibold text-[#101828]">
                Оглавление
              </div>
              <ol className="space-y-2 text-sm">
                {toc.map((item, i) => (
                  <li key={item}>
                    <a
                      href={`#section-${i + 1}`}
                      className="flex gap-2 text-[#1677FF] hover:underline"
                    >
                      <span className="text-[#667085]">{i + 1}.</span>
                      {item}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* ТЕЛО СТАТЬИ */}
            <div className="mt-8 space-y-8 text-[#475467] leading-relaxed">
              <section id="section-1">
                <h2 className="text-xl font-semibold text-[#101828]">
                  1. Что такое холестерин
                </h2>
                <p className="mt-3">
                  Холестерин — это жироподобное вещество, которое необходимо
                  организму для построения клеточных мембран, синтеза
                  витамина D и выработки гормонов. Большая часть холестерина
                  производится печенью, меньшая — поступает с пищей.
                </p>
              </section>

              <section id="section-2">
                <h2 className="text-xl font-semibold text-[#101828]">
                  2. Почему важно контролировать
                </h2>
                <p className="mt-3">
                  Повышенный уровень холестерина — один из основных факторов
                  риска развития атеросклероза, инфаркта и инсульта. Регулярный
                  контроль позволяет вовремя заметить отклонения и принять
                  меры.
                </p>
              </section>

              <section id="section-3">
                <h2 className="text-xl font-semibold text-[#101828]">
                  3. Как подготовиться к анализу
                </h2>
                <p className="mt-3">
                  Кровь сдаётся натощак, минимум через 8–12 часов после
                  последнего приёма пищи. За сутки до анализа исключите
                  алкоголь и жирную пищу. Утром можно пить чистую воду.
                </p>
              </section>

              <section id="section-4">
                <h2 className="text-xl font-semibold text-[#101828]">
                  4. Как расшифровать результат
                </h2>
                <p className="mt-3">
                  Норма общего холестерина — до 5,2 ммоль/л. Показатели выше
                  требуют консультации врача. Только специалист может оценить
                  результат с учётом возраста, пола и других факторов.
                </p>
              </section>
            </div>

            {/* СВЯЗАННОЕ ИССЛЕДОВАНИЕ */}
            {relatedAnalysis && (
              <Card className="mt-10 border-[#E4E7EC] bg-[#EFF6FF]">
                <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs font-medium uppercase text-[#1677FF]">
                      Связанное исследование
                    </div>
                    <Link
                      href={`/catalog/${relatedAnalysis.slug}`}
                      className="mt-2 block text-lg font-semibold text-[#101828] hover:text-[#1677FF]"
                    >
                      {relatedAnalysis.name}
                    </Link>
                    <div className="mt-1 text-sm text-[#667085]">
                      от {relatedAnalysis.priceFrom} ₽ · {relatedAnalysis.duration}
                    </div>
                  </div>

                  <Link href={`/catalog/${relatedAnalysis.slug}`}>
                    <Button className="bg-[#1677FF] hover:bg-[#0969E8]">
                      Перейти к исследованию
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* ПОДЕЛИТЬСЯ */}
            <div className="mt-8 flex items-center gap-3 border-t border-[#E4E7EC] pt-6">
              <span className="text-sm text-[#667085]">Поделиться:</span>
              <button className="rounded-md p-2 text-[#667085] hover:bg-[#F2F4F7]">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* СВЯЗАННЫЕ СТАТЬИ */}
            {relatedArticles.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold text-[#101828]">
                  Читайте также
                </h2>
                <div className="mt-4 space-y-3">
                  {relatedArticles.map((a) => (
                    <Card key={a.id} className="border-[#E4E7EC]">
                      <CardContent className="p-4">
                        <Link href={`/library/${a.slug}`}>
                          <div className="font-medium text-[#101828] hover:text-[#1677FF]">
                            {a.title}
                          </div>
                          <div className="mt-1 text-xs text-[#667085]">
                            {a.date} · {a.readingTime}
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ПРАВЫЙ САЙДБАР — оглавление */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <Card className="border-[#E4E7EC]">
              <CardContent className="p-5">
                <div className="text-sm font-semibold text-[#101828]">
                  Оглавление
                </div>
                <ol className="mt-3 space-y-2 text-sm">
                  {toc.map((item, i) => (
                    <li key={item}>
                      <a
                        href={`#section-${i + 1}`}
                        className="flex gap-2 text-[#1677FF] hover:underline"
                      >
                        <span className="text-[#667085]">{i + 1}.</span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {relatedAnalysis && (
              <Card className="mt-4 border-[#E4E7EC]">
                <CardContent className="p-5">
                  <div className="text-xs font-medium uppercase text-[#1677FF]">
                    Связанное исследование
                  </div>
                  <div className="mt-2 font-semibold text-[#101828]">
                    {relatedAnalysis.name}
                  </div>
                  <div className="mt-1 text-sm text-[#667085]">
                    от {relatedAnalysis.priceFrom} ₽
                  </div>
                  <Link href={`/catalog/${relatedAnalysis.slug}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full border-[#1677FF] text-[#1677FF] hover:bg-[#EFF6FF]"
                    >
                      Перейти
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}