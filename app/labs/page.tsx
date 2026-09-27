"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  List,
  Map as MapIcon,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { labs } from "@/data/mock";

const sortOptions = ["По популярности", "По рейтингу", "По количеству отделений", "По алфавиту"];

export default function LabsPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("По популярности");
  const [view, setView] = useState<"list" | "map">("list");

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Лаборатории" },
          ]}
        />

        {/* Заголовок */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#101828]">
              Лаборатории в Москве
            </h1>
            <p className="mt-1 text-sm text-[#667085]">
              Найдено {labs.length} лаборатории
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
            </Button>

            {/* Сортировка */}
            <div className="relative">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setSortOpen(!sortOpen)}
              >
                {selectedSort}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {sortOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg border border-[#E4E7EC] bg-white py-1 shadow-md">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#F2F4F7] ${
                        selectedSort === option
                          ? "text-[#1677FF]"
                          : "text-[#101828]"
                      }`}
                      onClick={() => {
                        setSelectedSort(option);
                        setSortOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Переключатель Список/Карта */}
            <div className="flex rounded-lg border border-[#E4E7EC] bg-white p-0.5">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                  view === "list"
                    ? "bg-[#1677FF] text-white"
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
                    ? "bg-[#1677FF] text-white"
                    : "text-[#475467]"
                }`}
              >
                <MapIcon className="h-4 w-4" />
                Карта
              </button>
            </div>
          </div>
        </div>

        {/* Фильтры-chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["Рейтинг", "Выезд на дом", "Количество отделений"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-1 rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 text-sm text-[#475467] hover:border-[#1677FF] hover:text-[#1677FF]"
            >
              {f}
              <ChevronDown className="h-3 w-3" />
            </button>
          ))}
        </div>

        {/* ЕСЛИ РЕЖИМ СПИСОК */}
        {view === "list" && (
          <div className="mt-6 space-y-3">
            {labs.map((lab) => (
              <Card
                key={lab.id}
                className="border-[#E4E7EC] transition hover:shadow-md"
              >
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <Link
                    href={`/labs/${lab.slug}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-2xl font-bold text-[#1677FF]">
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
                            className="text-xs text-[#12B76A]"
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

        {/* ЕСЛИ РЕЖИМ КАРТА — заглушка */}
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