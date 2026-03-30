import styles from "./checkout-page.module.scss";
import { useCheckoutPageData } from "./use-checkout-page-data";

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
        <div className={styles.breadcrumb}>
          <span>Account</span>
          <span>/</span>
          <span>My Account</span>
          <span>/</span>
          <span>Product</span>
          <span>/</span>
          <span>View Cart</span>
          <span>/</span>
          <span>CheckOut</span>
        </div>

        <div className={styles.layout}>
          <section className={styles.billing}>
            <h1>Billing Details</h1>

            <div className={styles.fieldList}>
              <div className={styles.field}>
                <label htmlFor="firstName">First Name*</label>
                <input
                  id="firstName"
                  value={billing.firstName}
                  onChange={(event) =>
                    setBillingField("firstName", event.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="companyName">Company Name</label>
                <input
                  id="companyName"
                  value={billing.companyName}
                  onChange={(event) =>
                    setBillingField("companyName", event.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="streetAddress">Street Address*</label>
                <input
                  id="streetAddress"
                  value={billing.streetAddress}
                  onChange={(event) =>
                    setBillingField("streetAddress", event.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="apartment">
                  Apartment, floor, etc. (optional)
                </label>
                <input
                  id="apartment"
                  value={billing.apartment}
                  onChange={(event) =>
                    setBillingField("apartment", event.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="city">Town/City*</label>
                <input
                  id="city"
                  value={billing.city}
                  onChange={(event) =>
                    setBillingField("city", event.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">Phone Number*</label>
                <input
                  id="phone"
                  value={billing.phone}
                  onChange={(event) =>
                    setBillingField("phone", event.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email Address*</label>
                <input
                  id="email"
                  value={billing.email}
                  onChange={(event) =>
                    setBillingField("email", event.target.value)
                  }
                />
              </div>
            </div>

            <label className={styles.saveInfo}>
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(event) => setSaveInfo(event.target.checked)}
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
                  />
                  Cash on delivery
                </label>
              </div>
            </div>

            <div className={styles.couponRow}>
              <input
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
              />
              <button type="button" onClick={applyCoupon}>
                Apply Coupon
              </button>
            </div>

            {couponMessage ? (
              <p className={styles.couponMessage}>{couponMessage}</p>
            ) : null}

            <button
              type="button"
              className={styles.placeOrderButton}
              onClick={placeOrder}
            >
              Place Order
            </button>

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
