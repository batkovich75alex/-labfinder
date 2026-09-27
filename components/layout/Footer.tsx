import Link from "next/link";
import { Share2, Send, Globe, Mail, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const columns = [
  {
    title: "Каталог",
    links: [
      { label: "Анализы", href: "/catalog" },
      { label: "Чекапы и комплексы", href: "/complexes" },
      { label: "Лаборатории", href: "/labs" },
      { label: "Библиотека", href: "/library" },
    ],
  },
  {
    title: "Услуги",
    links: [
      { label: "Диагностика", href: "/diagnostics" },
      { label: "Услуги на дому", href: "/home" },
      { label: "Корпоративные программы", href: "/corporate" },
      { label: "Отзывы", href: "/reviews" },
      { label: "Вакансии", href: "/jobs" },
    ],
  },
  {
    title: "О проекте",
    links: [
      { label: "Как это работает", href: "/how" },
      { label: "Контакты", href: "/contacts" },
      { label: "Новости", href: "/news" },
      { label: "Всё о нас", href: "/about" },
    ],
  },
  {
    title: "Документы",
    links: [
      { label: "Пользовательское соглашение", href: "/terms" },
      { label: "Политика конфиденциальности", href: "/privacy" },
      { label: "Обработка персональных данных", href: "/data" },
      { label: "Согласие на обработку", href: "/consent" },
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1677FF] text-white">
                L
              </div>
              LabFinder
            </Link>
            <p className="mt-3 text-sm text-white/70">
              Анализы и обследования в лабораториях вашего города
            </p>
            <div className="mt-4 flex gap-2">
              <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Share2 className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Send className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-white">{col.title}</div>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white"
                    >
                      {link.label}
                    </Link>
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
                className="border-white/20 bg-white/5 pl-9 text-white placeholder:text-white/50"
              />
            </div>
            <Button className="bg-[#1677FF] hover:bg-[#0969E8]">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <div>© 2024 LabFinder. Все права защищены.</div>
          <div className="flex gap-6">
            <Link href="/sitemap" className="hover:text-white">Карта сайта</Link>
            <Link href="/accessibility" className="hover:text-white">Доступность</Link>
            <Link href="/feedback" className="hover:text-white">Обратная связь</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}