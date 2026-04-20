import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: ReactNode;
  to?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  separator?: ReactNode;
};

export const Breadcrumb = ({
  items,
  className,
  separator = "/",
}: BreadcrumbProps) => {
  return (
    <div className={className} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const content = item.to ? (
          <Link to={item.to}>{item.label}</Link>
        ) : (
          <span>{item.label}</span>
        );

        return (
          <span key={`${index}-${String(item.label)}`}>
            {content}
            {index < items.length - 1 ? <span>{separator}</span> : null}
          </span>
        );
      })}
    </div>
  );
};
