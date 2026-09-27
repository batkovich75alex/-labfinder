"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { MapPin, Search, Heart, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { label: "Анализы", href: "/catalog" },
  { label: "Чекапы и комплексы", href: "/complexes" },
  { label: "Лаборатории", href: "/labs" },
  { label: "Библиотека", href: "/library" },
];

const mobileNavItems = [
  { label: "Анализы", href: "/catalog" },
  { label: "Чекапы и комплексы", href: "/complexes" },
  { label: "Лаборатории", href: "/labs" },
  { label: "Библиотека", href: "/library" },
];

const futureNavItems = [
  { label: "Диагностика", href: "/diagnostics" },
  { label: "Услуги на дому", href: "/home" },
  { label: "Корпоративные программы", href: "/corporate" },
  { label: "Отзывы", href: "/reviews" },
];

export function Header() {
  const { count } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-4 md:gap-6 md:px-6">
          {/* Бургер — только mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-md p-2 hover:bg-[#F2F4F7] lg:hidden"
            aria-label="Меню"
          >
            <Menu className="h-5 w-5 text-[#101828]" />
          </button>

          {/* Логотип */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-[#1677FF] md:text-xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1677FF] text-white">
              L
            </div>
            <span className="hidden sm:inline">LabFinder</span>
          </Link>

          {/* Город — только desktop */}
          <button className="hidden items-center gap-1 rounded-md px-3 py-2 text-sm text-[#101828] hover:bg-[#F2F4F7] lg:flex">
            <MapPin className="h-4 w-4 text-[#1677FF]" />
            Москва
            <ChevronDown className="h-4 w-4 text-[#667085]" />
          </button>

          {/* Навигация — только desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-[#475467] hover:bg-[#F2F4F7] hover:text-[#101828]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Поиск — скрыт на самых маленьких */}
          <form onSubmit={handleSubmit} className="hidden flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найдите анализ, комплекс или статью"
                className="pl-9"
              />
            </div>
          </form>

          {/* Иконки — прижаты вправо на mobile */}
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            {/* Иконка поиска — только mobile (открывает /search) */}
            <Link
              href="/search"
              className="rounded-md p-2 hover:bg-[#F2F4F7] md:hidden"
              aria-label="Поиск"
            >
              <Search className="h-5 w-5 text-[#475467]" />
            </Link>

            <button className="hidden rounded-md p-2 hover:bg-[#F2F4F7] sm:block">
              <Heart className="h-5 w-5 text-[#475467]" />
            </button>

            <Link
              href="/cart"
              className="relative rounded-md p-2 hover:bg-[#F2F4F7]"
            >
              <ShoppingCart className="h-5 w-5 text-[#475467]" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F04438] text-xs font-medium text-white">
                  {count}
                </span>
              )}
            </Link>

            <Button
              variant="ghost"
              className="hidden text-sm lg:inline-flex"
            >
              Войти
            </Button>
          </div>
        </div>
      </header>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Затемнение */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Выдвижное меню */}
          <div className="absolute left-0 top-0 h-full w-[300px] bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-[#E4E7EC] px-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-bold text-[#1677FF]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1677FF] text-white">
                  L
                </div>
                LabFinder
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 hover:bg-[#F2F4F7]"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              {/* Основные разделы */}
              <nav className="space-y-1">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm text-[#101828] hover:bg-[#F2F4F7]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Будущие разделы */}
              <div className="mt-6 border-t border-[#E4E7EC] pt-6">
                <div className="mb-2 px-3 text-xs font-medium uppercase text-[#98A2B3]">
                  Другие разделы
                </div>
                <nav className="space-y-1">
                  {futureNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-sm text-[#475467] hover:bg-[#F2F4F7]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Вход */}
              <div className="mt-6 border-t border-[#E4E7EC] pt-6">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Войти
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}