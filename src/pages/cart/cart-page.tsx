import { Link } from "react-router-dom";

import styles from "./cart-page.module.scss";
import { useCartPageData } from "./use-cart-page-data";

import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import { CART_TEXT } from "@/const/cart.const";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections } from "@/pages/home/mock-data";

const formatMoney = (value: number) => `$${value.toFixed(0)}`;

const cartHeaderLinks = [
  { label: "Home", to: "/" },
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about" },
  { label: "Sign Up", to: "/register" },
  { label: "Cart", to: "/cart" },
];

export const CartPage = () => {
  const {
    couponCode,
    couponMessage,
    discountAmount,
    items,
    shippingFee,
    subTotal,
    total,
    applyCoupon,
    removeItem,
    setCouponCode,
    updateQuantity,
  } = useCartPageData();

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={cartHeaderLinks}
        promo={{
          message:
            "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!",
          linkLabel: "ShopNow",
          to: "/",
        }}
        search={{ placeholder: "What are you looking for?" }}
      />

      <section className={styles.main}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[{ label: "Home", to: "/" }, { label: "Cart" }]}
        />

        <div className={styles.headerRow}>
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
        </div>

        {items.map((item) => (
          <article key={item.id} className={styles.itemRow}>
            <div className={styles.productCell}>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                x
              </button>
              <img src={item.image} alt={item.name} />
              <div>
                <span>{item.name}</span>
                {item.selectedOptions.length > 0 ? (
                  <small className={styles.optionLine}>
                    {item.selectedOptions
                      .map((opt) => `${opt.groupName}: ${opt.optionName}`)
                      .join(" · ")}
                  </small>
                ) : null}
              </div>
            </div>

            <span>{formatMoney(item.price)}</span>

            <div>
              <select
                className={styles.qtySelect}
                value={item.quantity}
                onChange={(event) =>
                  updateQuantity(item.id, Number(event.target.value))
                }
                aria-label={`Quantity for ${item.name}`}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((qty) => (
                  <option key={qty} value={qty}>
                    {qty.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            <span>{formatMoney(item.price * item.quantity)}</span>
          </article>
        ))}

        <div className={styles.actionsRow}>
          <Link to="/">Return To Shop</Link>
          <SharedButton label={CART_TEXT.updateCartLabel} />
        </div>

        <div className={styles.summaryWrap}>
          <div>
            <div className={styles.couponRow}>
              <SharedInput
                placeholder={CART_TEXT.couponPlaceholder}
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
              />
              <SharedButton
                variant="primary"
                label={CART_TEXT.applyCouponLabel}
                onClick={applyCoupon}
              />
            </div>
            {couponMessage ? (
              <p className={styles.couponMessage}>{couponMessage}</p>
            ) : null}
          </div>

          <article className={styles.totalCard}>
            <h2>Cart Total</h2>
            <div className={styles.lineItem}>
              <span>Subtotal:</span>
              <strong>{formatMoney(subTotal)}</strong>
            </div>
            <div className={styles.lineItem}>
              <span>Shipping:</span>
              <strong>
                {shippingFee === 0 ? "Free" : formatMoney(shippingFee)}
              </strong>
            </div>
            <div className={styles.lineItem}>
              <span>Discount:</span>
              <strong>
                {discountAmount === 0 ? "-" : `-${formatMoney(discountAmount)}`}
              </strong>
            </div>
            <div className={styles.lineItem}>
              <span>Total:</span>
              <strong>{formatMoney(total)}</strong>
            </div>
            <Link to="/checkout" className={styles.checkoutButton}>
              Proceed to checkout
            </Link>
          </article>
        </div>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
