"use client";

import { useCity } from "@/lib/use-city";
import { useCart } from "@/lib/cart-context";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
import { analyses, complexes, labs, articles, directions, cities } from "@/data/mock";
import {
  heroImage,
  getComplexImage,
  getArticleImage,
  getLabColor,
} from "@/lib/images";

const directionIcons: Record<string, LucideIcon> = {
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
  const [city, setCity] = useCity();
  const { addItem, isInCart } = useCart();
  const [notice, setNotice] = useState("");
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
      <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-10">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-light)] via-white to-[#F2F4F7]">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            {/* ЛЕВАЯ — текст и поиск */}
            <div className="p-6 md:p-10 lg:p-12">
              <h1 className="display-xl text-[#101828]">Найдите анализы и сравните лаборатории</h1>

              <p className="mt-4 max-w-md text-sm text-[#475467] md:text-base">
                Сравните стоимость исследований, сроки и отделения в вашем городе
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <label htmlFor="home-city" className="text-sm font-medium">Ваш город</label>
                <select id="home-city" value={city} onChange={(e) => setCity(e.target.value)} className="min-h-11 rounded-xl border border-[#667085] bg-white px-3">
                  {cities.map((c) => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <label htmlFor="home-search" className="mt-5 block font-medium">Название анализа или код</label>
              <form onSubmit={handleSearch} className="mt-2 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                  <Input
                    id="home-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Например, общий анализ крови"
                    className="h-12 border-[#667085] bg-white pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 bg-[var(--primary)] px-6 hover:bg-[var(--primary-hover)]"
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

              <p className="mt-4 text-sm text-[#475467]">Демонстрационный каталог. Цены и условия уточняйте у лаборатории.</p>
              <div className="mt-6 flex flex-wrap gap-4">
                {[
                  { num: String(analyses.length), label: "анализа в каталоге" },
                  { num: String(labs.length), label: "лаборатории" },
                  { num: String(complexes.length), label: "комплекса" },
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
            <div className="relative hidden min-h-80 md:block">
              <Image
                src={heroImage}
                alt="Медицинская лаборатория"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 0px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-light)]/40 to-transparent md:bg-gradient-to-l" />
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
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
                href={`/catalog?category=${directionCategories[d.id]}`}
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

      {/* Research cards use text, not repetitive stock photos. */}
      <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
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
                <div className="flex h-full flex-col p-5">
                  <Link href={`/catalog/${a.slug}`}><h3 className="type-h4 text-[#101828] hover:text-[var(--primary)]">{a.name}</h3></Link>
                  <p className="mt-2 text-sm text-[#475467]">{a.short}</p>
                  <p className="mt-3 text-sm text-[#475467]">{a.biomaterial} · {a.duration}</p>
                  <p className="mt-4"><span className="text-sm text-[#475467]">от </span><span className="price-m">{a.priceFrom.toLocaleString("ru-RU")} ₽</span></p>
                  {isInCart(a.id) ? <Link href="/cart" className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-[var(--success-bg)] px-3 font-semibold text-[var(--success-text)]">Открыть корзину</Link> :
                    <Button className="mt-4 w-full whitespace-normal" onClick={() => {
                      addItem({ id: a.id, slug: a.slug, type: "analysis", name: a.name, price: a.priceFrom, duration: a.duration });
                      setNotice(`${a.name}: анализ добавлен в корзину`);
                    }}>Добавить в корзину</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* POPULAR COMPLEXES — с фото */}
      <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
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
                    <Image
                      src={getComplexImage(c.id)}
                      alt={c.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition hover:scale-105"
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
      <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
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
      <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
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
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={getArticleImage(art.id)}
                      alt={art.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition hover:scale-105"
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

      <section className="mx-auto max-w-[1200px] px-4 py-10 md:px-6" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="type-h2">Как пользоваться</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[ ["Выберите исследования", "Найдите анализы или комплекс и добавьте их в корзину."], ["Сравните лаборатории", "Посмотрите стоимость, сроки и доступность выбранного набора."], ["Перейдите к лаборатории", "Уточните условия и выберите подходящее отделение."] ].map(([title, text], i) => <li key={title} className="rounded-2xl bg-white p-6"><span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary-light)] font-semibold text-[var(--primary)]">{i + 1}</span><h3 className="type-h4">{title}</h3><p className="mt-2 text-[#475467]">{text}</p></li>)}
        </ol>
      </section>
      <p role="status" className="sr-only">{notice}</p>
      {/* EXTRA SERVICES */}
      <section className="mx-auto max-w-[1200px] px-4 py-6 pb-12 md:px-6 md:py-8 md:pb-16">
        <h2 className="type-h2 mb-4 text-[#101828]">
          Планируемые возможности
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
                    Функция пока недоступна
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
