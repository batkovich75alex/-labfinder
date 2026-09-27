"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Droplet,
  Clock,
  Heart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { analyses } from "@/data/mock";
import { useCart } from "@/lib/cart-context";

type Category =
  | "all"
  | "biochemistry"
  | "hormones"
  | "vitamins"
  | "general"
  | "immunology"
  | "allergy";

const categories = [
  {
    title: "Анализы",
    items: [
      { id: "all" as Category, label: "Все анализы" },
      { id: "biochemistry" as Category, label: "Биохимические исследования" },
      { id: "hormones" as Category, label: "Гормональные исследования" },
      { id: "vitamins" as Category, label: "Витамины" },
      { id: "general" as Category, label: "Общие анализы" },
      { id: "immunology" as Category, label: "Иммунология" },
      { id: "allergy" as Category, label: "Аллергология" },
    ],
  },
  {
    title: "Чекапы и комплексы",
    items: [{ id: "complexes" as any, label: "Все комплексы" }],
  },
];

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "price", label: "По цене" },
  { value: "duration", label: "По сроку" },
  { value: "alpha", label: "По алфавиту" },
];

const durationOptions = ["До 1 дня", "1–2 дня", "2–3 дня", "Более 3 дней"];
const biomaterialOptions = ["Кровь из вены", "Капиллярная кровь", "Моча", "Слюна"];
const methodOptions = [
  "Ферментативный",
  "Иммунохемилюминесцентный",
  "ПЦР",
  "Автоматический анализатор",
];

type OpenChip = "duration" | "biomaterial" | "method" | null;

function matchesDurationFilter(duration: string, filter: string): boolean {
  const d = duration.toLowerCase();
  if (filter === "До 1 дня") return d === "1 день" || d.includes("до 1");
  if (filter === "1–2 дня") return d.includes("1–2") || d.includes("1-2");
  if (filter === "2–3 дня") return d.includes("2–3") || d.includes("2-3");
  if (filter === "Более 3 дней")
    return d.includes("3–5") || d.includes("3-5") || d.includes("более 3");
  return false;
}

export default function CatalogPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openChip, setOpenChip] = useState<OpenChip>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleItem, isInCart } = useCart();

  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedBiomaterial, setSelectedBiomaterial] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string[]>([]);

  // БАЗА для подсчёта: только категория + поиск (без чипов)
  const baseList = useMemo(() => {
    let list = [...analyses];

    if (selectedCategory !== "all") {
      list = list.filter((a) => a.category === selectedCategory);
    }

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.short.toLowerCase().includes(q) ||
          (a.synonyms && a.synonyms.toLowerCase().includes(q)) ||
          (a.code && a.code.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // СТАТИЧНЫЕ счётчики — считаются от baseList, НЕ зависят от выбора
  const durationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    durationOptions.forEach((opt) => {
      counts[opt] = baseList.filter((a) =>
        matchesDurationFilter(a.duration, opt)
      ).length;
    });
    return counts;
  }, [baseList]);

  const biomaterialCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    biomaterialOptions.forEach((opt) => {
      counts[opt] = baseList.filter((a) => a.biomaterial === opt).length;
    });
    return counts;
  }, [baseList]);

  const methodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    methodOptions.forEach((opt) => {
      counts[opt] = baseList.filter((a) => a.method === opt).length;
    });
    return counts;
  }, [baseList]);

  // ИТОГОВЫЙ список с фильтрами + сортировкой
  const sortedAnalyses = useMemo(() => {
    let list = [...baseList];

    if (selectedDuration.length > 0) {
      list = list.filter((a) =>
        selectedDuration.some((f) => matchesDurationFilter(a.duration, f))
      );
    }

    if (selectedBiomaterial.length > 0) {
      list = list.filter((a) => selectedBiomaterial.includes(a.biomaterial));
    }

    if (selectedMethod.length > 0) {
      list = list.filter((a) => (a.method ? selectedMethod.includes(a.method) : false));
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
  }, [baseList, selectedSort, selectedDuration, selectedBiomaterial, selectedMethod]);

  const toggleFilter = (
    value: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
    );
  };

  const resetFilters = () => {
    setSelectedDuration([]);
    setSelectedBiomaterial([]);
    setSelectedMethod([]);
  };

  const activeFiltersCount =
    selectedDuration.length +
    selectedBiomaterial.length +
    selectedMethod.length;

  const currentSortLabel =
    sortOptions.find((o) => o.value === selectedSort)?.label || "По популярности";

  const countByCategory = (catId: Category) => {
    if (catId === "all") return analyses.length;
    return analyses.filter((a) => a.category === catId).length;
  };

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Москва", href: "/?city=msk" },
            { label: "Анализы" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#101828] md:text-3xl">
              Анализы
            </h1>
            <p className="mt-1 text-sm text-[#667085]">
              {activeFiltersCount > 0 ? (
                <>
                  Найдено{" "}
                  <span className="font-semibold text-[#1677FF]">
                    {sortedAnalyses.length}
                  </span>{" "}
                  из {baseList.length} исследований
                </>
              ) : (
                <>Найдено {sortedAnalyses.length} исследований</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              className="gap-2 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
              {activeFiltersCount > 0 && (
                <span className="ml-1 rounded-full bg-[#1677FF] px-2 py-0.5 text-xs text-white">
                  {activeFiltersCount}
                </span>
              )}
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
                          ? "text-[#1677FF] font-medium"
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
                  placeholder="Поиск анализов"
                  className="pl-9 h-9 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828]"
                    aria-label="Очистить поиск"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
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
                          onClick={() => setSelectedCategory(item.id as Category)}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                            selectedCategory === item.id
                              ? "bg-[#EFF6FF] text-[#1677FF] font-medium"
                              : "text-[#475467] hover:bg-[#F2F4F7]"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="text-xs text-[#98A2B3]">
                            {countByCategory(item.id as Category)}
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
            <div className="mb-4 hidden flex-wrap gap-2 lg:flex">
              {/* СРОК — статичные счётчики */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenChip(openChip === "duration" ? null : "duration")
                  }
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${
                    selectedDuration.length > 0
                      ? "border-[#1677FF] bg-[#EFF6FF] text-[#1677FF]"
                      : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[#1677FF] hover:text-[#1677FF]"
                  }`}
                >
                  Срок выполнения
                  {selectedDuration.length > 0 && (
                    <span className="rounded-full bg-[#1677FF] px-1.5 text-xs text-white">
                      {selectedDuration.length}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3" />
                </button>

                {openChip === "duration" && (
                  <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-[#E4E7EC] bg-white p-2 shadow-md">
                    {durationOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[#F2F4F7]"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-[#D0D5DD]"
                            checked={selectedDuration.includes(opt)}
                            onChange={() =>
                              toggleFilter(
                                opt,
                                selectedDuration,
                                setSelectedDuration
                              )
                            }
                          />
                          <span className="text-[#475467]">{opt}</span>
                        </span>
                        <span className="text-xs text-[#98A2B3]">
                          {durationCounts[opt]}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* БИОМАТЕРИАЛ — статичные счётчики */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenChip(openChip === "biomaterial" ? null : "biomaterial")
                  }
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${
                    selectedBiomaterial.length > 0
                      ? "border-[#1677FF] bg-[#EFF6FF] text-[#1677FF]"
                      : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[#1677FF] hover:text-[#1677FF]"
                  }`}
                >
                  Биоматериал
                  {selectedBiomaterial.length > 0 && (
                    <span className="rounded-full bg-[#1677FF] px-1.5 text-xs text-white">
                      {selectedBiomaterial.length}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3" />
                </button>

                {openChip === "biomaterial" && (
                  <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-[#E4E7EC] bg-white p-2 shadow-md">
                    {biomaterialOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[#F2F4F7]"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-[#D0D5DD]"
                            checked={selectedBiomaterial.includes(opt)}
                            onChange={() =>
                              toggleFilter(
                                opt,
                                selectedBiomaterial,
                                setSelectedBiomaterial
                              )
                            }
                          />
                          <span className="text-[#475467]">{opt}</span>
                        </span>
                        <span className="text-xs text-[#98A2B3]">
                          {biomaterialCounts[opt]}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* МЕТОД — статичные счётчики */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenChip(openChip === "method" ? null : "method")
                  }
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${
                    selectedMethod.length > 0
                      ? "border-[#1677FF] bg-[#EFF6FF] text-[#1677FF]"
                      : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[#1677FF] hover:text-[#1677FF]"
                  }`}
                >
                  Метод
                  {selectedMethod.length > 0 && (
                    <span className="rounded-full bg-[#1677FF] px-1.5 text-xs text-white">
                      {selectedMethod.length}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3" />
                </button>

                {openChip === "method" && (
                  <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-[#E4E7EC] bg-white p-2 shadow-md">
                    {methodOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[#F2F4F7]"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-[#D0D5DD]"
                            checked={selectedMethod.includes(opt)}
                            onChange={() =>
                              toggleFilter(opt, selectedMethod, setSelectedMethod)
                            }
                          />
                          <span className="text-[#475467]">{opt}</span>
                        </span>
                        <span className="text-xs text-[#98A2B3]">
                          {methodCounts[opt]}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-[#1677FF] hover:underline"
                >
                  Сбросить
                </button>
              )}
            </div>

            <div className="space-y-3">
              {sortedAnalyses.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#E4E7EC] bg-white p-12 text-center">
                  <div className="text-[#667085]">
                    Ничего не найдено. Попробуйте сбросить фильтры.
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      resetFilters();
                    }}
                    className="mt-3 text-sm text-[#1677FF] hover:underline"
                  >
                    Сбросить всё
                  </button>
                </div>
              )}

              {sortedAnalyses.map((a) => {
                const inCart = isInCart(a.id);

                return (
                  <Card
                    key={a.id}
                    className="border-[#E4E7EC] transition hover:shadow-md"
                  >
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:p-5">
                      <Link
                        href={`/catalog/${a.slug}`}
                        className="h-20 w-20 flex-shrink-0 rounded-lg bg-[#EFF6FF]"
                      />

                      <div className="flex-1">
                        <Link
                          href={`/catalog/${a.slug}`}
                          className="text-base font-semibold text-[#101828] hover:text-[#1677FF]"
                        >
                          {a.name}
                        </Link>
                        <p className="mt-1 line-clamp-1 text-sm text-[#667085]">
                          {a.short}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#667085]">
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

                      <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                        <div className="text-left md:text-right">
                          <div className="text-xs text-[#667085]">от</div>
                          <div className="text-lg font-bold text-[#101828]">
                            {a.priceFrom} ₽
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="rounded-md p-2 text-[#667085] hover:bg-[#F2F4F7]">
                            <Heart className="h-4 w-4" />
                          </button>
                          <Button
                            size="sm"
                            className={
                              inCart
                                ? "bg-[#12B76A] hover:bg-[#0E9B58]"
                                : "bg-[#1677FF] hover:bg-[#0969E8]"
                            }
                            onClick={() =>
                              toggleItem({
                                id: a.id,
                                type: "analysis",
                                name: a.name,
                                price: a.priceFrom,
                                duration: a.duration,
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