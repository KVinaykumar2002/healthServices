import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export type Crumb = {
  label: string;
  href?: string;
};

export function SiteBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="site-breadcrumb" aria-label="Breadcrumb">
      <ol className="site-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="site-breadcrumb__item">
              {index > 0 ? (
                <ChevronRight className="site-breadcrumb__sep" size={14} aria-hidden="true" />
              ) : null}
              {item.href && !isLast ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
