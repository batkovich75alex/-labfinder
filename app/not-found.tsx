import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC] px-4">
      <div className="text-center">
        <div className="text-7xl font-bold text-[var(--primary)]">404</div>
        <h1 className="type-h1 mt-4 text-[#101828]">
          Страница не найдена
        </h1>
        <p className="mt-2 max-w-md text-[#667085]">
          Возможно, страница была удалена или адрес введён неверно.
        </p>

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
      </div>
    </main>
  );
}