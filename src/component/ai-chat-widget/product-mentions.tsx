import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./ai-chat-widget.module.scss";
import type { AiProduct } from "./use-ai-chat";

const buildProductLink = (productId: number) => `/product/${productId}`;

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Các sản phẩm có tên xuất hiện trong nội dung trả lời của bot. */
export const getMentionedProducts = (
  content: string,
  products: AiProduct[] | undefined,
): AiProduct[] => {
  if (!products?.length) return [];
  return products.filter((p) => p.name && content.includes(p.name));
};

/**
 * Thay mỗi lần tên sản phẩm xuất hiện trong text bằng một link tới trang chi
 * tiết sản phẩm. Match tên dài trước để tránh trùng lặp một phần.
 */
export const linkifyProductMentions = (
  content: string,
  products: AiProduct[] | undefined,
): ReactNode => {
  if (!products?.length) return content;

  const byName = new Map(products.map((p) => [p.name, p]));
  const sortedNames = [...byName.keys()]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (!sortedNames.length) return content;

  const pattern = new RegExp(
    `(${sortedNames.map(escapeRegExp).join("|")})`,
    "g",
  );

  return content.split(pattern).map((part, index) => {
    const product = byName.get(part);
    if (product) {
      return (
        <Link
          key={index}
          to={buildProductLink(product.id)}
          className={styles.inlineProductLink}
        >
          {part}
        </Link>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
};
