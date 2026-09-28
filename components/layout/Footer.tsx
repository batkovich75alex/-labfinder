import Link from "next/link";
import { Share2, Send, Globe, Mail, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FooterLink = {
  label: string;
  href?: string;
  active: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const columns: FooterColumn[] = [
  {
    title: "Каталог",
    links: [
      { label: "Анализы", href: "/catalog", active: true },
      { label: "Чекапы и комплексы", href: "/complexes", active: true },
      { label: "Лаборатории", href: "/labs", active: true },
      { label: "Библиотека", href: "/library", active: true },
    ],
  },
  {
    title: "Услуги",
    links: [
      { label: "Диагностика", active: false },
      { label: "Услуги на дому", active: false },
      { label: "Корпоративные программы", active: false },
      { label: "Отзывы", active: false },
      { label: "Вакансии", active: false },
    ],
  },
  {
    title: "О проекте",
    links: [
      { label: "Как это работает", active: false },
      { label: "Контакты", active: false },
      { label: "Новости", active: false },
      { label: "Всё о нас", active: false },
    ],
  },
  {
    title: "Документы",
    links: [
      { label: "Пользовательское соглашение", active: false },
      { label: "Политика конфиденциальности", active: false },
      { label: "Обработка персональных данных", active: false },
      { label: "Согласие на обработку", active: false },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-[#0B1E3F] text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
                L
              </div>
              LabFinder
            </Link>
            <p className="mt-3 text-sm text-white/70">
              Анализы и обследования в лабораториях вашего города
            </p>
            <div className="mt-4 flex gap-2">
              <button
                className="rounded-full bg-white/10 p-2 opacity-60"
                aria-label="Поделиться"
                disabled
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                className="rounded-full bg-white/10 p-2 opacity-60"
                aria-label="Telegram"
                disabled
              >
                <Send className="h-4 w-4" />
              </button>
              <button
                className="rounded-full bg-white/10 p-2 opacity-60"
                aria-label="Сайт"
                disabled
              >
                <Globe className="h-4 w-4" />
              </button>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-white">
                {col.title}
              </div>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.active && link.href ? (
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-white/40">
                        {link.label}
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">
                          Скоро
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="text-sm font-semibold">Подписка на новости</div>
          <p className="mt-1 text-sm text-white/70">Только важные обновления</p>
          <div className="mt-3 flex max-w-md gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Ваш e-mail"
                disabled
                className="border-white/20 bg-white/5 pl-9 text-white placeholder:text-white/50"
              />
            </div>
            <Button
              disabled
              className="bg-[var(--primary)] opacity-60 hover:bg-[var(--primary-hover)]"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <div>© 2026 LabFinder. Демонстрационный проект.</div>
          <div className="flex gap-6">
            <span className="flex items-center gap-1 text-white/40">
              Карта сайта
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">
                Скоро
              </span>
            </span>
            <span className="flex items-center gap-1 text-white/40">
              Доступность
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">
                Скоро
              </span>
            </span>
            <span className="flex items-center gap-1 text-white/40">
              Обратная связь
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">
                Скоро
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
