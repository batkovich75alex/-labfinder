"use client";

import Link from "next/link";
import { Trash2, ShoppingCart, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, clearCart, total, count } = useCart();

  // ПУСТАЯ КОРЗИНА
  if (items.length === 0) {
    return (
      <main className="bg-[#F8FAFC] min-h-screen">
        <div className="mx-auto max-w-[1280px] px-6 py-6">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Корзина" },
            ]}
          />

          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFF6FF]">
              <ShoppingCart className="h-10 w-10 text-[#1677FF]" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#101828]">
              Ваша корзина пуста
            </h1>
            <p className="mt-2 max-w-md text-[#667085]">
              Добавьте исследования из каталога, карточек или поиска,
              чтобы сравнить цены в лабораториях.
            </p>

            <div className="mt-6 flex gap-3">
              <Link href="/catalog">
                <Button className="bg-[#1677FF] hover:bg-[#0969E8]">
                  Перейти в каталог
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline">Популярные анализы</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // КОРЗИНА С ТОВАРАМИ
  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Корзина" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#101828]">Корзина</h1>
            <p className="mt-1 text-sm text-[#667085]">
              {count} {count === 1 ? "позиция" : count < 5 ? "позиции" : "позиций"} в корзине
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <Check className="mr-2 h-4 w-4" />
              Выбрать все
            </Button>
            <Button variant="outline" size="sm">
              Удалить выбранные
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-[#F04438] hover:bg-[#FEF3F2] hover:text-[#F04438]"
              onClick={clearCart}
            >
              Очистить корзину
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* СПИСОК ПОЗИЦИЙ */}
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="border-[#E4E7EC]">
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Чекбокс */}
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#D0D5DD] text-[#1677FF]"
                  />

                  {/* Картинка */}
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-[#EFF6FF]" />

                  {/* Инфо */}
                  <div className="flex-1">
                    <div className="text-xs text-[#667085]">
                      {item.type === "complex" ? "Комплекс" : "Анализ"}
                    </div>
                    <Link
                      href={
                        item.type === "complex"
                          ? `/complexes/${item.id}`
                          : `/catalog/${item.id}`
                      }
                      className="font-medium text-[#101828] hover:text-[#1677FF]"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 text-xs text-[#667085]">
                      {item.duration}
                    </div>
                  </div>

                  {/* Цена */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#101828]">
                      {item.price} ₽
                    </div>
                  </div>

                  {/* Удалить */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-md p-2 text-[#667085] hover:bg-[#FEF3F2] hover:text-[#F04438]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ИТОГОВАЯ КАРТОЧКА */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-[#E4E7EC]">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-[#101828]">
                  Итого
                </h2>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">
                      Исследований ({count})
                    </span>
                    <span className="font-medium text-[#101828]">
                      {total} ₽
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">
                      Взятие биоматериала
                    </span>
                    <span className="font-medium text-[#101828]">
                      +250 ₽
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#E4E7EC] pt-2">
                    <span className="font-medium text-[#101828]">Итого</span>
                    <span className="text-xl font-bold text-[#101828]">
                      {total + 250} ₽
                    </span>
                  </div>
                </div>

                <Link href="/cart/compare">
                  <Button className="mt-4 w-full bg-[#1677FF] hover:bg-[#0969E8]">
                    Сравнить лаборатории
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="mt-3 text-center text-xs text-[#667085]">
                  Цены в Москве, актуальны на 27.09.2026
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}