"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Droplet,
  Clock,
  Heart,
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

const sortOptions = ["По популярности", "По цене", "По сроку", "По алфавиту"];

export default function CatalogPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("По популярности");
  const { toggleItem, isInCart } = useCart();

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Москва", href: "/?city=msk" },
            { label: "Анализы" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#101828]">Анализы</h1>
            <p className="mt-1 text-sm text-[#667085]">
              Найдено {analyses.length} исследований
            </p>
          </div>

          <div className="flex items-center gap-3">
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
                {selectedSort}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {sortOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-[#E4E7EC] bg-white py-1 shadow-md">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#F2F4F7] ${
                        selectedSort === option ? "text-[#1677FF]" : "text-[#101828]"
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
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                <Input placeholder="Поиск анализов" className="pl-9 h-9 text-sm" />
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
            <div className="mb-4 flex flex-wrap gap-2">
              {["Цена", "Срок выполнения", "Биоматериал", "Метод"].map((f) => (
                <button
                  key={f}
                  className="flex items-center gap-1 rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 text-sm text-[#475467] hover:border-[#1677FF] hover:text-[#1677FF]"
                >
                  {f}
                  <ChevronDown className="h-3 w-3" />
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {analyses.map((a) => {
                const inCart = isInCart(a.id);

                return (
                  <Card
                    key={a.id}
                    className="border-[#E4E7EC] transition hover:shadow-md"
                  >
                    <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                      <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-[#EFF6FF]" />

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

                      <div className="flex items-center gap-4 md:flex-col md:items-end">
                        <div className="text-right">
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