"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingCart, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useCart, type CartItem } from "@/lib/cart-context";
import { analyses, complexes } from "@/data/mock";
import { useCity } from "@/lib/use-city";

export default function CartPage() {
  const { items, addItem, removeItem, clearCart, total, count } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [removedItems, setRemovedItems] = useState<CartItem[]>([]);
  const [city] = useCity();

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((x) => x.id));
    }
  };

  const removeSelected = () => {
    setRemovedItems(items.filter((item) => selectedIds.includes(item.id)));
    selectedIds.forEach((id) => removeItem(id));
    setSelectedIds([]);
  };

  const removeWithUndo = (removed: CartItem[]) => {
    setRemovedItems(removed);
    removed.forEach((item) => removeItem(item.id));
    setSelectedIds((prev) => prev.filter((id) => !removed.some((item) => item.id === id)));
  };

  const undoRemoval = () => {
    removedItems.forEach(addItem);
    setRemovedItems([]);
  };

  if (items.length === 0) {
    return (
      <main className="bg-[#F8FAFC] min-h-screen">
        <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Корзина" },
            ]}
          />

          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary-light)]">
              <ShoppingCart className="h-10 w-10 text-[var(--primary)]" />
            </div>

            <h1 className="type-h1 mt-6 text-[#101828]">
              В корзине пока нет исследований
            </h1>
            <p className="mt-2 max-w-md text-[#667085]">
              Добавьте анализы или комплекс, чтобы сравнить предложения лабораторий.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/catalog">
                <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
                  Найти анализы
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline">Популярные анализы</Button>
              </Link>
            </div>
          </div>
          {removedItems.length > 0 && (
            <div role="status" className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center justify-between gap-4 rounded-xl bg-[#101828] p-4 text-sm text-white shadow-xl">
              <span>{removedItems.length === 1 ? "Позиция удалена" : `Удалено позиций: ${removedItems.length}`}</span>
              <button onClick={undoRemoval} className="min-h-11 font-semibold text-[#B2DDFF]">Отменить</button>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Корзина" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="type-h1 text-[#101828]">
              Корзина
            </h1>
            <p className="mt-1 text-sm text-[#667085]">
              {count}{" "}
              {count === 1
                ? "позиция"
                : count < 5
                ? "позиции"
                : "позиций"}{" "}
              в корзине
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleSelectAll}>
              <Check className="mr-2 h-4 w-4" />
              {allSelected ? "Снять выбор" : "Выбрать все"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedIds.length === 0}
              onClick={removeSelected}
            >
              Удалить выбранные ({selectedIds.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-[#F04438] hover:bg-[#FEF3F2] hover:text-[#F04438]"
              onClick={() => {
                setRemovedItems(items);
                clearCart();
                setSelectedIds([]);
              }}
            >
              Очистить корзину
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const href =
                item.type === "complex"
                  ? `/complexes/${item.slug}`
                  : `/catalog/${item.slug}`;

              return (
                <Card
                  key={item.id}
                  className={`border-[#E4E7EC] transition ${
                    isSelected ? "ring-2 ring-[var(--primary)]" : ""
                  }`}
                >
                  <CardContent className="grid grid-cols-[auto_1fr_auto] items-start gap-3 p-4 md:grid-cols-[auto_64px_1fr_auto_auto] md:items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      className="h-4 w-4 cursor-pointer rounded border-[#D0D5DD] text-[var(--primary)] focus:ring-[var(--primary)]"
                      aria-label={`Выбрать ${item.name}`}
                    />

                    <Link
                      href={href}
                      className="hidden h-16 w-16 flex-shrink-0 rounded-lg bg-[var(--primary-light)] md:block"
                    />

                    <div className="flex-1">
                      <div className="text-xs text-[#667085]">
                        {item.type === "complex" ? "Комплекс" : "Анализ"}
                      </div>
                      <Link
                        href={href}
                        className="font-medium text-[#101828] hover:text-[var(--primary)]"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1 text-xs text-[#667085]">
                        {item.duration}
                      </div>
                      {item.selectedLabName && <div className="mt-1 text-xs font-medium text-[var(--primary)]">Выбрано: {item.selectedLabName}</div>}
                      {item.type === "complex" && (() => {
                        const complex = complexes.find((entry) => entry.id === item.id);
                        const included = complex?.includes.map((id) => analyses.find((analysis) => analysis.id === id)?.name).filter(Boolean) || [];
                        return <details className="mt-2 text-sm text-[#475467]"><summary className="cursor-pointer font-medium text-[var(--primary)]">Состав комплекса ({included.length})</summary><ul className="mt-2 list-disc space-y-1 pl-5">{included.map((name) => <li key={name}>{name}</li>)}</ul></details>;
                      })()}
                    </div>

                    <div className="text-right">
                      <div className="price-m text-[#101828]">
                        {item.price} ₽
                      </div>
                      <div className="text-xs text-[#667085]">ориентировочно</div>
                    </div>

                    <button
                      onClick={() => {
                        removeWithUndo([item]);
                      }}
                      className="rounded-md p-2 text-[#667085] transition hover:bg-[#FEF3F2] hover:text-[#F04438]"
                      aria-label={`Удалить ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-[#E4E7EC]">
              <CardContent className="p-5">
                <h2 className="type-h2 text-[#101828]">Предварительная стоимость исследований</h2>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">
                      Исследований ({count})
                    </span>
                    <span className="font-medium text-[#101828]">{total} ₽</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E4E7EC] pt-2">
                    <span className="font-medium text-[#101828]">Предварительно</span>
                    <span className="text-xl font-bold text-[#101828]">
                      {total.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#667085]">Точная сумма зависит от лаборатории и платы за взятие биоматериала.</p>

                <Link href="/cart/compare">
                  <Button className="mt-4 w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
                    Сравнить лаборатории
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="mt-3 text-center text-xs text-[#667085]">
                  Демонстрационные цены для города {city}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
      {removedItems.length > 0 && (
        <div role="status" className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center justify-between gap-4 rounded-xl bg-[#101828] p-4 text-sm text-white shadow-xl">
          <span>{removedItems.length === 1 ? "Позиция удалена" : `Удалено позиций: ${removedItems.length}`}</span>
          <button onClick={undoRemoval} className="min-h-11 font-semibold text-[#B2DDFF]">Отменить</button>
        </div>
      )}
    </main>
  );
}
