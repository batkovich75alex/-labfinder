"use client";

import Link from "next/link";
import {
  Search,
  Droplet,
  Heart,
  FileText,
  BarChart3,
  Grid3x3,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { articles } from "@/data/mock";

const categories = [
  { id: "analyses", name: "Анализы", count: 1250, icon: Droplet },
  { id: "diseases", name: "Заболевания", count: 880, icon: Heart },
  { id: "preparation", name: "Подготовка", count: 420, icon: FileText },
  { id: "decoding", name: "Расшифровка", count: 350, icon: BarChart3 },
  { id: "all", name: "Все рубрики", count: 0, icon: Grid3x3 },
];

export default function LibraryPage() {
  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Библиотека" },
          ]}
        />

        <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#F2F4F7] p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#101828] md:text-4xl">
                Медицинская библиотека
              </h1>
              <p className="mt-2 max-w-xl text-[#475467]">
                Проверенные статьи об анализах, заболеваниях, подготовке и
                расшифровке результатов
              </p>
            </div>
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <BookOpen className="h-12 w-12 text-[#1677FF]" />
            </div>
          </div>

          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
            <Input
              placeholder="Поиск по библиотеке..."
              className="h-11 border-[#E4E7EC] bg-white pl-9"
            />
          </div>
        </div>

        <section className="mt-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/library/${cat.id}`}
                  className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
                    <Icon className="h-6 w-6 text-[#1677FF]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#101828]">
                      {cat.name}
                    </div>
                    {cat.count > 0 && (
                      <div className="mt-1 text-xs text-[#667085]">
                        {cat.count} статей
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#101828]">
              Популярные статьи
            </h2>
            <Link
              href="/library/all"
              className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline"
            >
              Смотреть все <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {articles.map((art) => (
              <Card
                key={art.id}
                className="border-[#E4E7EC] transition hover:shadow-md"
              >
                <CardContent className="p-0">
                  <div className="h-40 rounded-t-xl bg-gradient-to-br from-[#EFF6FF] to-[#F2F4F7]" />
                  <div className="p-5">
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {art.category}
                    </Badge>
                    <Link href={`/library/${art.slug}`}>
                      <h3 className="font-semibold text-[#101828] hover:text-[#1677FF]">
                        {art.title}
                      </h3>
                    </Link>
                    <p className="mt-2 line-clamp-2 text-sm text-[#667085]">
                      {art.excerpt}
                    </p>
                    <div className="mt-3 flex gap-3 text-xs text-[#667085]">
                      <span>{art.date}</span>
                      <span>·</span>
                      <span>{art.readingTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <Card className="border-[#E4E7EC]">
            <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#EFF6FF] text-2xl font-bold text-[#1677FF]">
                  А–Я
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#101828]">
                    Алфавитный справочник
                  </h2>
                  <p className="mt-1 text-sm text-[#667085]">
                    Термины, анализы и заболевания в алфавитном порядке
                  </p>
                </div>
              </div>

              <Link href="/library/alphabet">
                <Button
                  variant="outline"
                  className="border-[#1677FF] text-[#1677FF] hover:bg-[#EFF6FF]"
                >
                  Перейти к справочнику
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 pb-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#101828]">
              Свежие материалы
            </h2>
            <Link
              href="/library/all"
              className="flex items-center gap-1 text-sm text-[#1677FF] hover:underline"
            >
              Смотреть все <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {articles.map((art) => (
              <Card
                key={art.id}
                className="border-[#E4E7EC] transition hover:shadow-md"
              >
                <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-[#EFF6FF]" />
                    <div>
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {art.category}
                      </Badge>
                      <Link href={`/library/${art.slug}`}>
                        <h3 className="font-semibold text-[#101828] hover:text-[#1677FF]">
                          {art.title}
                        </h3>
                      </Link>
                      <div className="mt-1 flex gap-3 text-xs text-[#667085]">
                        <span>{art.date}</span>
                        <span>·</span>
                        <span>{art.readingTime}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/library/${art.slug}`}>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}