import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { resolveImageUrl } from "@/app/utils/image-url";

import styles from "./product-card.module.scss";

type ProductCardProps = {
  name: string;
  image: string;
  to: string;
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  discountLabel?: string;
  wishlistLabel?: string;
  onWishlist?: () => void;
  compareLabel?: string;
  onCompare?: () => void;
  renderPrice?: ReactNode;
  renderMeta?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  imageWrapClassName?: string;
  discountClassName?: string;
  wishlistClassName?: string;
  compareClassName?: string;
  priceRowClassName?: string;
  metaRowClassName?: string;
  actionClassName?: string;
};

export const ProductCard = ({
  name,
  image,
  to,
  onLinkClick,
  discountLabel,
  wishlistLabel,
  onWishlist,
  compareLabel,
  onCompare,
  renderPrice,
  renderMeta,
  actionLabel,
  onAction,
  className,
  imageWrapClassName,
  discountClassName,
  wishlistClassName,
  compareClassName,
  priceRowClassName,
  metaRowClassName,
  actionClassName,
}: ProductCardProps) => {
  return (
    <article className={className ?? styles.card}>
      <div className={imageWrapClassName ?? styles.imageWrap}>
        {discountLabel ? (
          <span className={discountClassName ?? styles.discount}>
            {discountLabel}
          </span>
        ) : null}
        <Link to={to} onClick={onLinkClick} aria-label={`View ${name}`}>
          <img src={resolveImageUrl(image)} alt={name} />
        </Link>
        {wishlistLabel ? (
          <button
            type="button"
            className={wishlistClassName ?? styles.wishlist}
            onClick={onWishlist}
          >
            {wishlistLabel}
          </button>
        ) : null}
        {compareLabel ? (
          <button
            type="button"
            className={compareClassName ?? styles.compare}
            onClick={onCompare}
            title={compareLabel}
          >
            {compareLabel}
          </button>
        ) : null}
      </div>

      <Link to={to} onClick={onLinkClick}>
        <h3>{name}</h3>
      </Link>

      {renderPrice ? (
        <div className={priceRowClassName}>{renderPrice}</div>
      ) : null}

      {renderMeta ? <div className={metaRowClassName}>{renderMeta}</div> : null}

      {actionLabel ? (
        <button
          type="button"
          className={actionClassName ?? styles.actionButton}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </article>
  );
};
