import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-xl text-center">
        <div className="text-7xl font-bold text-[var(--primary)]">404</div>
        <h1 className="type-h1 mt-4 text-[#101828]">
          Страница не найдена
        </h1>
        <p className="mt-2 max-w-md text-[#667085]">
          Возможно, страница была удалена или адрес введён неверно.
        </p>

        <form action="/search" method="get" className="mx-auto mt-6 flex max-w-md gap-2">
          <label htmlFor="not-found-search" className="sr-only">Поиск по сайту</label>
          <input
            id="not-found-search"
            name="q"
            type="search"
            placeholder="Название анализа или код"
            className="h-12 min-w-0 flex-1 rounded-lg border border-[#D0D5DD] bg-white px-4 text-sm outline-none focus:border-[var(--primary)]"
          />
          <Button type="submit" className="h-12 bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
            Найти
          </Button>
        </form>

        <div className="mt-6 flex justify-center gap-3">
          <Link href="/">
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
              На главную
            </Button>
          </Link>
          <Link href="/catalog">
            <Button variant="outline">В каталог</Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          <Link href="/complexes" className="text-[var(--primary)] hover:underline">Комплексы</Link>
          <Link href="/labs" className="text-[var(--primary)] hover:underline">Лаборатории</Link>
          <Link href="/library" className="text-[var(--primary)] hover:underline">Библиотека</Link>
        </div>
      </div>
    </main>
  );
}
