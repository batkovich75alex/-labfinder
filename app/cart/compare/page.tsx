"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useCart } from "@/lib/cart-context";
import { labs } from "@/data/mock";

type FilterKey = "all" | "duration" | "price" | "home";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Все исследования" },
  { key: "duration", label: "Срок" },
  { key: "price", label: "Цена" },
  { key: "home", label: "Выезд на дом" },
];

export default function ComparePage() {
  const { items, count } = useCart();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const basePrice = items.reduce((sum, x) => sum + x.price, 0);

  // Моковые предложения для трёх лабораторий
  const offers = [
    {
      lab: labs[0],
      researchPrice: basePrice,
      biomaterial: 600,
      available: true,
      partial: false,
    },
    {
      lab: labs[1],
      researchPrice: basePrice + 270,
      biomaterial: 600,
      available: true,
      partial: true,
    },
    {
      lab: labs[2],
      researchPrice: basePrice + 660,
      biomaterial: 650,
      available: true,
      partial: false,
    },
  ];

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Корзина", href: "/cart" },
            { label: "Сравнение" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#101828]">
              Сравнение стоимости по лабораториям
            </h1>
            <p className="mt-1 text-sm text-[#667085]">
              {count} {count === 1 ? "позиция" : "позиции"} в корзине
            </p>
          </div>
        </div>

        {/* ФИЛЬТРЫ-ПЕРЕКЛЮЧАТЕЛИ */}
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeFilter === f.key
                  ? "border-[#1677FF] bg-[#EFF6FF] text-[#1677FF]"
                  : "border-[#E4E7EC] bg-white text-[#475467] hover:border-[#1677FF]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ТАБЛИЦА */}
        <Card className="mt-6 border-[#E4E7EC] overflow-hidden">
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
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-lg font-bold text-[#1677FF]">
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
                        {o.researchPrice + o.biomaterial} ₽
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
                        1–2 дня
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-[#E4E7EC]">
                    <td className="px-4 py-3 text-sm text-[#667085]">
                      Доступность
                    </td>
                    {offers.map((o) => (
                      <td key={o.lab.id} className="px-4 py-3 text-center">
                        {o.partial ? (
                          <span className="inline-flex items-center gap-1 text-sm text-[#F79009]">
                            <AlertCircle className="h-4 w-4" />
                            Частично
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm text-[#12B76A]">
                            <Check className="h-4 w-4" />
                            Все позиции
                          </span>
                        )}
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
                    {offers.map((o, i) => (
                      <td key={o.lab.id} className="px-4 py-4 text-center">
                        <Button
                          className={
                            i === 0
                              ? "bg-[#1677FF] hover:bg-[#0969E8]"
                              : "bg-[#1677FF] hover:bg-[#0969E8]"
                          }
                        >
                          Выбрать
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* КНОПКА ВНИЗУ */}
        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            className="bg-[#1677FF] px-8 hover:bg-[#0969E8]"
          >
            Перейти к оформлению на сайте лаборатории
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* ЕСЛИ КОРЗИНА ПУСТА */}
        {items.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-[#E4E7EC] bg-white p-12 text-center">
            <div className="text-[#667085]">
              Добавьте исследования в корзину, чтобы сравнить предложения.
            </div>
            <Link href="/catalog">
              <Button className="mt-4 bg-[#1677FF] hover:bg-[#0969E8]">
                Перейти в каталог
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}