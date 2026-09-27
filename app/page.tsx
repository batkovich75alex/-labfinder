import Link from "next/link";
import { Search, Droplet, Activity, Pill, Shield, Bug, Dna, ArrowRight, Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { analyses, complexes, labs, articles, directions } from "@/data/mock";

const directionIcons: Record<string, any> = {
  blood: Droplet,
  hormones: Activity,
  vitamins: Pill,
  allergy: Shield,
  infection: Bug,
  genetics: Dna,
};

export default function HomePage() {
  const popularAnalyses = analyses.slice(0, 4);
  const popularComplexes = complexes.slice(0, 3);
  const popularLabs = labs.slice(0, 4);
  const recentArticles = articles.slice(0, 3);

  return (
    <main className="bg-[#F8FAFC]">
      {/* HERO */}
      <section className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#F2F4F7] p-8 md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold text-[#101828] md:text-4xl">
                Анализы и обследования<br />
                в лабораториях вашего города
              </h1>
              <p className="mt-3 text-[#475467]">
                Сравнивайте предложения лабораторий<br />
                и выбирайте подходящее место сдачи
              </p>

              <div className="mt-6 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                  <Input
                    placeholder="Найдите анализ, комплекс или статью"
                    className="h-11 border-[#E4E7EC] bg-white pl-9"
                  />
                </div>
                <Button className="h-11 bg-[#1677FF] px-6 hover:bg-[#0969E8]">
                  Найти
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#667085]">
                <span>Например:</span>
                {["Общий анализ крови", "ТТГ", "Ферритин", "Витамин D"].map((q) => (
                  <button key={q} className="text-[#1677FF] hover:underline">
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:justify-end">
              <div className="space-y-3">
                {[
                  { num: "1000+", label: "анализов" },
                  { num: "50+", label: "лабораторий" },
                  { num: "24/7", label: "поддержка" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <div className="text-2xl font-bold text-[#1677FF]">{b.num}</div>
                    <div className="text-sm text-[#475467]">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#101828]">Популярные направления</h2>
          <Link href="/catalog" className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline">
            Все направления <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {directions.map((d) => {
            const Icon = directionIcons[d.id] || Droplet;
            return (
              <Link
                key={d.id}
                href={`/catalog/${d.id}`}
                className="flex flex-col items-center gap-3 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
                  <Icon className="h-6 w-6 text-[#1677FF]" />
                </div>
                <div className="text-center text-sm font-medium text-[#101828]">
                  {d.name}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* POPULAR ANALYSES */}
      <section className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#101828]">Популярные анализы</h2>
          <Link href="/catalog" className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline">
            Все анализы <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {popularAnalyses.map((a) => (
            <Card key={a.id} className="overflow-hidden border-[#E4E7EC] transition hover:shadow-md">
              <CardContent className="p-4">
                <div className="h-32 rounded-lg bg-[#EFF6FF] mb-3" />
                <Link href={`/catalog/${a.slug}`} className="block">
                  <h3 className="font-semibold text-[#101828] hover:text-[#1677FF]">
                    {a.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[#667085]">
                    {a.short}
                  </p>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#667085]">от </span>
                    <span className="text-lg font-bold text-[#101828]">{a.priceFrom} ₽</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {a.duration}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* POPULAR COMPLEXES */}
      <section className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#101828]">Популярные комплексы</h2>
          <Link href="/complexes" className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline">
            Все комплексы <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {popularComplexes.map((c) => (
            <Card key={c.id} className="border-[#E4E7EC] transition hover:shadow-md">
              <CardContent className="p-5">
                <div className="h-40 rounded-lg bg-gradient-to-br from-[#EFF6FF] to-[#F2F4F7] mb-4" />
                <Link href={`/complexes/${c.slug}`}>
                  <h3 className="font-semibold text-[#101828] hover:text-[#1677FF]">
                    {c.name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-[#667085]">
                  {c.analysesCount} исследований · {c.duration}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#667085]">от </span>
                    <span className="text-xl font-bold text-[#101828]">{c.priceFrom} ₽</span>
                  </div>
                  <Button size="sm" className="bg-[#1677FF] hover:bg-[#0969E8]">
                    В корзину
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* LABS */}
      <section className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#101828]">Лаборатории</h2>
          <Link href="/labs" className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline">
            Все лаборатории <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {popularLabs.map((l) => (
            <Card key={l.id} className="border-[#E4E7EC]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF] text-xl font-bold text-[#1677FF]">
                    {l.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[#101828]">{l.name}</div>
                    <div className="text-sm text-[#667085]">
                      ★ {l.rating} · {l.reviews} отзывов
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-[#667085]">
                  {l.offices} отделений
                </div>
                {l.homeVisit && (
                  <Badge variant="secondary" className="mt-2 text-xs text-[#12B76A]">
                    Выезд на дом
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* LIBRARY */}
      <section className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#101828]">Медицинская библиотека</h2>
          <Link href="/library" className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline">
            Все статьи <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {recentArticles.map((art) => (
            <Card key={art.id} className="border-[#E4E7EC]">
              <CardContent className="p-4">
                <div className="h-32 rounded-lg bg-[#F2F4F7] mb-3" />
                <Badge variant="secondary" className="text-xs mb-2">
                  {art.category}
                </Badge>
                <Link href={`/library/${art.slug}`}>
                  <h3 className="font-semibold text-[#101828] hover:text-[#1677FF]">
                    {art.title}
                  </h3>
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-[#667085]">
                  {art.excerpt}
                </p>
                <div className="mt-3 flex gap-3 text-xs text-[#667085]">
                  <span>{art.date}</span>
                  <span>·</span>
                  <span>{art.readingTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* EXTRA SERVICES */}
      <section className="mx-auto max-w-[1280px] px-6 py-8 pb-16">
        <h2 className="mb-4 text-2xl font-semibold text-[#101828]">
          Дополнительные возможности
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Activity, title: "Диагностика", desc: "Инструментальные исследования" },
            { icon: Home, title: "Услуги на дому", desc: "Забор анализов на дому" },
            { icon: Briefcase, title: "Корпоративные программы", desc: "Для компаний и организаций" },
          ].map((s) => (
            <Card key={s.title} className="border-[#E4E7EC]">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
                  <s.icon className="h-6 w-6 text-[#1677FF]" />
                </div>
                <div>
                  <div className="font-semibold text-[#101828]">{s.title}</div>
                  <div className="text-sm text-[#667475]">{s.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}