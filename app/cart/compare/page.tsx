"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  AlertCircle,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useCart } from "@/lib/cart-context";
import { labs } from "@/data/mock";
import { getLabColor } from "@/lib/images";

type FilterKey = "all" | "duration" | "price" | "home";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "duration", label: "Срок" },
  { key: "price", label: "Цена" },
  { key: "home", label: "Выезд на дом" },
];

// Коэффициенты наценки лабораторий
const labMultipliers: Record<string, number> = {
  gemotest: 1.0,
  invitro: 1.15,
  kdl: 1.25,
  cmd: 1.1,
};

// Цена взятия биоматериала у каждой лаборатории
const labBiomaterialFee: Record<string, number> = {
  gemotest: 600,
  invitro: 600,
  kdl: 650,
  cmd: 500,
};

// Срок готовности у каждой лаборатории
const labDuration: Record<string, string> = {
  gemotest: "1–2 дня",
  invitro: "1–2 дня",
  kdl: "1–3 дня",
  cmd: "1–2 дня",
};

// Ссылки на внешние сайты лабораторий
const labWebsite: Record<string, string> = {
  gemotest: "https://gemotest.ru",
  invitro: "https://www.invitro.ru",
  kdl: "https://www.kdl.ru",
  cmd: "https://www.cmd-online.ru",
};

export default function ComparePage() {
  const { items, count } = useCart();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);

  // Базовая сумма из корзины
  const basePrice = items.reduce((sum, x) => sum + x.price, 0);

  // ПРЕДЛОЖЕНИЯ
  const offers = useMemo(() => {
    if (items.length === 0) return [];

    let list = labs.map((lab) => {
      const multiplier = labMultipliers[lab.slug] || 1;
      const researchPrice = Math.round(basePrice * multiplier);
      const biomaterial = labBiomaterialFee[lab.slug] || 600;
      const total = researchPrice + biomaterial;
      const duration = labDuration[lab.slug] || "1–2 дня";

      return {
        lab,
        researchPrice,
        biomaterial,
        total,
        duration,
        available: true,
      };
    });

    // ФИЛЬТРЫ
    if (activeFilter === "home") {
      list = list.filter((o) => o.lab.homeVisit);
    }

    // СОРТИРОВКА
    if (activeFilter === "price") {
      list.sort((a, b) => a.total - b.total);
    } else if (activeFilter === "duration") {
      const days = (d: string) => {
        if (d.includes("1–2")) return 2;
        if (d.includes("1–3")) return 3;
        return 1;
      };
      list.sort((a, b) => days(a.duration) - days(b.duration));
    } else if (activeFilter === "all") {
      list.sort((a, b) => a.total - b.total);
    }

    return list;
  }, [items, basePrice, activeFilter]);

  // ПУСТАЯ КОРЗИНА
  if (items.length === 0) {
    return (
      <main className="bg-[#F8FAFC] min-h-screen">
        <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Корзина", href: "/cart" },
              { label: "Сравнение" },
            ]}
          />

          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFF6FF]">
              <ShoppingCart className="h-10 w-10 text-[#1677FF]" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#101828]">
              Сравнивать нечего
            </h1>
            <p className="mt-2 max-w-md text-[#667085]">
              Добавьте исследования в корзину — и мы покажем предложения
              лабораторий с ценами и сроками.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/catalog">
                <Button className="bg-[#1677FF] hover:bg-[#0969E8]">
                  Перейти в каталог
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline">Вернуться в корзину</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const selectedOffer = offers.find((o) => o.lab.id === selectedLabId);

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Корзина", href: "/cart" },
            { label: "Сравнение" },
          ]}
        />

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-[#101828] md:text-3xl">
            Сравнение стоимости
          </h1>
          <p className="mt-1 text-sm text-[#667085]">
            {count} {count === 1 ? "позиция" : "позиции"} в корзине ·
            стоимость исследований {basePrice} ₽
          </p>
        </div>

        {/* ФИЛЬТРЫ */}
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeFilter === f.key
                  ? "border-[#1677FF] bg-[#EFF6FF] text-[#1677FF] font-medium"
                  : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[#1677FF]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ТАБЛИЦА */}
        {offers.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[#E4E7EC] bg-white p-12 text-center">
            <div className="text-[#667085]">
              По выбранному фильтру лабораторий нет
            </div>
            <button
              onClick={() => setActiveFilter("all")}
              className="mt-3 text-sm text-[#1677FF] hover:underline"
            >
              Сбросить фильтр
            </button>
          </div>
        ) : (
          <Card className="mt-6 overflow-hidden border-[#E4E7EC]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#E4E7EC] bg-[#F8FAFC]">
                      <th className="px-4 py-4 text-left text-sm font-medium text-[#667085]">
                        &nbsp;
                      </th>
                      {offers.map((o) => (
                        <th key={o.lab.id} className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                              style={{
                                backgroundColor: getLabColor(o.lab.slug),
                              }}
                            >
                              {o.lab.name[0]}
                            </div>
                            <div className="font-semibold text-[#101828]">
                              {o.lab.name}
                            </div>
                            <div className="text-xs text-[#667085]">
                              ★ {o.lab.rating} ({o.lab.reviews})
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E4E7EC]">
                      <td className="px-4 py-3 text-sm text-[#667085]">
                        Стоимость исследований
                      </td>
                      {offers.map((o) => (
                        <td
                          key={o.lab.id}
                          className="px-4 py-3 text-center text-sm font-medium text-[#101828]"
                        >
                          {o.researchPrice} ₽
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-[#E4E7EC]">
                      <td className="px-4 py-3 text-sm text-[#667085]">
                        Взятие биоматериала
                      </td>
                      {offers.map((o) => (
                        <td
                          key={o.lab.id}
                          className="px-4 py-3 text-center text-sm text-[#101828]"
                        >
                          {o.biomaterial} ₽
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-[#E4E7EC] bg-[#F8FAFC]">
                      <td className="px-4 py-4 text-sm font-semibold text-[#101828]">
                        Итого
                      </td>
                      {offers.map((o) => (
                        <td
                          key={o.lab.id}
                          className="px-4 py-4 text-center text-lg font-bold text-[#101828]"
                        >
                          {o.total} ₽
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-[#E4E7EC]">
                      <td className="px-4 py-3 text-sm text-[#667085]">
                        Срок готовности
                      </td>
                      {offers.map((o) => (
                        <td
                          key={o.lab.id}
                          className="px-4 py-3 text-center text-sm text-[#101828]"
                        >
                          {o.duration}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-[#E4E7EC]">
                      <td className="px-4 py-3 text-sm text-[#667085]">
                        Доступность
                      </td>
                      {offers.map((o) => (
                        <td key={o.lab.id} className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 text-sm text-[#12B76A]">
                            <Check className="h-4 w-4" />
                            Все позиции
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-[#E4E7EC]">
                      <td className="px-4 py-3 text-sm text-[#667085]">
                        Выезд на дом
                      </td>
                      {offers.map((o) => (
                        <td
                          key={o.lab.id}
                          className="px-4 py-3 text-center text-sm text-[#101828]"
                        >
                          {o.lab.homeVisit ? "Есть" : "Нет"}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-[#E4E7EC]">
                      <td className="px-4 py-3 text-sm text-[#667085]">
                        Актуальность
                      </td>
                      {offers.map((o) => (
                        <td
                          key={o.lab.id}
                          className="px-4 py-3 text-center text-sm text-[#101828]"
                        >
                          {o.lab.actualOn}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="px-4 py-4">&nbsp;</td>
                      {offers.map((o) => {
                        const isSelected = selectedLabId === o.lab.id;
                        return (
                          <td key={o.lab.id} className="px-4 py-4 text-center">
                            <Button
                              className={
                                isSelected
                                  ? "bg-[#12B76A] hover:bg-[#0E9B58]"
                                  : "bg-[#1677FF] hover:bg-[#0969E8]"
                              }
                              onClick={() => setSelectedLabId(o.lab.id)}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Выбрано
                                </>
                              ) : (
                                "Выбрать"
                              )}
                            </Button>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ИТОГОВАЯ ПЛАШКА */}
        {selectedOffer && (
          <Card className="mt-6 border-[#E4E7EC] bg-[#EFF6FF]">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-medium uppercase text-[#1677FF]">
                  Выбрана лаборатория
                </div>
                <div className="mt-1 text-xl font-bold text-[#101828]">
                  {selectedOffer.lab.name}
                </div>
                <div className="mt-1 text-sm text-[#475467]">
                  Итого: {selectedOffer.total} ₽ · {selectedOffer.duration}
                </div>
              </div>

              <a
                href={labWebsite[selectedOffer.lab.slug] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1677FF] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0969E8]"
              >
                Перейти к оформлению
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        )}

        {/* КНОПКА БЕЗ ВЫБОРА */}
        {!selectedOffer && offers.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 text-sm text-[#667085]">
              <AlertCircle className="h-4 w-4 text-[#F79009]" />
              Выберите лабораторию, чтобы перейти к оформлению
            </div>
            <Link href="/cart">
              <Button variant="outline">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Вернуться в корзину
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}