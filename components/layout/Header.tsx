"use client";

import Link from "next/link";
import { MapPin, Search, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Анализы", href: "/catalog" },
  { label: "Чекапы и комплексы", href: "/complexes" },
  { label: "Лаборатории", href: "/labs" },
  { label: "Библиотека", href: "/library" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E4E7EC] bg-white">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-6">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#1677FF]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1677FF] text-white">
            L
          </div>
          LabFinder
        </Link>

        {/* Город */}
        <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[#101828] hover:bg-[#F2F4F7]">
          <MapPin className="h-4 w-4 text-[#1677FF]" />
          Москва
          <ChevronDown className="h-4 w-4 text-[#667085]" />
        </button>

        {/* Навигация */}
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

        {/* Поиск */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
            <Input
              placeholder="Найдите анализ, комплекс или статью"
              className="pl-9"
            />
          </div>
        </div>

        {/* Действия */}
        <button className="rounded-md p-2 hover:bg-[#F2F4F7]">
          <Heart className="h-5 w-5 text-[#475467]" />
        </button>

        <button className="relative rounded-md p-2 hover:bg-[#F2F4F7]">
          <ShoppingCart className="h-5 w-5 text-[#475467]" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F04438] text-xs font-medium text-white">
            0
          </span>
        </button>

        <Button variant="ghost" className="text-sm">
          Войти
        </Button>
      </div>
    </header>
  );
}