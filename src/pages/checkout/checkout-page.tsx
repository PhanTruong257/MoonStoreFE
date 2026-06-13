import styles from "./checkout-page.module.scss";
import { useCheckoutPageData } from "./use-checkout-page-data";

import { formatMoneyShort } from "@/app/utils/format";
import { resolveImageUrl } from "@/app/utils/image-url";
import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import { CHECKOUT_TEXT } from "@/const/checkout.const";
import { CHECKOUT_PAYMENT_OPTIONS } from "@/const/payment.const";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const th = UI_TEXT.header;

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
    savedAddresses,
    selectedAddressId,
    isUsingSavedAddress,
    NEW_ADDRESS,
    setSelectedAddressId,
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
        brand={{ label: th.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: th.searchPlaceholder }}
      />

      <section className={styles.main}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={CHECKOUT_TEXT.breadcrumbItems.map((label) => ({ label }))}
        />

        <div className={styles.layout}>
          <section className={styles.billing}>
            <h1>{CHECKOUT_TEXT.billingTitle}</h1>

            {savedAddresses.length > 0 ? (
              <div className={styles.addressPicker}>
                <label htmlFor="savedAddress">{CHECKOUT_TEXT.savedAddressLabel}</label>
                <select
                  id="savedAddress"
                  value={selectedAddressId}
                  onChange={(event) =>
                    setSelectedAddressId(event.target.value)
                  }
                  disabled={isSubmitting}
                >
                  {savedAddresses.map((addr) => (
                    <option key={addr.id} value={String(addr.id)}>
                      {addr.addressLine}, {addr.district}, {addr.city}
                      {addr.isDefault ? ` ${CHECKOUT_TEXT.isDefault}` : ""}
                    </option>
                  ))}
                  <option value={NEW_ADDRESS}>{CHECKOUT_TEXT.newAddressOption}</option>
                </select>
              </div>
            ) : null}

            {isUsingSavedAddress ? null : (
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
            )}

            {isUsingSavedAddress ? null : (
              <label className={styles.saveInfo}>
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(event) => setSaveInfo(event.target.checked)}
                  disabled={isSubmitting}
                />
                {CHECKOUT_TEXT.saveInfoLabel}
              </label>
            )}
          </section>

          <aside className={styles.orderSummary}>
            <div className={styles.items}>
              {checkoutItems.map((item) => (
                <article key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <img src={resolveImageUrl(item.image)} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                  <strong>{formatMoneyShort(item.price * item.quantity)}</strong>
                </article>
              ))}
            </div>

            <div className={styles.totalLine}>
              <span>{CHECKOUT_TEXT.subtotal}</span>
              <strong>{formatMoneyShort(subTotal)}</strong>
            </div>
            <div className={styles.totalLine}>
              <span>{CHECKOUT_TEXT.shipping}</span>
              <strong>
                {shippingFee === 0 ? CHECKOUT_TEXT.freeShipping : formatMoneyShort(shippingFee)}
              </strong>
            </div>
            <div className={styles.totalLine}>
              <span>{CHECKOUT_TEXT.discount}</span>
              <strong>
                {discountAmount === 0 ? CHECKOUT_TEXT.noDiscount : `-${formatMoneyShort(discountAmount)}`}
              </strong>
            </div>
            <div className={styles.totalLine}>
              <span>{CHECKOUT_TEXT.total}</span>
              <strong>{formatMoneyShort(total)}</strong>
            </div>

            <div className={styles.paymentOptions}>
              <div className={styles.paymentRow}>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === CHECKOUT_PAYMENT_OPTIONS.QR}
                    onChange={() =>
                      setPaymentMethod(CHECKOUT_PAYMENT_OPTIONS.QR)
                    }
                    disabled={isSubmitting}
                  />
                  {CHECKOUT_TEXT.paymentQR}
                </label>
              </div>
              <div className={styles.paymentRow}>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === CHECKOUT_PAYMENT_OPTIONS.VNPAY}
                    onChange={() =>
                      setPaymentMethod(CHECKOUT_PAYMENT_OPTIONS.VNPAY)
                    }
                    disabled={isSubmitting}
                  />
                  {CHECKOUT_TEXT.paymentVNPay}
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
              onClick={() => {
                void placeOrder();
              }}
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
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
