"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { labs } from "@/data/mock";
import { getLabColor } from "@/lib/images";

type Props = {
  params: Promise<{ slug: string }>;
};

// Реальные сайты лабораторий
const labWebsites: Record<string, string> = {
  gemotest: "https://gemotest.ru",
  invitro: "https://www.invitro.ru",
  kdl: "https://www.kdl.ru",
  cmd: "https://www.cmd-online.ru",
};

// Отделения по лабораториям
const labOffices: Record<string, Array<{
  id: number;
  address: string;
  metro: string;
  hours: string;
  biomaterial: string;
  homeVisit: boolean;
  open: boolean;
}>> = {
  gemotest: [
    {
      id: 1,
      address: "ул. Тверская, 12",
      metro: "Тверская · 200 м",
      hours: "Пн–Пт: 7:00–20:00 · Сб: 8:00–18:00 · Вс: выходной",
      biomaterial: "Пн–Пт: 7:00–18:00 · Сб: 8:00–16:00",
      homeVisit: true,
      open: true,
    },
    {
      id: 2,
      address: "ул. Ленина, 5",
      metro: "Охотный Ряд · 350 м",
      hours: "Пн–Пт: 8:00–20:00 · Сб: 9:00–17:00 · Вс: выходной",
      biomaterial: "Пн–Пт: 8:00–17:00 · Сб: 9:00–15:00",
      homeVisit: false,
      open: true,
    },
    {
      id: 3,
      address: "ул. Мира, 28",
      metro: "Алексеевская · 400 м",
      hours: "Пн–Пт: 8:00–21:00 · Сб: 9:00–18:00 · Вс: 9:00–15:00",
      biomaterial: "Пн–Пт: 8:00–18:00 · Сб: 9:00–16:00",
      homeVisit: true,
      open: false,
    },
  ],
  invitro: [
    {
      id: 1,
      address: "Ленинский пр-т, 45",
      metro: "Ленинский пр-т · 300 м",
      hours: "Пн–Пт: 7:30–20:00 · Сб: 8:00–17:00 · Вс: выходной",
      biomaterial: "Пн–Пт: 7:30–17:00 · Сб: 8:00–15:00",
      homeVisit: true,
      open: true,
    },
    {
      id: 2,
      address: "ул. Арбат, 10",
      metro: "Арбатская · 250 м",
      hours: "Пн–Пт: 8:00–20:00 · Сб: 9:00–18:00 · Вс: 9:00–15:00",
      biomaterial: "Пн–Пт: 8:00–18:00 · Сб: 9:00–16:00",
      homeVisit: false,
      open: true,
    },
  ],
  kdl: [
    {
      id: 1,
      address: "ул. Мира, 76",
      metro: "Проспект Мира · 400 м",
      hours: "Пн–Пт: 7:00–20:00 · Сб: 8:00–18:00 · Вс: 8:00–16:00",
      biomaterial: "Пн–Пт: 7:00–18:00 · Сб: 8:00–16:00",
      homeVisit: false,
      open: true,
    },
  ],
  cmd: [
    {
      id: 1,
      address: "ул. Вавилова, 20",
      metro: "Ленинский пр-т · 500 м",
      hours: "Пн–Пт: 7:30–20:00 · Сб: 8:00–18:00 · Вс: выходной",
      biomaterial: "Пн–Пт: 7:30–18:00 · Сб: 8:00–16:00",
      homeVisit: true,
      open: true,
    },
  ],
};

export default function LabPage({ params }: Props) {
  const { slug } = use(params);
  const lab = labs.find((l) => l.slug === slug);

  if (!lab) {
    notFound();
  }

  const website = labWebsites[lab.slug] || "#";
  const offices = labOffices[lab.slug] || [];
  const brandColor = getLabColor(lab.slug);

  // Ссылка на Яндекс.Карты с адресом
  const mapUrl = (address: string) =>
    `https://yandex.ru/maps/?text=${encodeURIComponent("Москва, " + address)}`;

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Лаборатории", href: "/labs" },
            { label: lab.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {/* Заголовок */}
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl text-3xl font-bold text-white"
                style={{ backgroundColor: brandColor }}
              >
                {lab.name[0]}
              </div>
              <div>
                <h1 className="type-h1 text-[#101828]">
                  {lab.name}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#667085]">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#F79009] text-[#F79009]" />
                    <span className="font-medium text-[#101828]">
                      {lab.rating}
                    </span>{" "}
                    ({lab.reviews} отзывов)
                  </span>
                  {lab.homeVisit && (
                    <Badge
                      variant="secondary"
                      className="text-xs text-[var(--success-text)]"
                    >
                      Выезд на дом
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* О лаборатории */}
            <section className="mt-8">
              <h2 className="type-h2 text-[#101828]">
                О лаборатории
              </h2>
              <p className="mt-3 text-[#475467]">
                {lab.name} — одна из крупнейших лабораторных сетей в России.
                Широкий спектр исследований, современные технологии и высокие
                стандарты качества.
              </p>
            </section>

            {/* Отделения */}
            <section className="mt-8">
              <h2 className="type-h2 text-[#101828]">
                Отделения в Москве
              </h2>

              <div className="mt-4 space-y-3">
                {offices.map((o) => (
                  <Card key={o.id} className="border-[#E4E7EC]">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[var(--primary)]" />
                            <span className="font-medium text-[#101828]">
                              {o.address}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-[#667085]">
                            {o.metro}
                          </div>

                          <div className="mt-3 space-y-1 text-sm">
                            <div className="flex items-start gap-2">
                              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#667085]" />
                              <div>
                                <div className="text-[#101828]">
                                  Часы работы отделения
                                </div>
                                <div className="text-[#667085]">{o.hours}</div>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
                              <div>
                                <div className="text-[#101828]">
                                  Время приёма биоматериала
                                </div>
                                <div className="text-[#667085]">
                                  {o.biomaterial}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {o.homeVisit && (
                              <Badge
                                variant="secondary"
                                className="text-xs text-[var(--success-text)]"
                              >
                                Выезд на дом
                              </Badge>
                            )}
                            {o.open ? (
                              <Badge
                                variant="secondary"
                                className="text-xs text-[var(--success-text)]"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Открыто
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-xs text-[#F04438]"
                              >
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Закрыто
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 md:flex-col">
                          <a
                            href={mapUrl(o.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#475467] transition hover:bg-[#F2F4F7] md:flex-none"
                          >
                            <MapPin className="h-4 w-4" />
                            На карте
                          </a>
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--primary)] bg-white px-3 py-2 text-sm text-[var(--primary)] transition hover:bg-[var(--primary-light)] md:flex-none"
                          >
                            <Calendar className="h-4 w-4" />
                            Записаться
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <button className="mt-4 text-sm text-[var(--primary)] hover:underline">
                Показать все {lab.offices} отделений →
              </button>
            </section>
          </div>

          {/* Правая колонка */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-[#E4E7EC]">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm text-[var(--success-text)]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Актуально на {lab.actualOn}</span>
                </div>

                <div className="mt-3 text-xs text-[#667085]">
                  Цены и наличие услуг обновлены лабораторией
                </div>

                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
                >
                  Перейти на сайт
                  <ExternalLink className="h-4 w-4" />
                </a>

                <div className="mt-4 space-y-2 border-t border-[#E4E7EC] pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Отделений</span>
                    <span className="font-medium text-[#101828]">
                      {lab.offices}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Рейтинг</span>
                    <span className="font-medium text-[#101828]">
                      ⭐ {lab.rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Выезд на дом</span>
                    <span className="font-medium text-[#101828]">
                      {lab.homeVisit ? "Есть" : "Нет"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}