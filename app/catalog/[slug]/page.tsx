"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation";
import {
  Droplet,
  Clock,
  FlaskConical,
  Hash,
  Heart,
  ShoppingCart,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { analyses, labs, articles } from "@/data/mock";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { useCity } from "@/lib/use-city";

type Props = {
  params: Promise<{ slug: string }>;
};

const sections = [
  { id: "short", label: "Что показывает" },
  { id: "indications", label: "Когда назначают" },
  { id: "preparation", label: "Как подготовиться" },
  { id: "collection", label: "Как проходит сдача" },
  { id: "results", label: "О результате" },
  { id: "labs", label: "Предложения лабораторий" },
];

function getGuidance(analysis: (typeof analyses)[number]) {
  const isUrine = analysis.biomaterial.toLowerCase().includes("моч");
  const preparation = isUrine
    ? [
        "Уточните в лаборатории, какой контейнер нужен для этого исследования.",
        "Следуйте инструкции лаборатории по сбору и хранению материала.",
        "Сообщите о лекарствах и особенностях здоровья, которые могут повлиять на результат.",
      ]
    : [
        "Уточните у выбранной лаборатории, требуется ли сдача натощак именно для этого исследования.",
        "Перед процедурой избегайте интенсивной нагрузки и спокойно посидите 10–15 минут.",
        "Не отменяйте лекарства самостоятельно; сообщите о них врачу или лаборатории.",
      ];
  const collection = isUrine
    ? "Материал собирают самостоятельно по инструкции выбранной лаборатории и передают в указанное время. Требования к порции и контейнеру могут различаться."
    : `В лаборатории сотрудник берёт материал «${analysis.biomaterial.toLowerCase()}». После процедуры уточните, когда и каким способом будет доступен результат.`;
  const indicationByCategory: Record<string, string> = {
    biochemistry: "Исследование используют для оценки обменных процессов и контроля показателей в динамике по назначению врача.",
    hormones: "Исследование может назначаться при оценке гормональной регуляции, симптомах или для контроля лечения.",
    vitamins: "Исследование помогает оценить уровень конкретного витамина при симптомах, факторах риска или контроле терапии.",
    general: "Исследование используют как часть общей оценки состояния здоровья и при наличии соответствующих симптомов.",
    immunology: "Исследование применяют для оценки отдельных показателей иммунной системы по клиническим показаниям.",
    allergy: "Исследование может быть частью уточнения аллергической реакции вместе с анамнезом и осмотром врача.",
    infection: "Исследование используют для лабораторного поиска признаков конкретной инфекции с учётом сроков и симптомов.",
  };
  return { preparation, collection, indication: indicationByCategory[analysis.category] || "Исследование назначают по симптомам, факторам риска или для контроля показателя в динамике." };
}

export default function AnalysisPage({ params }: Props) {
  const { slug } = use(params);
  const analysis = analyses.find((a) => a.slug === slug);
  const { toggleItem, addItem, isInCart, selectLab } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  const [city] = useCity();

  const [activeSection, setActiveSection] = useState("short");
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionData = sections
        .map((s) => {
          const el = document.getElementById(s.id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { id: s.id, top: rect.top };
        })
        .filter((s): s is { id: string; top: number } => s !== null);

      let current = sectionData[0]?.id || "short";
      for (const s of sectionData) {
        if (s.top <= 150) {
          current = s.id;
        } else {
          break;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!analysis) {
    notFound();
  }

  const inCart = isInCart(analysis.id);
  const inFav = isFavorite(analysis.id);
  const relatedArticle = articles.find((a) => a.relatedAnalysis === analysis.id);
  const guidance = getGuidance(analysis);

  const handleToggle = () => {
    if (inCart) {
      router.push("/cart");
      return;
    }
    toggleItem({
      id: analysis.id,
      slug: analysis.slug,
      type: "analysis",
      name: analysis.name,
      price: analysis.priceFrom,
      duration: analysis.duration,
    });
  };

  const handleSelectLab = (lab: (typeof labs)[number]) => {
    if (!inCart) {
      addItem({
        id: analysis.id,
        slug: analysis.slug,
        type: "analysis",
        name: analysis.name,
        price: analysis.priceFrom,
        duration: analysis.duration,
      });
    }
    selectLab(analysis.id, lab.id, lab.name);
    router.push("/cart");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: analysis.name,
          text: analysis.short,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {}
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top - 130;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: city, href: "/" },
            { label: "Анализы", href: "/catalog" },
            { label: analysis.categoryName },
            { label: analysis.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
          <div>
            <h1 className="type-h1 text-[#101828]">
              {analysis.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Анализ
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {analysis.categoryName}
              </Badge>
            </div>

            <p className="mt-4 text-[#475467]">{analysis.short}</p>
            {analysis.synonyms && <p className="mt-2 text-sm text-[#667085]"><span className="font-medium text-[#101828]">Также ищут:</span> {analysis.synonyms}</p>}

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-[#E4E7EC] bg-white p-4 md:grid-cols-5">
              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <Droplet className="h-3 w-3 text-[var(--primary)]" />
                  Биоматериал
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {analysis.biomaterial}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <Clock className="h-3 w-3 text-[var(--primary)]" />
                  Срок готовности
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {analysis.duration}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <FlaskConical className="h-3 w-3 text-[var(--primary)]" />
                  Метод
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {analysis.method || "—"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <Hash className="h-3 w-3 text-[var(--primary)]" />
                  Код
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  {analysis.code || "—"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-[#667085]">
                  <AlertCircle className="h-3 w-3 text-[var(--primary)]" />
                  Цена
                </div>
                <div className="mt-1 text-sm font-medium text-[#101828]">
                  от {analysis.priceFrom.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {relatedArticle && (
                <div className="text-[#667085]">
                  <span className="font-medium text-[#101828]">
                    Связанная статья:
                  </span>{" "}
                  <Link
                    href={`/library/${relatedArticle.slug}`}
                    className="text-[var(--primary)] hover:underline"
                  >
                    {relatedArticle.title} →
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-8 sticky top-16 z-30 -mx-4 overflow-x-auto border-b border-[#E4E7EC] bg-[#F8FAFC] px-4 md:-mx-6 md:px-6">
              <div className="flex gap-6 whitespace-nowrap text-sm">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`pb-3 transition ${
                      activeSection === section.id
                        ? "border-b-2 border-[var(--primary)] font-medium text-[var(--primary)]"
                        : "text-[#667085] hover:text-[#101828]"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <section id="short" className="scroll-mt-32">
                <h2 className="type-h2 text-[#101828]">
                  Что показывает исследование
                </h2>
                <p className="mt-3 text-[#475467]">
                  {analysis.short}. Результат помогает оценить конкретный
                  показатель, но сам по себе не устанавливает диагноз.
                </p>
              </section>

              <section id="indications" className="scroll-mt-32">
                <h2 className="type-h2 text-[#101828]">
                  В каких случаях назначают
                </h2>
                <p className="mt-3 text-[#475467]">{guidance.indication}</p>
              </section>

              <section id="preparation" className="scroll-mt-32">
                <h2 className="type-h2 text-[#101828]">
                  Как подготовиться
                </h2>
                <ul className="mt-3 space-y-2 text-[#475467]">
                  {guidance.preparation.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--success-text)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="collection" className="scroll-mt-32">
                <h2 className="type-h2 text-[#101828]">Как проходит сдача</h2>
                <p className="mt-3 text-[#475467]">{guidance.collection}</p>
              </section>

              <section id="results" className="scroll-mt-32">
                <h2 className="type-h2 text-[#101828]">
                  Что важно знать о результате
                </h2>
                <p className="mt-3 text-[#475467]">
                  Референсные значения могут различаться между лабораториями.
                  Оценивайте результат по диапазону из выданного бланка и
                  обсуждайте отклонения с врачом с учётом симптомов, лекарств
                  и других исследований.
                </p>
                <div className="mt-4 rounded-xl bg-[var(--warning-bg)] p-4 text-sm text-[var(--warning-text)]">
                  Интерпретация на странице носит справочный характер и не заменяет консультацию врача.
                </div>
              </section>

              <section id="labs" className="scroll-mt-32">
                <h2 className="type-h2 text-[#101828]">
                  Предложения лабораторий
                </h2>

                <div className="mt-3 space-y-2">
                  {labs.map((lab) => (
                    <Card key={lab.id} className="border-[#E4E7EC]">
                      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary-light)] text-xl font-bold text-[var(--primary)]">
                            {lab.name[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-[#101828]">
                              {lab.name}
                            </div>
                            <div className="text-xs text-[#667085]">
                              ★ {lab.rating} · {lab.reviews} отзывов
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#101828]">
                              {analysis.priceFrom} ₽
                            </div>
                            <div className="text-xs text-[#667085]">
                              Взятие оплачивается отдельно
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className={
                              inCart
                                ? "bg-[var(--success-text)] hover:bg-[var(--accent)]"
                                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                            }
                            onClick={() => handleSelectLab(lab)}
                          >
                            Выбрать лабораторию
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Link
                  href="/labs"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
                >
                  Все лаборатории <ChevronRight className="h-4 w-4" />
                </Link>
              </section>
            </div>
          </div>

          <aside className="xl:sticky xl:top-24 xl:self-start">
            <Card className="border-[#E4E7EC]">
              <CardContent className="p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-[#667085]">от</span>
                  <span className="price-xl text-[#101828]">
                    {analysis.priceFrom} ₽
                  </span>
                </div>
                <div className="mt-1 text-xs text-[#667085]">
                  Предварительная стоимость исследования
                </div>
                <p className="mt-2 text-xs leading-5 text-[#667085]">Взятие биоматериала и другие услуги могут оплачиваться отдельно.</p>

                <Button
                  onClick={handleToggle}
                  className={`mt-4 w-full ${
                    inCart
                      ? "bg-[var(--success-text)] hover:bg-[var(--accent)]"
                      : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                  }`}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {inCart ? "Открыть корзину" : "Добавить в корзину"}
                </Button>

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(analysis.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md border py-2 text-sm transition ${
                      inFav
                        ? "border-[#F04438] bg-[#FEF3F2] text-[#F04438]"
                        : "border-[#E4E7EC] text-[#475467] hover:bg-[#F2F4F7]"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${inFav ? "fill-[#F04438]" : ""}`}
                    />
                    {inFav ? "В избранном" : "В избранное"}
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[#E4E7EC] py-2 text-sm text-[#475467] transition hover:bg-[#F2F4F7]"
                  >
                    {shareCopied ? (
                      <>
                        <Check className="h-4 w-4 text-[var(--success-text)]" />
                        Скопировано
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        Поделиться
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#E4E7EC] pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Взятие биоматериала</span>
                    <span className="text-right font-medium text-[#101828]">По тарифу лаборатории</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E4E7EC] pt-2">
                    <span className="text-[#667085]">Исследование</span>
                    <span className="font-semibold text-[#101828]">
                      от {analysis.priceFrom} ₽
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-[#667085]">
                  Демонстрационные цены для города {city}. Уточняйте стоимость и подготовку в выбранной лаборатории.
                </div>

                {relatedArticle && (
                  <Link
                    href={`/library/${relatedArticle.slug}`}
                    className="mt-4 flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
                  >
                    Связанная статья <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
