"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import {
  Search,
  Droplet,
  Activity,
  Pill,
  Shield,
  Bug,
  Dna,
  ArrowRight,
  Home,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { analyses, complexes, labs, articles, directions } from "@/data/mock";
import {
  heroImage,
  getCategoryImage,
  getComplexImage,
  getArticleImage,
  getLabColor,
} from "@/lib/images";

const directionIcons: Record<string, any> = {
  blood: Droplet,
  hormones: Activity,
  vitamins: Pill,
  allergy: Shield,
  infection: Bug,
  genetics: Dna,
};

const directionCategories: Record<string, string> = {
  blood: "biochemistry",
  hormones: "hormones",
  vitamins: "vitamins",
  allergy: "allergy",
  infection: "infection",
  genetics: "genetics",
};

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const popularAnalyses = analyses.slice(0, 4);
  const popularComplexes = complexes.slice(0, 3);
  const popularLabs = labs.slice(0, 4);
  const recentArticles = articles.slice(0, 3);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickSearch = (q: string) => {
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <main className="bg-[#F8FAFC]">
      {/* HERO — двухколоночный с фото */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 md:py-10">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-light)] via-white to-[#F2F4F7]">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            {/* ЛЕВАЯ — текст и поиск */}
            <div className="p-6 md:p-10 lg:p-12">
              <h1 className="display-xl text-[#101828]">
                Анализы и обследования
                <br />
                <span className="text-[var(--primary)]">в лабораториях</span> вашего
                города
              </h1>

              <p className="mt-4 max-w-md text-sm text-[#475467] md:text-base">
                Сравнивайте предложения лабораторий и выбирайте подходящее
                место сдачи — удобно, быстро, прозрачно.
              </p>

              <form onSubmit={handleSearch} className="mt-6 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Найдите анализ, комплекс или статью"
                    className="h-11 border-[#E4E7EC] bg-white pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-11 bg-[var(--primary)] px-6 hover:bg-[var(--primary-hover)]"
                >
                  Найти
                </Button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#667085]">
                <span>Например:</span>
                {["Общий анализ крови", "ТТГ", "Ферритин", "Витамин D"].map(
                  (q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickSearch(q)}
                      className="text-[var(--primary)] hover:underline"
                    >
                      {q}
                    </button>
                  )
                )}
              </div>

              {/* Бейджи доверия */}
              <div className="mt-6 flex flex-wrap gap-4">
                {[
                  { num: "1000+", label: "анализов" },
                  { num: "50+", label: "лабораторий" },
                  { num: "24/7", label: "поддержка" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--success-text)]" />
                    <div>
                      <div className="text-sm font-bold text-[#101828]">
                        {b.num}
                      </div>
                      <div className="text-xs text-[#667085]">{b.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ПРАВАЯ — фото медработника */}
            <div className="relative h-64 md:h-auto">
              <img
                src={heroImage}
                alt="Медицинская лаборатория"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-light)]/40 to-transparent md:bg-gradient-to-l" />
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h2 text-[#101828]">
            Популярные направления
          </h2>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
          >
            Все направления <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {directions.map((d) => {
            const Icon = directionIcons[d.id] || Droplet;
            return (
              <Link
                key={d.id}
                href="/catalog"
                className="group flex flex-col items-center gap-3 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-light)] transition group-hover:bg-[var(--primary)]">
                  <Icon className="h-6 w-6 text-[var(--primary)] transition group-hover:text-white" />
                </div>
                <div className="text-center text-sm font-medium text-[#101828]">
                  {d.name}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* POPULAR ANALYSES — с картинками */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h2 text-[#101828]">
            Популярные анализы
          </h2>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
          >
            Все анализы <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {popularAnalyses.map((a) => (
            <Card
              key={a.id}
              className="overflow-hidden border-[#E4E7EC] transition hover:shadow-md"
            >
              <CardContent className="p-0">
                <Link href={`/catalog/${a.slug}`}>
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={getCategoryImage(a.category)}
                      alt={a.name}
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                    <div className="absolute right-2 top-2">
                      <Badge className="bg-white/95 text-xs text-[#101828] hover:bg-white">
                        {a.duration}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="type-h3 text-[#101828] hover:text-[var(--primary)]">
                      {a.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[#667085]">
                      {a.short}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#667085]">от </span>
                        <span className="text-lg font-bold text-[#101828]">
                          {a.priceFrom} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* POPULAR COMPLEXES — с фото */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h2 text-[#101828]">
            Популярные комплексы
          </h2>
          <Link
            href="/complexes"
            className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
          >
            Все комплексы <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popularComplexes.map((c) => (
            <Card
              key={c.id}
              className="overflow-hidden border-[#E4E7EC] transition hover:shadow-md"
            >
              <CardContent className="p-0">
                <Link href={`/complexes/${c.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getComplexImage(c.id)}
                      alt={c.name}
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <Badge className="bg-[var(--primary)] text-xs text-white hover:bg-[var(--primary)]">
                        {c.analysesCount} исследований
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="type-h3 text-[#101828] hover:text-[var(--primary)]">
                      {c.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[#667085]">
                      {c.short}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#667085]">от </span>
                        <span className="text-xl font-bold text-[#101828]">
                          {c.priceFrom} ₽
                        </span>
                      </div>
                      <span className="text-sm text-[#667085]">{c.duration}</span>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* LABS — с фирменными цветами */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h2 text-[#101828]">
            Лаборатории
          </h2>
          <Link
            href="/labs"
            className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
          >
            Все лаборатории <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {popularLabs.map((l) => {
            const brandColor = getLabColor(l.slug);
            return (
              <Link key={l.id} href={`/labs/${l.slug}`}>
                <Card className="border-[#E4E7EC] transition hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-xl font-bold text-white"
                        style={{ backgroundColor: brandColor }}
                      >
                        {l.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-[#101828]">
                          {l.name}
                        </div>
                        <div className="text-sm text-[#667085]">
                          ★ {l.rating} · {l.reviews} отзывов
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-[#667085]">
                      {l.offices} отделений
                    </div>
                    {l.homeVisit && (
                      <Badge
                        variant="secondary"
                        className="mt-2 text-xs text-[var(--success-text)]"
                      >
                        Выезд на дом
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* LIBRARY — с фото статей */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h2 text-[#101828]">
            Медицинская библиотека
          </h2>
          <Link
            href="/library"
            className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
          >
            Все статьи <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentArticles.map((art) => (
            <Card
              key={art.id}
              className="overflow-hidden border-[#E4E7EC] transition hover:shadow-md"
            >
              <CardContent className="p-0">
                <Link href={`/library/${art.slug}`}>
                  <div className="h-40 overflow-hidden">
                    <img
                      src={getArticleImage(art.id)}
                      alt={art.title}
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {art.category}
                    </Badge>
                    <h3 className="type-h3 text-[#101828] hover:text-[var(--primary)]">
                      {art.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[#667085]">
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

      {/* EXTRA SERVICES */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 pb-12 md:px-6 md:py-8 md:pb-16">
        <h2 className="type-h2 mb-4 text-[#101828]">
          Дополнительные возможности
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              icon: Activity,
              title: "Диагностика",
              desc: "Инструментальные исследования",
            },
            {
              icon: Home,
              title: "Услуги на дому",
              desc: "Забор анализов на дому",
            },
            {
              icon: Briefcase,
              title: "Корпоративные программы",
              desc: "Для компаний и организаций",
            },
          ].map((s) => (
            <Card key={s.title} className="border-[#E4E7EC]">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)]">
                  <s.icon className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#101828]">{s.title}</div>
                  <div className="text-sm text-[#667085]">{s.desc}</div>
                  <Badge
                    variant="secondary"
                    className="mt-2 text-xs text-[#667085]"
                  >
                    Скоро
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}