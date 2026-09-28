import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className="w-full">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[#667085]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--primary)] hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-[#101828]" : ""} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <ChevronRight className="h-4 w-4 text-[#D0D5DD]" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
