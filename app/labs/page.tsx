"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  List,
  Map as MapIcon,
  Star,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { labs } from "@/data/mock";

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "rating", label: "По рейтингу" },
  { value: "offices", label: "По количеству отделений" },
  { value: "alpha", label: "По алфавиту" },
];

// CHIPS-ФИЛЬТРЫ
const ratingOptions = ["4.5+", "4.0+", "Любой"];
const officesOptions = ["Более 100", "50–100", "Менее 50", "Любое"];

type OpenChip = "rating" | "homeVisit" | "offices" | null;

export default function LabsPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [view, setView] = useState<"list" | "map">("list");

  // Фильтры chips
  const [openChip, setOpenChip] = useState<OpenChip>(null);
  const [selectedRating, setSelectedRating] = useState<string>("Любой");
  const [onlyHomeVisit, setOnlyHomeVisit] = useState(false);
  const [selectedOffices, setSelectedOffices] = useState<string>("Любое");

  // ФИЛЬТРАЦИЯ + СОРТИРОВКА
  const sortedLabs = useMemo(() => {
    let list = [...labs];

    // 1. Фильтр по рейтингу
    if (selectedRating === "4.5+") {
      list = list.filter((l) => l.rating >= 4.5);
    } else if (selectedRating === "4.0+") {
      list = list.filter((l) => l.rating >= 4.0);
    }

    // 2. Фильтр по выезду на дом
    if (onlyHomeVisit) {
      list = list.filter((l) => l.homeVisit);
    }

    // 3. Фильтр по количеству отделений
    if (selectedOffices === "Более 100") {
      list = list.filter((l) => l.offices > 100);
    } else if (selectedOffices === "50–100") {
      list = list.filter((l) => l.offices >= 50 && l.offices <= 100);
    } else if (selectedOffices === "Менее 50") {
      list = list.filter((l) => l.offices < 50);
    }

    // 4. Сортировка
    switch (selectedSort) {
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "offices":
        return list.sort((a, b) => b.offices - a.offices);
      case "alpha":
        return list.sort((a, b) => a.name.localeCompare(b.name, "ru"));
      case "popular":
      default:
        return list;
    }
  }, [selectedSort, selectedRating, onlyHomeVisit, selectedOffices]);

  const currentSortLabel =
    sortOptions.find((o) => o.value === selectedSort)?.label ||
    "По популярности";

  const activeFiltersCount =
    (selectedRating !== "Любой" ? 1 : 0) +
    (onlyHomeVisit ? 1 : 0) +
    (selectedOffices !== "Любое" ? 1 : 0);

  const resetFilters = () => {
    setSelectedRating("Любой");
    setOnlyHomeVisit(false);
    setSelectedOffices("Любое");
  };

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Лаборатории" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="type-h1 text-[#101828]">
              Лаборатории в Москве
            </h1>
            <p className="mt-1 text-sm text-[#667085]">
              Найдено {sortedLabs.length} лаборатории
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={resetFilters}
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
                <div className="absolute right-0 top-full z-20 mt-1 w-60 rounded-lg border border-[#E4E7EC] bg-white py-1 shadow-md">
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

            <div className="flex rounded-lg border border-[#E4E7EC] bg-white p-0.5">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                  view === "list"
                    ? "bg-[var(--primary)] text-white"
                    : "text-[#475467]"
                }`}
              >
                <List className="h-4 w-4" />
                Список
              </button>
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                  view === "map"
                    ? "bg-[var(--primary)] text-white"
                    : "text-[#475467]"
                }`}
              >
                <MapIcon className="h-4 w-4" />
                Карта
              </button>
            </div>
          </div>
        </div>

        {/* CHIPS-ФИЛЬТРЫ */}
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Рейтинг */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenChip(openChip === "rating" ? null : "rating")
              }
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${
                selectedRating !== "Любой"
                  ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                  : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
            >
              Рейтинг
              {selectedRating !== "Любой" && (
                <span className="rounded-full bg-[var(--primary)] px-1.5 text-xs text-white">
                  {selectedRating}
                </span>
              )}
              <ChevronDown className="h-3 w-3" />
            </button>

            {openChip === "rating" && (
              <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-lg border border-[#E4E7EC] bg-white p-1 shadow-md">
                {ratingOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedRating(opt);
                      setOpenChip(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-[#F2F4F7] ${
                      selectedRating === opt ? "text-[var(--primary)]" : "text-[#101828]"
                    }`}
                  >
                    {opt}
                    {selectedRating === opt && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Выезд на дом */}
          <button
            onClick={() => setOnlyHomeVisit(!onlyHomeVisit)}
            className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${
              onlyHomeVisit
                ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
          >
            {onlyHomeVisit && <Check className="h-3 w-3" />}
            Выезд на дом
          </button>

          {/* Количество отделений */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenChip(openChip === "offices" ? null : "offices")
              }
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm ${
                selectedOffices !== "Любое"
                  ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                  : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
            >
              Количество отделений
              {selectedOffices !== "Любое" && (
                <span className="rounded-full bg-[var(--primary)] px-1.5 text-xs text-white">
                  {selectedOffices}
                </span>
              )}
              <ChevronDown className="h-3 w-3" />
            </button>

            {openChip === "offices" && (
              <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-lg border border-[#E4E7EC] bg-white p-1 shadow-md">
                {officesOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedOffices(opt);
                      setOpenChip(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-[#F2F4F7] ${
                      selectedOffices === opt ? "text-[var(--primary)]" : "text-[#101828]"
                    }`}
                  >
                    {opt}
                    {selectedOffices === opt && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Сброс */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Сбросить
            </button>
          )}
        </div>

        {/* СПИСОК */}
        {view === "list" && (
          <div className="mt-6 space-y-3">
            {sortedLabs.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#E4E7EC] bg-white p-12 text-center">
                <div className="text-[#667085]">
                  По выбранным фильтрам ничего не найдено
                </div>
                <button
                  onClick={resetFilters}
                  className="mt-3 text-sm text-[var(--primary)] hover:underline"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}

            {sortedLabs.map((lab) => (
              <Card
                key={lab.id}
                className="border-[#E4E7EC] transition hover:shadow-md"
              >
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <Link
                    href={`/labs/${lab.slug}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-2xl font-bold text-[var(--primary)]">
                      {lab.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-semibold text-[#101828]">
                          {lab.name}
                        </div>
                        {lab.homeVisit && (
                          <Badge
                            variant="secondary"
                            className="text-xs text-[var(--success-text)]"
                          >
                            Выезд на дом
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-[#667085]">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#F79009] text-[#F79009]" />
                          {lab.rating} ({lab.reviews})
                        </span>
                        <span>·</span>
                        <span>{lab.offices} отделений</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-[#667085]">
                        <MapPin className="h-3 w-3" />
                        {lab.cities}
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-4 md:flex-col md:items-end">
                    <div className="text-right">
                      <div className="text-xs text-[#667085]">от</div>
                      <div className="text-lg font-bold text-[#101828]">
                        {lab.priceFrom} ₽
                      </div>
                      <div className="text-xs text-[#667085]">
                        Актуально: {lab.actualOn}
                      </div>
                    </div>
                    <Link href={`/labs/${lab.slug}`}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {view === "map" && (
          <div className="mt-6 overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
            <div className="flex h-[500px] items-center justify-center bg-[#F2F4F7]">
              <div className="text-center">
                <MapIcon className="mx-auto h-12 w-12 text-[#98A2B3]" />
                <div className="mt-3 text-[#667085]">
                  Карта лабораторий
                </div>
                <div className="mt-1 text-xs text-[#98A2B3]">
                  (заглушка — карта подключится позже)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}