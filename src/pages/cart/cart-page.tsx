import { Popconfirm } from "antd";
import { Link } from "react-router-dom";

import styles from "./cart-page.module.scss";
import { useCartPageData } from "./use-cart-page-data";

import { formatMoneyShort } from "@/app/utils/format";
import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { CART_MAX_QUANTITY, CART_TEXT } from "@/const/cart.const";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

export const CartPage = () => {
  const {
    items,
    selectedIds,
    selectedCount,
    allSelected,
    subTotal,
    isEmpty,
    toggleSelectItem,
    toggleSelectAll,
    incrementQuantity,
    decrementQuantity,
    changeQuantity,
    removeItem,
    removeSelected,
    goToCheckout,
  } = useCartPageData();

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: UI_TEXT.header.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: UI_TEXT.header.searchPlaceholder }}
      />

      <section className={styles.main}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[{ label: UI_TEXT.common.home, to: "/" }, { label: CART_TEXT.breadcrumbLabel }]}
        />

        <h1 className={styles.pageTitle}>{CART_TEXT.pageTitle}</h1>

        {isEmpty ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2>{CART_TEXT.emptyTitle}</h2>
            <p>{CART_TEXT.emptyHint}</p>
            <Link to="/" className={styles.emptyAction}>
              {CART_TEXT.emptyAction}
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.headerRow}>
              <label className={styles.selectCell}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label={CART_TEXT.selectAll}
                />
              </label>
              <span>{CART_TEXT.headerProduct}</span>
              <span className={styles.alignRight}>{CART_TEXT.headerPrice}</span>
              <span className={styles.alignCenter}>
                {CART_TEXT.headerQuantity}
              </span>
              <span className={styles.alignRight}>
                {CART_TEXT.headerSubtotal}
              </span>
              <span className={styles.alignCenter}>
                {CART_TEXT.headerAction}
              </span>
            </div>

            <div className={styles.list}>
              {items.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const lineTotal = item.price * item.quantity;
                return (
                  <article
                    key={item.id}
                    className={`${styles.itemRow} ${
                      isSelected ? styles.itemSelected : ""
                    }`}
                  >
                    <label className={styles.selectCell}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(item.id)}
                        aria-label={item.name}
                      />
                    </label>

                    <div className={styles.productCell}>
                      <Link
                        to={`/product/${item.productId}`}
                        className={styles.productImageLink}
                      >
                        <img src={item.image} alt={item.name} />
                      </Link>
                      <div className={styles.productMeta}>
                        <Link
                          to={`/product/${item.productId}`}
                          className={styles.productName}
                        >
                          {item.name}
                        </Link>
                        {item.selectedOptions.length > 0 ? (
                          <small className={styles.optionLine}>
                            {item.selectedOptions
                              .map(
                                (opt) =>
                                  `${opt.groupName}: ${opt.optionName}`,
                              )
                              .join(" · ")}
                          </small>
                        ) : null}
                      </div>
                    </div>

                    <span className={styles.priceCell}>
                      {formatMoneyShort(item.price)}
                    </span>

                    <div className={styles.qtyCell}>
                      <button
                        type="button"
                        className={styles.qtyButton}
                        onClick={() => decrementQuantity(item.id)}
                        disabled={item.quantity <= 1}
                        aria-label={CART_TEXT.decreaseQty}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={CART_MAX_QUANTITY}
                        className={styles.qtyInput}
                        value={item.quantity}
                        onChange={(event) => {
                          const next = Number(event.target.value);
                          if (Number.isFinite(next)) {
                            changeQuantity(item.id, next);
                          }
                        }}
                        aria-label={CART_TEXT.quantityAriaLabel(item.name)}
                      />
                      <button
                        type="button"
                        className={styles.qtyButton}
                        onClick={() => incrementQuantity(item.id)}
                        disabled={item.quantity >= CART_MAX_QUANTITY}
                        aria-label={CART_TEXT.increaseQty}
                      >
                        +
                      </button>
                    </div>

                    <span className={styles.subtotalCell}>
                      {formatMoneyShort(lineTotal)}
                    </span>

                    <div className={styles.actionCell}>
                      <Popconfirm
                        title={CART_TEXT.removeConfirmTitle}
                        okText={CART_TEXT.removeConfirmOk}
                        cancelText={CART_TEXT.removeConfirmCancel}
                        onConfirm={() => removeItem(item.id)}
                      >
                        <button
                          type="button"
                          className={styles.removeButton}
                          aria-label={CART_TEXT.removeAriaLabel(item.name)}
                        >
                          🗑
                        </button>
                      </Popconfirm>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className={styles.summaryBar}>
              <label className={styles.barSelectAll}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                {CART_TEXT.selectAll} ({items.length})
              </label>

              <Popconfirm
                title={CART_TEXT.removeSelectedConfirmTitle(selectedCount)}
                okText={CART_TEXT.removeConfirmOk}
                cancelText={CART_TEXT.removeConfirmCancel}
                disabled={selectedCount === 0}
                onConfirm={removeSelected}
              >
                <button
                  type="button"
                  className={styles.barDeleteSelected}
                  disabled={selectedCount === 0}
                >
                  {CART_TEXT.deleteSelected}
                </button>
              </Popconfirm>

              <div className={styles.barSpacer} />

              <div className={styles.barTotal}>
                <span className={styles.barTotalLabel}>
                  {CART_TEXT.totalLabel} ({CART_TEXT.selectedCount(selectedCount)}):
                </span>
                <strong className={styles.barTotalValue}>
                  {formatMoneyShort(subTotal)}
                </strong>
              </div>

              <button
                type="button"
                className={styles.checkoutButton}
                disabled={selectedCount === 0}
                onClick={goToCheckout}
              >
                {CART_TEXT.checkoutLabel}
              </button>
            </div>
          </>
        )}
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
