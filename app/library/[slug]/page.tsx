"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { getArticleImage } from "@/lib/images";

type Props = {
  params: Promise<{ slug: string }>;
};

type ArticleContent = {
  toc: string[];
  sections: { id: string; title: string; text: string }[];
  sources: { title: string; url: string }[];
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
        text: "Высокий уровень холестерина часто не вызывает симптомов. Липидный профиль помогает оценить общий холестерин, ЛПНП, ЛПВП и триглицериды, но результат рассматривают вместе с возрастом, семейной историей и другими факторами сердечно-сосудистого риска.",
      },
      {
        id: "section-3",
        title: "3. Как подготовиться к анализу",
        text: "Для некоторых вариантов липидного профиля может потребоваться 8–12 часов без еды. Требования зависят от назначения и лаборатории, поэтому заранее уточните подготовку у врача или в выбранной лаборатории.",
      },
      {
        id: "section-4",
        title: "4. Как расшифровать результат",
        text: "Один показатель общего холестерина не определяет диагноз и тактику лечения. Врач оценивает весь липидный профиль и общий риск. Используйте референсные интервалы из своего бланка и не меняйте лечение самостоятельно.",
      },
    ],
    sources: [
      { title: "CDC: Testing for Cholesterol", url: "https://www.cdc.gov/cholesterol/testing/index.html" },
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
        text: "Витамин D участвует в обмене кальция и фосфора и важен для здоровья костей. Для оценки статуса обычно измеряют 25-гидроксивитамин D — 25(OH)D.",
      },
      {
        id: "section-2",
        title: "2. Кому особенно важно сдавать",
        text: "Не всем здоровым людям нужен плановый анализ на витамин D. Решение о тестировании лучше принимать с врачом с учетом симптомов, питания, заболеваний, лекарств и индивидуальных факторов риска.",
      },
      {
        id: "section-3",
        title: "3. Как подготовиться к анализу",
        text: "Требования к подготовке могут различаться. Сообщите врачу и лаборатории о добавках и лекарствах, а перед сдачей следуйте инструкции выбранной лаборатории.",
      },
      {
        id: "section-4",
        title: "4. Как читать результат",
        text: "Пороговые значения различаются между рекомендациями и методами измерения. NIH указывает, что уровень 25(OH)D 20 нг/мл и выше достаточен для большинства людей, а риск дефицита возрастает ниже 12 нг/мл. Интерпретируйте результат по референсам лаборатории вместе с врачом.",
      },
    ],
    sources: [
      { title: "NIH ODS: Vitamin D — Fact Sheet for Health Professionals", url: "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/" },
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
        text: "На результат могут влиять прием пищи, стресс, острое заболевание и некоторые лекарства. Отклонение одного показателя само по себе не объясняет причину и требует оценки в контексте состояния человека.",
      },
      {
        id: "section-3",
        title: "3. Подготовка к анализу",
        text: "Для глюкозы плазмы натощак NIDDK указывает минимум 8 часов без еды; допускаются небольшие глотки воды. Для других тестов, например HbA1c, голодание не требуется. Выполняйте именно ту подготовку, которую указал врач или лаборатория.",
      },
      {
        id: "section-4",
        title: "4. Нормы и что делать",
        text: "Диагноз диабета не ставят по домашнему глюкометру или одному случайному результату. При отсутствии явных симптомов отклонение обычно подтверждают повторным лабораторным тестом. Обсудите результат и референсный интервал своего бланка с врачом.",
      },
    ],
    sources: [
      { title: "NIDDK: Diabetes Tests & Diagnosis", url: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis" },
    ],
  },
};

const defaultContent: ArticleContent = {
  toc: ["О чём эта статья", "Основные сведения", "Практические советы"],
  sections: [
    {
      id: "section-1",
      title: "1. О чём эта статья",
      text: "Это справочный материал редакции LabFinder о лабораторной диагностике.",
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
  sources: [],
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
                Редакция LabFinder
              </span>
            </div>

            <div className="mt-5 rounded-lg border border-[#FEDF89] bg-[#FFFAEB] px-4 py-3 text-sm text-[#93370D]">
              Материал носит справочный характер и не заменяет консультацию врача.
              Медицинские сведения проверены 28.09.2026.
            </div>

            {/* Теги */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {article.category}
              </Badge>
            </div>

            {/* Картинка */}
            <div className="relative mt-6 h-64 overflow-hidden rounded-xl bg-[#E4E7EC]">
              <Image src={getArticleImage(article.id)} alt="" fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
            </div>

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

            {content.sources.length > 0 && (
              <section className="mt-10 rounded-xl border border-[#E4E7EC] bg-white p-5">
                <h2 className="type-h2 text-[#101828]">Источники</h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Официальные материалы, использованные для проверки медицинских формулировок.
                </p>
                <ul className="mt-4 space-y-2">
                  {content.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-sm font-medium text-[var(--primary)] hover:underline">
                        {source.title}
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

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
