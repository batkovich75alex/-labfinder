"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowRight,
  ArrowLeft,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { articles, analyses } from "@/data/mock";

type Props = {
  params: Promise<{ slug: string }>;
};

type ArticleContent = {
  toc: string[];
  sections: { id: string; title: string; text: string }[];
};

// Содержимое каждой статьи
const articleContents: Record<string, ArticleContent> = {
  "chto-takoe-holesterol": {
    toc: [
      "Что такое холестерин",
      "Почему важно контролировать",
      "Как подготовиться к анализу",
      "Как расшифровать результат",
    ],
    sections: [
      {
        id: "section-1",
        title: "1. Что такое холестерин",
        text: "Холестерин — это жироподобное вещество, которое необходимо организму для построения клеточных мембран, синтеза витамина D и выработки гормонов. Большая часть холестерина производится печенью, меньшая — поступает с пищей.",
      },
      {
        id: "section-2",
        title: "2. Почему важно контролировать",
        text: "Повышенный уровень холестерина — один из основных факторов риска развития атеросклероза, инфаркта и инсульта. Регулярный контроль позволяет вовремя заметить отклонения и принять меры.",
      },
      {
        id: "section-3",
        title: "3. Как подготовиться к анализу",
        text: "Кровь сдаётся натощак, минимум через 8–12 часов после последнего приёма пищи. За сутки до анализа исключите алкоголь и жирную пищу. Утром можно пить чистую воду.",
      },
      {
        id: "section-4",
        title: "4. Как расшифровать результат",
        text: "Норма общего холестерина — до 5,2 ммоль/л. Показатели выше требуют консультации врача. Только специалист может оценить результат с учётом возраста, пола и других факторов.",
      },
    ],
  },
  "vitamin-d-zachem": {
    toc: [
      "Зачем нужен витамин D",
      "Кому особенно важно сдавать",
      "Как подготовиться к анализу",
      "Как читать результат",
    ],
    sections: [
      {
        id: "section-1",
        title: "1. Зачем нужен витамин D",
        text: "Витамин D участвует в усвоении кальция и фосфора, поддерживает здоровье костей, мышц и иммунной системы. Его дефицит широко распространён, особенно в регионах с малым количеством солнечных дней.",
      },
      {
        id: "section-2",
        title: "2. Кому особенно важно сдавать",
        text: "Анализ рекомендуется людям с хронической усталостью, частыми простудами, болями в мышцах и костях, а также тем, кто редко бывает на солнце, беременным и людям старше 50 лет.",
      },
      {
        id: "section-3",
        title: "3. Как подготовиться к анализу",
        text: "Специальная подготовка не требуется. Сдавать кровь лучше утром натощак. Если вы принимаете витамин D в виде добавок — сообщите об этом врачу.",
      },
      {
        id: "section-4",
        title: "4. Как читать результат",
        text: "Норма 25-OH витамина D — 30–100 нг/мл. Значения ниже 20 нг/мл говорят о дефиците, 20–30 — о недостаточности. Дозировку добавок подбирает врач.",
      },
    ],
  },
  "glyukoza-normy": {
    toc: [
      "Что показывает глюкоза",
      "Причины отклонений",
      "Подготовка к анализу",
      "Нормы и что делать",
    ],
    sections: [
      {
        id: "section-1",
        title: "1. Что показывает глюкоза",
        text: "Глюкоза — основной источник энергии для клеток. Её уровень в крови отражает состояние углеводного обмена и позволяет заподозрить сахарный диабет или преддиабет.",
      },
      {
        id: "section-2",
        title: "2. Причины отклонений",
        text: "Повышение глюкозы может быть связано с диабетом, стрессом, приёмом некоторых лекарств. Снижение — с голоданием, передозировкой инсулина, заболеваниями печени.",
      },
      {
        id: "section-3",
        title: "3. Подготовка к анализу",
        text: "Кровь сдаётся строго натощак, через 8–12 часов после последнего приёма пищи. Утром можно пить только воду. За сутки исключите алкоголь и сладкое.",
      },
      {
        id: "section-4",
        title: "4. Нормы и что делать",
        text: "Норма глюкозы натощак — 3,9–5,5 ммоль/л. Значения 5,6–6,9 — преддиабет. Выше 7,0 — повод обратиться к эндокринологу для подтверждения диагноза.",
      },
    ],
  },
};

const defaultContent: ArticleContent = {
  toc: ["О чём эта статья", "Основные сведения", "Практические советы"],
  sections: [
    {
      id: "section-1",
      title: "1. О чём эта статья",
      text: "Материал подготовлен врачами-специалистами и посвящён вопросам лабораторной диагностики.",
    },
    {
      id: "section-2",
      title: "2. Основные сведения",
      text: "Регулярное прохождение анализов помогает вовремя заметить изменения в организме и принять меры.",
    },
    {
      id: "section-3",
      title: "3. Практические советы",
      text: "Перед сдачей анализа уточните у врача особенности подготовки и перечень необходимых исследований.",
    },
  ],
};

export default function ArticlePage({ params }: Props) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);
  const [shareCopied, setShareCopied] = useState(false);

  if (!article) {
    notFound();
  }

  const content = articleContents[article.slug] || defaultContent;
  const relatedAnalysis = analyses.find(
    (a) => a.id === article.relatedAnalysis
  );

  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
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
            { label: "Библиотека", href: "/library" },
            { label: article.title },
          ]}
        />

        <Link
          href="/library"
          className="mt-6 inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Все статьи
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* ОСНОВНОЙ КОНТЕНТ */}
          <article className="article-copy min-w-0">
            <h1 className="type-h1 text-[#101828]">
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
            </div>

            {/* Картинка */}
            <div className="mt-6 h-64 rounded-xl bg-gradient-to-br from-[var(--primary-light)] to-[#F2F4F7]" />

            {/* ОГЛАВЛЕНИЕ — mobile */}
            <div className="mt-6 rounded-xl border border-[#E4E7EC] bg-white p-4 lg:hidden">
              <div className="mb-2 text-sm font-semibold text-[#101828]">
                Оглавление
              </div>
              <ol className="space-y-2 text-sm">
                {content.toc.map((item, i) => (
                  <li key={item}>
                    <a
                      href={`#section-${i + 1}`}
                      className="flex gap-2 text-[var(--primary)] hover:underline"
                    >
                      <span className="text-[#667085]">{i + 1}.</span>
                      {item}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* ТЕЛО СТАТЬИ */}
            <div className="mt-8 space-y-8 leading-relaxed text-[#475467]">
              {content.sections.map((s) => (
                <section key={s.id} id={s.id}>
                  <h2 className="type-h2 text-[#101828]">
                    {s.title}
                  </h2>
                  <p className="mt-3">{s.text}</p>
                </section>
              ))}
            </div>

            {/* СВЯЗАННОЕ ИССЛЕДОВАНИЕ */}
            {relatedAnalysis && (
              <Card className="mt-10 border-[#E4E7EC] bg-[var(--primary-light)]">
                <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs font-medium uppercase text-[var(--primary)]">
                      Связанное исследование
                    </div>
                    <Link
                      href={`/catalog/${relatedAnalysis.slug}`}
                      className="mt-2 block text-lg font-semibold text-[#101828] hover:text-[var(--primary)]"
                    >
                      {relatedAnalysis.name}
                    </Link>
                    <div className="mt-1 text-sm text-[#667085]">
                      от {relatedAnalysis.priceFrom} ₽ ·{" "}
                      {relatedAnalysis.duration}
                    </div>
                  </div>

                  <Link href={`/catalog/${relatedAnalysis.slug}`}>
                    <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
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
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-md border border-[#E4E7EC] px-3 py-2 text-sm text-[#475467] transition hover:bg-[#F2F4F7]"
              >
                {shareCopied ? (
                  <>
                    <Check className="h-4 w-4 text-[var(--success-text)]" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Скопировать ссылку
                  </>
                )}
              </button>
            </div>

            {/* СВЯЗАННЫЕ СТАТЬИ */}
            {relatedArticles.length > 0 && (
              <section className="mt-10">
                <h2 className="type-h2 text-[#101828]">
                  Читайте также
                </h2>
                <div className="mt-4 space-y-3">
                  {relatedArticles.map((a) => (
                    <Card key={a.id} className="border-[#E4E7EC]">
                      <CardContent className="p-4">
                        <Link href={`/library/${a.slug}`}>
                          <div className="font-medium text-[#101828] hover:text-[var(--primary)]">
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
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <Card className="border-[#E4E7EC]">
              <CardContent className="p-5">
                <div className="text-sm font-semibold text-[#101828]">
                  Оглавление
                </div>
                <ol className="mt-3 space-y-2 text-sm">
                  {content.toc.map((item, i) => (
                    <li key={item}>
                      <a
                        href={`#section-${i + 1}`}
                        className="flex gap-2 text-[var(--primary)] hover:underline"
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
                  <div className="text-xs font-medium uppercase text-[var(--primary)]">
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
                      className="mt-3 w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-light)]"
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
