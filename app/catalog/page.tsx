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

const categories = [
  {
    title: "Анализы",
    items: [
      { label: "Все анализы", count: 7 },
      { label: "Биохимические исследования", count: 4, active: true },
      { label: "Гормональные исследования", count: 1 },
      { label: "Витамины", count: 1 },
    ],
  },
  {
    title: "Чекапы и комплексы",
    items: [{ label: "Все комплексы", count: 2 }],
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
const methodOptions = ["Биохимический", "Иммунохемилюминесцентный", "ПЦР"];

type OpenChip = "duration" | "biomaterial" | "method" | null;

export default function CatalogPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openChip, setOpenChip] = useState<OpenChip>(null);
  const { toggleItem, isInCart } = useCart();

  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedBiomaterial, setSelectedBiomaterial] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string[]>([]);

  // СОРТИРОВКА
  const sortedAnalyses = useMemo(() => {
    const list = [...analyses];

    switch (selectedSort) {
      case "price":
        return list.sort((a, b) => a.priceFrom - b.priceFrom);
      case "duration":
        return list.sort((a, b) => {
          const getDays = (d: string) => {
            if (d.includes("1–2") || d.includes("1-2")) return 2;
            if (d.includes("2–3") || d.includes("2-3")) return 3;
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
  }, [selectedSort]);

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
    sortOptions.find((o) => o.value === selectedSort)?.label ||
    "По популярности";

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
              Найдено {sortedAnalyses.length} исследований
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
                  placeholder="Поиск анализов"
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
                              ? "bg-[#EFF6FF] text-[#1677FF] font-medium"
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
            <div className="mb-4 hidden flex-wrap gap-2 lg:flex">
              <button className="flex items-center gap-1 rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 text-sm text-[#475467] hover:border-[#1677FF] hover:text-[#1677FF]">
                Цена
                <ChevronDown className="h-3 w-3" />
              </button>

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
                  <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-[#E4E7EC] bg-white p-3 shadow-md">
                    {durationOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[#F2F4F7]"
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
                )}
              </div>

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
                  <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-[#E4E7EC] bg-white p-3 shadow-md">
                    {biomaterialOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[#F2F4F7]"
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
                )}
              </div>

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
                  <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-[#E4E7EC] bg-white p-3 shadow-md">
                    {methodOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[#F2F4F7]"
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

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#E4E7EC] bg-white px-4 py-4">
              <div className="flex items-center gap-2 text-base font-semibold">
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-[#1677FF] px-2 py-0.5 text-xs text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-md p-1.5 hover:bg-[#F2F4F7]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-4">
              <div>
                <div className="mb-3 text-sm font-medium text-[#101828]">
                  Цена
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="от 0 ₽" className="h-10" />
                  <span className="text-[#667085]">—</span>
                  <Input placeholder="до 5 500 ₽" className="h-10" />
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
              <Button variant="outline" className="flex-1" onClick={resetFilters}>
                Сбросить все
              </Button>
              <Button
                className="flex-1 bg-[#1677FF] hover:bg-[#0969E8]"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Применить ({sortedAnalyses.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}