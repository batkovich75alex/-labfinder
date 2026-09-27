"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Droplet,
  Heart,
  FileText,
  BarChart3,
  Grid3x3,
  BookOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { articles } from "@/data/mock";

const categories = [
  { id: "all", name: "Все рубрики", icon: Grid3x3 },
  { id: "Анализы", name: "Анализы", icon: Droplet },
  { id: "Заболевания", name: "Заболевания", icon: Heart },
  { id: "Подготовка", name: "Подготовка", icon: FileText },
  { id: "Расшифровка", name: "Расшифровка", icon: BarChart3 },
];

function LibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    if (catId === "all") {
      router.push("/library");
    } else {
      router.push(`/library?category=${encodeURIComponent(catId)}`);
    }
  };

  // ФИЛЬТРАЦИЯ
  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // Если есть поиск — ищем по ВСЕЙ библиотеке
    if (q) {
      return articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    // Без поиска — фильтр по категории
    if (activeCategory !== "all") {
      return articles.filter((a) => a.category === activeCategory);
    }

    return articles;
  }, [activeCategory, searchQuery]);

  const countByCategory = (catId: string) => {
    if (catId === "all") return articles.length;
    return articles.filter((a) => a.category === catId).length;
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Библиотека" },
          ]}
        />

        {/* HERO */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#F2F4F7] p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#101828] md:text-4xl">
                Медицинская библиотека
              </h1>
              <p className="mt-2 max-w-xl text-[#475467]">
                Проверенные статьи об анализах, заболеваниях, подготовке и
                расшифровке результатов
              </p>
            </div>
            <div className="hidden h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm md:flex">
              <BookOpen className="h-12 w-12 text-[#1677FF]" />
            </div>
          </div>

          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по всей библиотеке..."
              className="h-11 border-[#E4E7EC] bg-white pl-9 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828]"
                aria-label="Очистить поиск"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* РУБРИКИ */}
        <section className="mt-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id && !isSearching;
              const count = countByCategory(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSearchQuery("");
                    handleCategoryClick(cat.id);
                  }}
                  className={`flex flex-col gap-3 rounded-xl p-4 text-left shadow-sm transition md:p-5 ${
                    isActive
                      ? "bg-[#EFF6FF] ring-2 ring-[#1677FF]"
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full md:h-12 md:w-12 ${
                      isActive ? "bg-[#1677FF]" : "bg-[#EFF6FF]"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 md:h-6 md:w-6 ${
                        isActive ? "text-white" : "text-[#1677FF]"
                      }`}
                    />
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        isActive ? "text-[#1677FF]" : "text-[#101828]"
                      }`}
                    >
                      {cat.name}
                    </div>
                    <div className="mt-1 text-xs text-[#667085]">
                      {count} {count === 1 ? "статья" : count < 5 ? "статьи" : "статей"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* СТАТЬИ */}
        <section className="mt-10 pb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#101828] md:text-2xl">
              {isSearching
                ? `Результаты поиска: «${searchQuery}»`
                : activeCategory === "all"
                ? "Все статьи"
                : `Статьи: ${activeCategory}`}
            </h2>
            <div className="text-sm text-[#667085]">
              Найдено {filteredArticles.length}
            </div>
          </div>

          {filteredArticles.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#E4E7EC] bg-white p-12 text-center">
              <div className="text-[#667085]">
                {isSearching
                  ? `По запросу «${searchQuery}» ничего не найдено`
                  : "В этой рубрике пока нет статей"}
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleCategoryClick("all");
                }}
                className="mt-3 text-sm text-[#1677FF] hover:underline"
              >
                Показать все статьи
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {filteredArticles.map((art) => (
              <Card
                key={art.id}
                className="border-[#E4E7EC] transition hover:shadow-md"
              >
                <CardContent className="p-0">
                  <Link href={`/library/${art.slug}`}>
                    <div className="h-40 rounded-t-xl bg-gradient-to-br from-[#EFF6FF] to-[#F2F4F7]" />
                    <div className="p-5">
                      <Badge variant="secondary" className="mb-3 text-xs">
                        {art.category}
                      </Badge>
                      <h3 className="font-semibold text-[#101828] hover:text-[#1677FF]">
                        {art.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-[#667085]">
                        {art.excerpt}
                      </p>
                      <div className="mt-3 flex gap-3 text-xs text-[#667085]">
                        <span>{art.date}</span>
                        <span>·</span>
                        <span>{art.readingTime}</span>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-[#F8FAFC] min-h-screen">
          <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
            <div className="mt-6 h-48 animate-pulse rounded-2xl bg-[#F2F4F7]" />
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-[#F2F4F7]"
                />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <LibraryContent />
    </Suspense>
  );
}