"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search as SearchIcon,
  X,
  Droplet,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { analyses, complexes, articles } from "@/data/mock";

type Tab = "all" | "analyses" | "complexes" | "articles";

export default function SearchPage() {
  const [query, setQuery] = useState("холес");
  const [activeTab, setActiveTab] = useState<Tab>("all");

  // Ищем во всех данных (регистронезависимо)
  const q = query.toLowerCase().trim();

  const foundAnalyses = q
    ? analyses.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.short.toLowerCase().includes(q) ||
          (a.synonyms && a.synonyms.toLowerCase().includes(q))
      )
    : [];

  const foundComplexes = q
    ? complexes.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.short.toLowerCase().includes(q)
      )
    : [];

  const foundArticles = q
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
      )
    : [];

  const total = foundAnalyses.length + foundComplexes.length + foundArticles.length;
  const isEmpty = q && total === 0;
  const isIdle = !q;

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Поиск" },
          ]}
        />

        {/* Поисковая строка */}
        <div className="mt-6 max-w-2xl">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найдите анализ, комплекс или статью"
              className="h-12 pl-9 pr-10 text-base"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Заголовок + табы */}
        {!isIdle && (
          <>
            <h1 className="mt-6 text-2xl font-bold text-[#101828]">
              Результаты поиска: «{query}»
            </h1>

            {/* ТАБЫ-СЧЁТЧИКИ */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeTab === "all"
                    ? "bg-[#1677FF] text-white"
                    : "border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#1677FF]"
                }`}
              >
                Все {total}
              </button>
              <button
                onClick={() => setActiveTab("analyses")}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeTab === "analyses"
                    ? "bg-[#1677FF] text-white"
                    : "border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#1677FF]"
                }`}
              >
                Анализы {foundAnalyses.length}
              </button>
              <button
                onClick={() => setActiveTab("complexes")}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeTab === "complexes"
                    ? "bg-[#1677FF] text-white"
                    : "border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#1677FF]"
                }`}
              >
                Комплексы {foundComplexes.length}
              </button>
              <button
                onClick={() => setActiveTab("articles")}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeTab === "articles"
                    ? "bg-[#1677FF] text-white"
                    : "border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#1677FF]"
                }`}
              >
                Статьи {foundArticles.length}
              </button>
            </div>
          </>
        )}

        {/* ПУСТАЯ ВЫДАЧА */}
        {isEmpty && (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFF6FF]">
              <SearchIcon className="h-10 w-10 text-[#1677FF]" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-[#101828]">
              Ничего не найдено
            </h2>
            <p className="mt-2 max-w-md text-[#667085]">
              Попробуйте изменить запрос или использовать другие ключевые слова.
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setQuery("")}
              >
                Очистить запрос
              </Button>
              <Link href="/catalog">
                <Button className="bg-[#1677FF] hover:bg-[#0969E8]">
                  Перейти в каталог
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-[#667085]">
              <div className="mb-2 font-medium text-[#101828]">
                Популярные запросы:
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {["Общий анализ крови", "ТТГ", "Ферритин", "Витамин D"].map(
                  (q) => (
                    <button
                      key={q}
                      onClick={() => setQuery(q)}
                      className="rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 text-sm hover:border-[#1677FF] hover:text-[#1677FF]"
                    >
                      {q}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* РЕЗУЛЬТАТЫ */}
        {!isIdle && !isEmpty && (
          <div className="mt-8 space-y-10">
            {/* АНАЛИЗЫ */}
            {(activeTab === "all" || activeTab === "analyses") &&
              foundAnalyses.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101828]">
                      Анализы
                    </h2>
                    <button
                      onClick={() => setActiveTab("analyses")}
                      className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline"
                    >
                      Показать все ({foundAnalyses.length})
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {foundAnalyses.map((a) => (
                      <Card
                        key={a.id}
                        className="border-[#E4E7EC] transition hover:shadow-md"
                      >
                        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-[#EFF6FF]" />
                            <div>
                              <Link
                                href={`/catalog/${a.slug}`}
                                className="font-medium text-[#101828] hover:text-[#1677FF]"
                              >
                                {a.name}
                              </Link>
                              <div className="mt-1 flex gap-3 text-xs text-[#667085]">
                                <span className="flex items-center gap-1">
                                  <Droplet className="h-3 w-3 text-[#1677FF]" />
                                  {a.biomaterial}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-[#1677FF]" />
                                  {a.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-[#667085]">от </span>
                            <span className="text-lg font-bold text-[#101828]">
                              {a.priceFrom} ₽
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

            {/* КОМПЛЕКСЫ */}
            {(activeTab === "all" || activeTab === "complexes") &&
              foundComplexes.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101828]">
                      Комплексы
                    </h2>
                    <button
                      onClick={() => setActiveTab("complexes")}
                      className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline"
                    >
                      Показать все ({foundComplexes.length})
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {foundComplexes.map((c) => (
                      <Card
                        key={c.id}
                        className="border-[#E4E7EC] transition hover:shadow-md"
                      >
                        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-[#EFF6FF]" />
                            <div>
                              <Link
                                href={`/complexes/${c.slug}`}
                                className="font-medium text-[#101828] hover:text-[#1677FF]"
                              >
                                {c.name}
                              </Link>
                              <div className="mt-1 text-xs text-[#667085]">
                                {c.analysesCount} исследований · {c.duration}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-[#667085]">от </span>
                            <span className="text-lg font-bold text-[#101828]">
                              {c.priceFrom} ₽
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

            {/* СТАТЬИ */}
            {(activeTab === "all" || activeTab === "articles") &&
              foundArticles.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101828]">
                      Статьи
                    </h2>
                    <button
                      onClick={() => setActiveTab("articles")}
                      className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline"
                    >
                      Показать все ({foundArticles.length})
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {foundArticles.map((a) => (
                      <Card
                        key={a.id}
                        className="border-[#E4E7EC] transition hover:shadow-md"
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-[#EFF6FF]" />
                          <div className="flex-1">
                            <Badge variant="secondary" className="mb-1 text-xs">
                              {a.category}
                            </Badge>
                            <Link
                              href={`/library/${a.slug}`}
                              className="block font-medium text-[#101828] hover:text-[#1677FF]"
                            >
                              {a.title}
                            </Link>
                            <div className="mt-1 text-xs text-[#667085]">
                              {a.date} · {a.readingTime}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
          </div>
        )}
      </div>
    </main>
  );
}