import styles from "./checkout-page.module.scss";
import { useCheckoutPageData } from "./use-checkout-page-data";

import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import { CHECKOUT_TEXT } from "@/const/checkout.const";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections } from "@/pages/home/mock-data";

const checkoutHeaderLinks = [
  { label: "Home", to: "/" },
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about" },
  { label: "Sign Up", to: "/register" },
  { label: "Cart", to: "/cart" },
];

const formatMoney = (value: number) => `$${value.toFixed(0)}`;

export const CheckoutPage = () => {
  const {
    billing,
    checkoutItems,
    couponCode,
    couponMessage,
    discountAmount,
    paymentMethod,
    saveInfo,
    shippingFee,
    subTotal,
    total,
    orderMessage,
    isLoading,
    isSubmitting,
    applyCoupon,
    placeOrder,
    setBillingField,
    setCouponCode,
    setPaymentMethod,
    setSaveInfo,
  } = useCheckoutPageData();

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={checkoutHeaderLinks}
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
          items={[
            { label: "Account" },
            { label: "My Account" },
            { label: "Product" },
            { label: "View Cart" },
            { label: "CheckOut" },
          ]}
        />

        <div className={styles.layout}>
          <section className={styles.billing}>
            <h1>Billing Details</h1>

            <div className={styles.fieldList}>
              <div className={styles.field}>
                <label htmlFor="firstName">{CHECKOUT_TEXT.firstName}</label>
                <SharedInput
                  id="firstName"
                  placeholder={CHECKOUT_TEXT.firstName}
                  value={billing.firstName}
                  onChange={(event) =>
                    setBillingField("firstName", event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="companyName">{CHECKOUT_TEXT.companyName}</label>
                <SharedInput
                  id="companyName"
                  placeholder={CHECKOUT_TEXT.companyName}
                  value={billing.companyName}
                  onChange={(event) =>
                    setBillingField("companyName", event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="streetAddress">{CHECKOUT_TEXT.streetAddress}</label>
                <SharedInput
                  id="streetAddress"
                  placeholder={CHECKOUT_TEXT.streetAddress}
                  value={billing.streetAddress}
                  onChange={(event) =>
                    setBillingField("streetAddress", event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="apartment">{CHECKOUT_TEXT.apartment}</label>
                <SharedInput
                  id="apartment"
                  placeholder={CHECKOUT_TEXT.apartment}
                  value={billing.apartment}
                  onChange={(event) =>
                    setBillingField("apartment", event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="city">{CHECKOUT_TEXT.city}</label>
                <SharedInput
                  id="city"
                  placeholder={CHECKOUT_TEXT.city}
                  value={billing.city}
                  onChange={(event) =>
                    setBillingField("city", event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">{CHECKOUT_TEXT.phone}</label>
                <SharedInput
                  id="phone"
                  placeholder={CHECKOUT_TEXT.phone}
                  value={billing.phone}
                  onChange={(event) =>
                    setBillingField("phone", event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">{CHECKOUT_TEXT.email}</label>
                <SharedInput
                  id="email"
                  kind="email"
                  placeholder={CHECKOUT_TEXT.email}
                  value={billing.email}
                  onChange={(event) =>
                    setBillingField("email", event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <label className={styles.saveInfo}>
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(event) => setSaveInfo(event.target.checked)}
                disabled={isSubmitting}
              />
              Save this information for faster check-out next time
            </label>
          </section>

          <aside className={styles.orderSummary}>
            <div className={styles.items}>
              {checkoutItems.map((item) => (
                <article key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                  <strong>{formatMoney(item.price * item.quantity)}</strong>
                </article>
              ))}
            </div>

            <div className={styles.totalLine}>
              <span>Subtotal:</span>
              <strong>{formatMoney(subTotal)}</strong>
            </div>
            <div className={styles.totalLine}>
              <span>Shipping:</span>
              <strong>
                {shippingFee === 0 ? "Free" : formatMoney(shippingFee)}
              </strong>
            </div>
            <div className={styles.totalLine}>
              <span>Discount:</span>
              <strong>
                {discountAmount === 0 ? "-" : `-${formatMoney(discountAmount)}`}
              </strong>
            </div>
            <div className={styles.totalLine}>
              <span>Total:</span>
              <strong>{formatMoney(total)}</strong>
            </div>

            <div className={styles.paymentOptions}>
              <div className={styles.paymentRow}>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    disabled={isSubmitting}
                  />
                  Bank
                </label>
                <div className={styles.cardBadges}>
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className={styles.paymentRow}>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    disabled={isSubmitting}
                  />
                  Cash on delivery
                </label>
              </div>
            </div>

            <div className={styles.couponRow}>
              <SharedInput
                placeholder={CHECKOUT_TEXT.couponPlaceholder}
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                disabled={isSubmitting}
              />
              <SharedButton
                variant="primary"
                label={CHECKOUT_TEXT.applyCouponLabel}
                onClick={applyCoupon}
                disabled={isSubmitting}
              />
            </div>

            {couponMessage ? (
              <p className={styles.couponMessage}>{couponMessage}</p>
            ) : null}

            <SharedButton
              className={styles.placeOrderButton}
              variant="primary"
              onClick={placeOrder}
              label={CHECKOUT_TEXT.placeOrderLabel}
              disabled={isLoading || isSubmitting || checkoutItems.length === 0}
            />

            {orderMessage ? (
              <p className={styles.orderMessage}>{orderMessage}</p>
            ) : null}
          </aside>
        </div>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
