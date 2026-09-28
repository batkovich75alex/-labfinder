"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, AlertTriangle, ArrowLeft, Check, MapPin, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { analyses, complexes, labs } from "@/data/mock";
import { useCart } from "@/lib/cart-context";
import { getLabColor } from "@/lib/images";
import { useCity } from "@/lib/use-city";

type SortKey = "price" | "duration" | "rating";

const labRules: Record<string, {
  multiplier: number;
  collectionFee: number;
  mandatoryFee: number;
  duration: string;
  durationDays: number;
  unavailableAnalysisIds: string[];
}> = {
  gemotest: { multiplier: 1, collectionFee: 300, mandatoryFee: 0, duration: "1–2 дня", durationDays: 2, unavailableAnalysisIds: [] },
  invitro: { multiplier: 1.12, collectionFee: 350, mandatoryFee: 0, duration: "1–2 дня", durationDays: 2, unavailableAnalysisIds: ["urinalysis"] },
  kdl: { multiplier: 1.08, collectionFee: 290, mandatoryFee: 100, duration: "2–3 дня", durationDays: 3, unavailableAnalysisIds: [] },
  cmd: { multiplier: 0.98, collectionFee: 350, mandatoryFee: 0, duration: "1–3 дня", durationDays: 3, unavailableAnalysisIds: ["cholesterol-total"] },
};

function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function positionWord(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return "позиция";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "позиции";
  return "позиций";
}

export default function ComparePage() {
  const router = useRouter();
  const { items, count, selectLab } = useCart();
  const [city] = useCity();
  const [onlyComplete, setOnlyComplete] = useState(false);
  const [sort, setSort] = useState<SortKey>("price");
  const basePrice = items.reduce((sum, item) => sum + item.price, 0);

  const requiredAnalysisIds = useMemo(() => Array.from(new Set(items.flatMap((item) => {
    if (item.type === "analysis") return [item.id];
    return complexes.find((complex) => complex.id === item.id)?.includes ?? [];
  }))), [items]);

  const allOffers = useMemo(() => {
    if (items.length === 0) return [];
    return labs.map((lab) => {
      const rule = labRules[lab.slug] ?? labRules.gemotest;
      const missingIds = requiredAnalysisIds.filter((id) => rule.unavailableAnalysisIds.includes(id));
      const missingNames = missingIds.map((id) => analyses.find((analysis) => analysis.id === id)?.name ?? id);
      const complete = missingIds.length === 0;
      const researchPrice = Math.round(basePrice * rule.multiplier);
      return {
        lab,
        complete,
        missingNames,
        researchPrice,
        collectionFee: rule.collectionFee,
        mandatoryFee: rule.mandatoryFee,
        total: complete ? researchPrice + rule.collectionFee + rule.mandatoryFee : null,
        duration: rule.duration,
        durationDays: rule.durationDays,
      };
    });
  }, [basePrice, items.length, requiredAnalysisIds]);

  const cheapestTotal = useMemo(() => {
    const totals = allOffers.filter((offer) => offer.complete && offer.total !== null).map((offer) => offer.total as number);
    return totals.length > 0 ? Math.min(...totals) : null;
  }, [allOffers]);

  const offers = useMemo(() => {
    const list = onlyComplete ? allOffers.filter((offer) => offer.complete) : [...allOffers];
    return list.sort((a, b) => {
      if (a.complete !== b.complete) return a.complete ? -1 : 1;
      if (sort === "duration") return a.durationDays - b.durationDays;
      if (sort === "rating") return b.lab.rating - a.lab.rating;
      return (a.total ?? Number.POSITIVE_INFINITY) - (b.total ?? Number.POSITIVE_INFINITY);
    });
  }, [allOffers, onlyComplete, sort]);

  function chooseLab(labId: string, labName: string, labSlug: string) {
    items.forEach((item) => selectLab(item.id, labId, labName));
    router.push(`/labs/${labSlug}`);
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Корзина", href: "/cart" }, { label: "Сравнение" }]} />
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary-light)]">
              <ShoppingCart className="h-10 w-10 text-[var(--primary)]" />
            </div>
            <h1 className="type-h1 mt-6 text-[#101828]">Сравнивать нечего</h1>
            <p className="mt-2 max-w-md text-[#667085]">Добавьте исследования в корзину — и мы покажем предложения лабораторий с ценами, доступностью и сроками.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/catalog"><Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)]">Перейти в каталог</Button></Link>
              <Link href="/cart"><Button variant="outline">Вернуться в корзину</Button></Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Корзина", href: "/cart" }, { label: "Сравнение" }]} />
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="type-h1 text-[#101828]">Сравнение лабораторий</h1>
            <p className="mt-2 text-sm text-[#667085]">{count} {positionWord(count)} в корзине · город {city}</p>
          </div>
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline">
            <ArrowLeft className="h-4 w-4" /> Изменить корзину
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-[#E4E7EC] bg-white p-4 md:flex md:items-center md:justify-between md:gap-6">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-[#344054]">
            <input type="checkbox" checked={onlyComplete} onChange={(event) => setOnlyComplete(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#D0D5DD] accent-[var(--primary)]" />
            <span>
              <span className="block font-medium text-[#101828]">Только лаборатории, где доступны все исследования</span>
              <span className="mt-0.5 block text-xs text-[#667085]">Неполные предложения не участвуют в выборе лучшей цены</span>
            </span>
          </label>
          <label className="mt-4 flex items-center gap-2 text-sm text-[#667085] md:mt-0">
            Сортировать
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className="rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-[#344054] outline-none focus:border-[var(--primary)]">
              <option value="price">по итоговой цене</option>
              <option value="duration">по сроку</option>
              <option value="rating">по рейтингу</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-[#667085]">Цены рассчитаны по демонстрационным данным. Перед сдачей анализов проверьте стоимость и условия на странице лаборатории.</p>

        {offers.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-[#D0D5DD] bg-white p-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-[#F79009]" />
            <h2 className="mt-3 font-semibold text-[#101828]">Нет лабораторий с полным набором</h2>
            <p className="mt-1 text-sm text-[#667085]">Покажите все предложения или измените состав корзины.</p>
            <Button variant="outline" className="mt-4" onClick={() => setOnlyComplete(false)}>Показать все</Button>
          </div>
        ) : (
          <>
            <Card className="mt-6 hidden overflow-hidden border-[#E4E7EC] lg:block">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] border-separate border-spacing-0">
                    <caption className="sr-only">Сравнение доступности, стоимости, сроков и отделений лабораторий</caption>
                    <thead>
                      <tr className="bg-[#F8FAFC]">
                        <th scope="col" className="sticky left-0 z-20 w-[220px] border-b border-r border-[#E4E7EC] bg-[#F8FAFC] px-5 py-4 text-left text-sm font-medium text-[#667085]">Параметр</th>
                        {offers.map((offer) => (
                          <th scope="col" key={offer.lab.id} className="min-w-[190px] border-b border-[#E4E7EC] px-4 py-4 text-center">
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white" style={{ backgroundColor: getLabColor(offer.lab.slug) }}>{offer.lab.name[0]}</div>
                              <span className="font-semibold text-[#101828]">{offer.lab.name}</span>
                              <span className="text-xs font-normal text-[#667085]">★ {offer.lab.rating} · {offer.lab.reviews} отзывов</span>
                              {offer.complete && offer.total === cheapestTotal && <Badge className="bg-[var(--success-bg)] text-[var(--success-text)] hover:bg-[var(--success-bg)]">Лучшая полная цена</Badge>}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <ComparisonRow label="Доступность">
                        {offers.map((offer) => <td key={offer.lab.id} className="border-b border-[#E4E7EC] px-4 py-3 text-center">
                          {offer.complete
                            ? <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--success-text)]"><Check className="h-4 w-4" />Все доступны</span>
                            : <span className="inline-flex items-center gap-1 text-sm font-medium text-[#B54708]"><AlertTriangle className="h-4 w-4" />Не всё доступно</span>}
                        </td>)}
                      </ComparisonRow>
                      <ComparisonRow label="Исследования">{offers.map((offer) => <ValueCell key={offer.lab.id} value={offer.complete ? formatPrice(offer.researchPrice) : "—"} />)}</ComparisonRow>
                      <ComparisonRow label="Взятие биоматериала">{offers.map((offer) => <ValueCell key={offer.lab.id} value={offer.complete ? formatPrice(offer.collectionFee) : "—"} />)}</ComparisonRow>
                      <ComparisonRow label="Другие обязательные сборы">{offers.map((offer) => <ValueCell key={offer.lab.id} value={offer.complete ? (offer.mandatoryFee > 0 ? formatPrice(offer.mandatoryFee) : "Нет") : "—"} />)}</ComparisonRow>
                      <ComparisonRow label="Итого" emphasized>
                        {offers.map((offer) => <td key={offer.lab.id} className="border-b border-[#E4E7EC] bg-[#F8FAFC] px-4 py-4 text-center">
                          {offer.total === null ? <span className="text-sm font-medium text-[#B54708]">Не рассчитывается</span> : <span className="text-lg font-bold text-[#101828]">{formatPrice(offer.total)}</span>}
                        </td>)}
                      </ComparisonRow>
                      <ComparisonRow label="Срок готовности">{offers.map((offer) => <ValueCell key={offer.lab.id} value={offer.complete ? offer.duration : "—"} />)}</ComparisonRow>
                      <ComparisonRow label="Отделение">
                        {offers.map((offer) => <td key={offer.lab.id} className="border-b border-[#E4E7EC] px-4 py-3 text-center text-sm text-[#344054]"><span className="inline-flex items-start justify-center gap-1.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />{city}: выбрать адрес</span></td>)}
                      </ComparisonRow>
                      <tr>
                        <th scope="row" className="sticky left-0 z-10 border-r border-[#E4E7EC] bg-white px-5 py-5 text-left text-sm font-medium text-[#667085]">Действие</th>
                        {offers.map((offer) => <td key={offer.lab.id} className="px-4 py-5 text-center">
                          <Button disabled={!offer.complete} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)]" onClick={() => chooseLab(offer.lab.id, offer.lab.name, offer.lab.slug)}>
                            {offer.complete ? "Выбрать лабораторию" : "Набор неполный"}
                          </Button>
                        </td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 grid gap-4 lg:hidden">
              {offers.map((offer) => (
                <Card key={offer.lab.id} className="border-[#E4E7EC]">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white" style={{ backgroundColor: getLabColor(offer.lab.slug) }}>{offer.lab.name[0]}</div>
                        <div><h2 className="font-semibold text-[#101828]">{offer.lab.name}</h2><p className="text-xs text-[#667085]">★ {offer.lab.rating} · {offer.lab.reviews} отзывов</p></div>
                      </div>
                      {offer.complete && offer.total === cheapestTotal && <Badge className="bg-[var(--success-bg)] text-[var(--success-text)] hover:bg-[var(--success-bg)]">Лучшая цена</Badge>}
                    </div>
                    <div className="mt-4 rounded-lg bg-[#F8FAFC] p-3">
                      {offer.complete
                        ? <div className="flex items-center gap-2 text-sm font-medium text-[var(--success-text)]"><Check className="h-4 w-4" />Все исследования доступны</div>
                        : <div className="text-sm text-[#B54708]"><div className="flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4" />Набор неполный</div><p className="mt-1 text-xs">Нет: {offer.missingNames.join(", ")}</p></div>}
                    </div>
                    <dl className="mt-4 space-y-2 text-sm">
                      <MobileValue label="Исследования" value={offer.complete ? formatPrice(offer.researchPrice) : "—"} />
                      <MobileValue label="Взятие биоматериала" value={offer.complete ? formatPrice(offer.collectionFee) : "—"} />
                      <MobileValue label="Обязательные сборы" value={offer.complete ? (offer.mandatoryFee ? formatPrice(offer.mandatoryFee) : "Нет") : "—"} />
                      <MobileValue label="Срок" value={offer.complete ? offer.duration : "—"} />
                      <MobileValue label="Отделение" value={`${city}: выбрать адрес`} />
                    </dl>
                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#E4E7EC] pt-4">
                      <div><div className="text-xs text-[#667085]">Итого</div><div className={offer.total === null ? "text-sm font-medium text-[#B54708]" : "text-xl font-bold text-[#101828]"}>{offer.total === null ? "Не рассчитывается" : formatPrice(offer.total)}</div></div>
                      <Button disabled={!offer.complete} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)]" onClick={() => chooseLab(offer.lab.id, offer.lab.name, offer.lab.slug)}>{offer.complete ? "Выбрать" : "Недоступно"}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ComparisonRow({ label, emphasized = false, children }: { label: string; emphasized?: boolean; children: React.ReactNode }) {
  return (
    <tr>
      <th scope="row" className={`sticky left-0 z-10 border-b border-r border-[#E4E7EC] px-5 py-3 text-left text-sm ${emphasized ? "bg-[#F8FAFC] font-semibold text-[#101828]" : "bg-white font-medium text-[#667085]"}`}>{label}</th>
      {children}
    </tr>
  );
}

function ValueCell({ value }: { value: string }) {
  return <td className="border-b border-[#E4E7EC] px-4 py-3 text-center text-sm text-[#344054]">{value}</td>;
}

function MobileValue({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4"><dt className="text-[#667085]">{label}</dt><dd className="text-right font-medium text-[#344054]">{value}</dd></div>;
}
