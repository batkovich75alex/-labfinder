"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { useFavorites } from "@/lib/favorites-context";
import { useCity } from "@/lib/use-city";

type Category =
  | "all"
  | "biochemistry"
  | "hormones"
  | "vitamins"
  | "general"
  | "immunology"
  | "allergy"
  | "infection"
  | "genetics";

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
      { id: "infection" as Category, label: "Инфекции" },
      { id: "genetics" as Category, label: "Генетика" },
    ],
  },
];

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "price", label: "По цене" },
  { value: "duration", label: "По сроку" },
  { value: "alpha", label: "По алфавиту" },
];

const durationOptions = ["До 1 дня", "1–2 дня", "2–3 дня", "Более 3 дней"];
const biomaterialOptions = [...new Set(analyses.map((a) => a.biomaterial))];
const methodOptions = [
  ...new Set(analyses.map((a) => a.method).filter((method): method is string => Boolean(method))),
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

function splitParam(value: string | null) {
  return value ? value.split("|").filter(Boolean) : [];
}

function researchWord(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return "исследований";
  if (last === 1) return "исследование";
  if (last >= 2 && last <= 4) return "исследования";
  return "исследований";
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mobileFilterCloseRef = useRef<HTMLButtonElement>(null);
  const mobileFilterTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileFilterPanelRef = useRef<HTMLDivElement>(null);
  const [openChip, setOpenChip] = useState<OpenChip>(null);
  const categoryParam = searchParams.get("category") as Category | null;
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categoryParam && categories[0].items.some((item) => item.id === categoryParam)
      ? categoryParam
      : "all"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const { toggleItem, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [city] = useCity();

  const [selectedDuration, setSelectedDuration] = useState<string[]>(() => splitParam(searchParams.get("duration")));
  const [selectedBiomaterial, setSelectedBiomaterial] = useState<string[]>(() => splitParam(searchParams.get("biomaterial")));
  const [selectedMethod, setSelectedMethod] = useState<string[]>(() => splitParam(searchParams.get("method")));
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const trigger = mobileFilterTriggerRef.current;
    mobileFilterCloseRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileFiltersOpen(false);
      if (event.key === "Tab" && mobileFilterPanelRef.current) {
        const focusable = Array.from(mobileFilterPanelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [mobileFiltersOpen]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (selectedDuration.length) params.set("duration", selectedDuration.join("|"));
    if (selectedBiomaterial.length) params.set("biomaterial", selectedBiomaterial.join("|"));
    if (selectedMethod.length) params.set("method", selectedMethod.join("|"));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, selectedCategory, searchQuery, minPrice, maxPrice, selectedDuration, selectedBiomaterial, selectedMethod]);

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
      list = list.filter((a) =>
        a.method ? selectedMethod.includes(a.method) : false
      );
    }

    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice && Number.isFinite(min)) list = list.filter((a) => a.priceFrom >= min);
    if (maxPrice && Number.isFinite(max)) list = list.filter((a) => a.priceFrom <= max);

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
  }, [baseList, selectedSort, selectedDuration, selectedBiomaterial, selectedMethod, minPrice, maxPrice]);

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
    setMinPrice("");
    setMaxPrice("");
  };

  const resetAllFilters = () => {
    resetFilters();
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const activeFiltersCount =
    selectedDuration.length +
    selectedBiomaterial.length +
    selectedMethod.length +
    (minPrice || maxPrice ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0);

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
            { label: city, href: "/" },
            { label: "Анализы" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="type-h1 text-[#101828]">
              Анализы
            </h1>
            <p className="mt-1 text-sm text-[#667085]" role="status" aria-live="polite">
              {activeFiltersCount > 0 ? (
                <>
                  Найдено{" "}
                  <span className="font-semibold text-[var(--primary)]">
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
              ref={mobileFilterTriggerRef}
              variant="outline"
              className="gap-2 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
              {activeFiltersCount > 0 && (
                <span className="ml-1 rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs text-white">
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

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                <Input
                  aria-label="Поиск анализов"
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

              <fieldset className="mb-5">
                <legend className="mb-2 text-sm font-semibold text-[#101828]">Цена, ₽</legend>
                <div className="grid grid-cols-2 gap-2">
                  <Input inputMode="numeric" aria-label="Цена от" placeholder="От" value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))} />
                  <Input inputMode="numeric" aria-label="Цена до" placeholder="До" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))} />
                </div>
                <p className="mt-2 text-xs leading-5 text-[#667085]">Цена исследования без платы за взятие биоматериала.</p>
              </fieldset>

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
                              ? "bg-[var(--primary-light)] text-[var(--primary)] font-medium"
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
            {activeFiltersCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Активные фильтры">
                {selectedCategory !== "all" && <button onClick={() => setSelectedCategory("all")} className="rounded-full bg-[var(--primary-light)] px-3 py-2 text-sm text-[var(--primary)]">{categories[0].items.find((item) => item.id === selectedCategory)?.label} ×</button>}
                {minPrice && <button onClick={() => setMinPrice("")} className="rounded-full bg-[var(--primary-light)] px-3 py-2 text-sm text-[var(--primary)]">От {Number(minPrice).toLocaleString("ru-RU")} ₽ ×</button>}
                {maxPrice && <button onClick={() => setMaxPrice("")} className="rounded-full bg-[var(--primary-light)] px-3 py-2 text-sm text-[var(--primary)]">До {Number(maxPrice).toLocaleString("ru-RU")} ₽ ×</button>}
                {selectedDuration.map((value) => <button key={value} onClick={() => toggleFilter(value, selectedDuration, setSelectedDuration)} className="rounded-full bg-[var(--primary-light)] px-3 py-2 text-sm text-[var(--primary)]">{value} ×</button>)}
                {selectedBiomaterial.map((value) => <button key={value} onClick={() => toggleFilter(value, selectedBiomaterial, setSelectedBiomaterial)} className="rounded-full bg-[var(--primary-light)] px-3 py-2 text-sm text-[var(--primary)]">{value} ×</button>)}
                {selectedMethod.map((value) => <button key={value} onClick={() => toggleFilter(value, selectedMethod, setSelectedMethod)} className="rounded-full bg-[var(--primary-light)] px-3 py-2 text-sm text-[var(--primary)]">{value} ×</button>)}
                <button onClick={resetAllFilters} className="min-h-11 px-2 text-sm font-medium text-[var(--primary)] hover:underline">Сбросить всё</button>
              </div>
            )}
            <div className="mb-4 hidden flex-wrap gap-2 lg:flex">
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenChip(openChip === "duration" ? null : "duration")
                  }
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${
                    selectedDuration.length > 0
                      ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                      : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  Срок выполнения
                  {selectedDuration.length > 0 && (
                    <span className="rounded-full bg-[var(--primary)] px-1.5 text-xs text-white">
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

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenChip(openChip === "biomaterial" ? null : "biomaterial")
                  }
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${
                    selectedBiomaterial.length > 0
                      ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                      : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  Биоматериал
                  {selectedBiomaterial.length > 0 && (
                    <span className="rounded-full bg-[var(--primary)] px-1.5 text-xs text-white">
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

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenChip(openChip === "method" ? null : "method")
                  }
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${
                    selectedMethod.length > 0
                      ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                      : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  Метод
                  {selectedMethod.length > 0 && (
                    <span className="rounded-full bg-[var(--primary)] px-1.5 text-xs text-white">
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
                  onClick={resetAllFilters}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  Сбросить
                </button>
              )}
            </div>

            <div className="space-y-3">
              {sortedAnalyses.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#E4E7EC] bg-white p-12 text-center">
                  <div className="text-[#667085]">
                    <strong className="block text-[#101828]">По этим условиям ничего не найдено</strong>
                    <span className="mt-2 block">Попробуйте увеличить диапазон цены или убрать один из фильтров.</span>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      resetAllFilters();
                    }}
                    className="mt-3 text-sm text-[var(--primary)] hover:underline"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}

              {sortedAnalyses.map((a) => {
                const inCart = isInCart(a.id);
                const inFav = isFavorite(a.id);

                return (
                  <Card
                    key={a.id}
                    className="border-[#E4E7EC] transition hover:shadow-md"
                  >
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:p-5">
                      <Link
                        href={`/catalog/${a.slug}`}
                        className="h-20 w-20 flex-shrink-0 rounded-lg bg-[var(--primary-light)]"
                      />

                      <div className="flex-1">
                        <Link
                          href={`/catalog/${a.slug}`}
                          className="text-base font-semibold text-[#101828] hover:text-[var(--primary)]"
                        >
                          {a.name}
                        </Link>
                        <p className="mt-1 line-clamp-1 text-sm text-[#667085]">
                          {a.short}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#667085]">
                          <span className="flex items-center gap-1">
                            <Droplet className="h-3 w-3 text-[var(--primary)]" />
                            {a.biomaterial}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[var(--primary)]" />
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
                          <button
                            onClick={() => toggleFavorite(a.id)}
                            className={`rounded-md p-2 transition ${
                              inFav
                                ? "text-[#F04438] hover:bg-[#FEF3F2]"
                                : "text-[#667085] hover:bg-[#F2F4F7]"
                            }`}
                            aria-label={`${inFav ? "Удалить" : "Добавить"} ${a.name} ${inFav ? "из избранного" : "в избранное"}`}
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
                                id: a.id,
                                slug: a.slug,
                                type: "analysis",
                                name: a.name,
                                price: a.priceFrom,
                                duration: a.duration,
                              })
                            }
                          >
                            {inCart ? "В корзине" : "Добавить в корзину"}
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

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-filters-title">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div ref={mobileFilterPanelRef} className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#E4E7EC] bg-white px-4 py-4">
              <div id="mobile-filters-title" className="flex items-center gap-2 text-base font-semibold">
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                ref={mobileFilterCloseRef}
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-md p-1.5 hover:bg-[#F2F4F7]"
                aria-label="Закрыть фильтры"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-4">
              <div>
                <label htmlFor="mobile-category" className="mb-3 block text-sm font-medium text-[#101828]">Направление</label>
                <select id="mobile-category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as Category)} className="min-h-12 w-full rounded-xl border border-[#667085] bg-white px-3">
                  {categories[0].items.map((item) => <option key={item.id} value={item.id}>{item.label} ({countByCategory(item.id)})</option>)}
                </select>
              </div>
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-[#101828]">Цена, ₽</legend>
                <div className="grid grid-cols-2 gap-3">
                  <Input inputMode="numeric" aria-label="Цена от" placeholder="От" value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))} />
                  <Input inputMode="numeric" aria-label="Цена до" placeholder="До" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))} />
                </div>
                <p className="mt-2 text-xs leading-5 text-[#667085]">Без платы за взятие биоматериала.</p>
              </fieldset>
              <div>
                <label htmlFor="mobile-analysis-search" className="mb-3 block text-sm font-medium text-[#101828]">
                  Поиск
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                  <Input
                    id="mobile-analysis-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Название анализа"
                    className="pl-9 h-10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-medium text-[#101828]">
                  Срок выполнения
                </div>
                <div className="space-y-2">
                  {durationOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-[#D0D5DD]"
                        checked={selectedDuration.includes(opt)}
                        onChange={() =>
                          toggleFilter(opt, selectedDuration, setSelectedDuration)
                        }
                      />
                      <span className="text-[#475467]">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-medium text-[#101828]">
                  Биоматериал
                </div>
                <div className="space-y-2">
                  {biomaterialOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-3 text-sm"
                    >
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
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-medium text-[#101828]">
                  Метод
                </div>
                <div className="space-y-2">
                  {methodOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-[#D0D5DD]"
                        checked={selectedMethod.includes(opt)}
                        onChange={() =>
                          toggleFilter(opt, selectedMethod, setSelectedMethod)
                        }
                      />
                      <span className="text-[#475467]">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex gap-3 border-t border-[#E4E7EC] bg-white p-4">
              <Button variant="outline" className="flex-1" onClick={resetAllFilters}>
                Сбросить все
              </Button>
              <Button
                className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Показать {sortedAnalyses.length} {researchWord(sortedAnalyses.length)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F8FAFC]" aria-busy="true" />}>
      <CatalogContent />
    </Suspense>
  );
}
