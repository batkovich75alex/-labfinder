"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, FormEvent } from "react";
import {
  MapPin,
  Search,
  Heart,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";
import { useCity } from "@/lib/use-city";
import { cities } from "@/data/mock";

const navItems = [
  { label: "Анализы", href: "/catalog" },
  { label: "Чекапы и комплексы", href: "/complexes" },
  { label: "Лаборатории", href: "/labs" },
  { label: "Библиотека", href: "/library" },
];

export function Header() {
  const { count } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [mobileCityOpen, setMobileCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useCity();
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    mobileCloseRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
      if (event.key === "Tab" && mobileMenuPanelRef.current) {
        const focusable = Array.from(mobileMenuPanelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'));
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
      mobileMenuTriggerRef.current?.focus();
    };
  }, [mobileMenuOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setCityOpen(false);
    setMobileCityOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-2 px-4 md:gap-6 md:px-6">
          <button
            ref={mobileMenuTriggerRef}
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-[#F2F4F7] lg:hidden"
            aria-label="Меню"
          >
            <Menu className="h-5 w-5 text-[#101828]" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-[var(--primary)] md:text-xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
              L
            </div>
            <span className="hidden sm:inline">LabFinder</span>
          </Link>

          {/* ГОРОД Desktop */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setCityOpen(!cityOpen)}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[#101828] hover:bg-[#F2F4F7]"
              aria-expanded={cityOpen}
              aria-controls="desktop-city-list"
            >
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
              {selectedCity}
              <ChevronDown className="h-4 w-4 text-[#667085]" />
            </button>

            {cityOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCityOpen(false)}
                />
                <div id="desktop-city-list" className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-[#E4E7EC] bg-white p-2 shadow-lg">
                  <div className="px-2 py-1.5 text-xs font-medium uppercase text-[#98A2B3]">
                    Выберите город
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city.name)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-[#101828] hover:bg-[#F2F4F7]"
                    >
                      {city.name}
                      {selectedCity === city.name && (
                        <Check className="h-4 w-4 text-[var(--primary)]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-[#475467] hover:bg-[#F2F4F7] hover:text-[#101828]"
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

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

          {/* ИКОНКИ — прижаты вправо на mobile */}
          <div className="ml-auto flex items-center gap-0.5 md:ml-0 md:gap-1">
            {/* Поиск — mobile */}
            <Link
              href="/search"
              className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-[#F2F4F7] md:hidden"
              aria-label="Поиск"
            >
              <Search className="h-5 w-5 text-[#475467]" />
            </Link>

            {/* Сердце — desktop */}
            <button
              className="hidden h-11 w-11 items-center justify-center rounded-md hover:bg-[#F2F4F7] sm:flex"
              aria-label="Избранное"
            >
              <Heart className="h-5 w-5 text-[#475467]" />
            </button>

            {/* КОРЗИНА — теперь с увеличенным тап-таргетом */}
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-md transition hover:bg-[#F2F4F7]"
              aria-label={count > 0 ? `Корзина, ${count} позиций` : "Корзина"}
            >
              <ShoppingCart className="h-5 w-5 text-[#475467]" />
              {count > 0 && (
                <span className="pointer-events-none absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F04438] text-xs font-medium text-white">
                  {count}
                </span>
              )}
            </Link>

            {/* Войти — desktop */}
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
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div ref={mobileMenuPanelRef} className="absolute left-0 top-0 h-full w-[min(300px,calc(100vw-2rem))] bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-[#E4E7EC] px-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-bold text-[var(--primary)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
                  L
                </div>
                <span id="mobile-menu-title">LabFinder</span>
              </Link>
              <button
                ref={mobileCloseRef}
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-[#F2F4F7]"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              {/* ГОРОД в мобильном меню */}
              <div className="mb-4 rounded-md border border-[#E4E7EC]">
                <button
                  onClick={() => setMobileCityOpen(!mobileCityOpen)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm"
                  aria-expanded={mobileCityOpen}
                >
                  <span className="flex items-center gap-2 text-[#101828]">
                    <MapPin className="h-4 w-4 text-[var(--primary)]" />
                    {selectedCity}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#667085] transition-transform ${
                      mobileCityOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileCityOpen && (
                  <div className="border-t border-[#E4E7EC] p-1">
                    {cities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city.name)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-[#101828] hover:bg-[#F2F4F7]"
                      >
                        {city.name}
                        {selectedCity === city.name && (
                          <Check className="h-4 w-4 text-[var(--primary)]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm text-[#101828] hover:bg-[#F2F4F7]"
                    aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

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
