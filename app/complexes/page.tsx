"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { complexes } from "@/data/mock";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";

const categories = [
  {
    title: "Анализы",
    items: [
      { label: "Все анализы", count: 32 },
      { label: "Биохимические исследования", count: 12 },
      { label: "Гормональные исследования", count: 7 },
      { label: "Витамины", count: 3 },
    ],
  },
  {
    title: "Чекапы и комплексы",
    items: [
      { label: "Все комплексы", count: 2, active: true },
      { label: "Сердечно-сосудистые", count: 1 },
      { label: "Проверка витаминов", count: 1 },
    ],
  },
];

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "price", label: "По цене" },
  { value: "duration", label: "По сроку" },
  { value: "alpha", label: "По алфавиту" },
];

export default function ComplexesPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleItem, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const sortedComplexes = useMemo(() => {
    let list = [...complexes];

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.short.toLowerCase().includes(q)
      );
    }

    switch (selectedSort) {
      case "price":
        return list.sort((a, b) => a.priceFrom - b.priceFrom);
      case "duration":
        return list.sort((a, b) => {
          const getDays = (d: string) => {
            if (d.includes("1–2") || d.includes("1-2")) return 2;
            if (d.includes("2–3") || d.includes("2-3")) return 3;
            if (d.includes("3–5") || d.includes("3-5")) return 5;
            return 1;
          };
          return getDays(a.duration) - getDays(b.duration);
        });
      case "alpha":
        return list.sort((a, b) => a.name.localeCompare(b.name, "ru"));
      case "popular":
      default:
        return list;
    }
  }, [selectedSort, searchQuery]);

  const currentSortLabel =
    sortOptions.find((o) => o.value === selectedSort)?.label || "По популярности";

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Москва", href: "/?city=msk" },
            { label: "Чекапы и комплексы" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="type-h1 text-[#101828]">
              Чекапы и комплексы
            </h1>
            <p className="mt-1 text-sm text-[#667085]">
              Найдено {sortedComplexes.length} комплекса
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setSortOpen(!sortOpen)}
              >
                {currentSortLabel}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {sortOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-[#E4E7EC] bg-white py-1 shadow-md">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#F2F4F7] ${
                        selectedSort === option.value
                          ? "text-[var(--primary)] font-medium"
                          : "text-[#101828]"
                      }`}
                      onClick={() => {
                        setSelectedSort(option.value);
                        setSortOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск комплексов"
                  className="pl-9 h-9 text-sm"
                />
              </div>

              {categories.map((cat) => (
                <div key={cat.title} className="mb-4">
                  <div className="mb-2 text-sm font-semibold text-[#101828]">
                    {cat.title}
                  </div>
                  <ul className="space-y-1">
                    {cat.items.map((item) => (
                      <li key={item.label}>
                        <button
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                            item.active
                              ? "bg-[var(--primary-light)] text-[var(--primary)] font-medium"
                              : "text-[#475467] hover:bg-[#F2F4F7]"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="text-xs text-[#98A2B3]">
                            {item.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {["Цена", "Срок выполнения", "Количество исследований"].map(
                (f) => (
                  <button
                    key={f}
                    className="flex items-center gap-1 rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 text-sm text-[#475467] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    {f}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                )
              )}
            </div>

            <div className="space-y-3">
              {sortedComplexes.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#E4E7EC] bg-white p-12 text-center">
                  <div className="text-[#667085]">
                    {searchQuery
                      ? `По запросу «${searchQuery}» ничего не найдено`
                      : "Комплексов пока нет"}
                  </div>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-sm text-[var(--primary)] hover:underline"
                  >
                    Сбросить поиск
                  </button>
                </div>
              )}

              {sortedComplexes.map((c) => {
                const inCart = isInCart(c.id);
                const inFav = isFavorite(c.id);

                return (
                  <Card
                    key={c.id}
                    className="border-[#E4E7EC] transition hover:shadow-md"
                  >
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:p-5">
                      <Link
                        href={`/complexes/${c.slug}`}
                        className="h-20 w-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-[var(--primary-light)] to-[#F2F4F7]"
                      />

                      <div className="flex-1">
                        <Link
                          href={`/complexes/${c.slug}`}
                          className="text-base font-semibold text-[#101828] hover:text-[var(--primary)]"
                        >
                          {c.name}
                        </Link>
                        <p className="mt-1 line-clamp-2 text-sm text-[#667085]">
                          {c.short}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#667085]">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-[var(--primary)]" />
                            {c.analysesCount} исследований
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[var(--primary)]" />
                            {c.duration}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                        <div className="text-left md:text-right">
                          <div className="text-xs text-[#667085]">от</div>
                          <div className="text-lg font-bold text-[#101828]">
                            {c.priceFrom} ₽
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFavorite(c.id)}
                            className={`rounded-md p-2 transition ${
                              inFav
                                ? "text-[#F04438] hover:bg-[#FEF3F2]"
                                : "text-[#667085] hover:bg-[#F2F4F7]"
                            }`}
                            aria-label="В избранное"
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                inFav ? "fill-[#F04438]" : ""
                              }`}
                            />
                          </button>
                          <Button
                            size="sm"
                            className={
                              inCart
                                ? "bg-[var(--success-text)] hover:bg-[var(--accent)]"
                                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                            }
                            onClick={() =>
                              toggleItem({
                                id: c.id,
                                slug: c.slug,
                                type: "complex",
                                name: c.name,
                                price: c.priceFrom,
                                duration: c.duration,
                              })
                            }
                          >
                            {inCart ? "В корзине" : "В корзину"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}