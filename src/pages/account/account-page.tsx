import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  Tag,
} from "antd";
import { Link } from "react-router-dom";

import styles from "./account-page.module.scss";
import { useAccount } from "./use-account";

import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import {
  ACCOUNT_MANAGE_ITEMS,
  ACCOUNT_MENU,
  ACCOUNT_SECTION_IDS,
  ACCOUNT_TEXT,
  PROFILE_FIELDS,
} from "@/const/account.const";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const ta = UI_TEXT.account;

export const AccountPage = () => {
  const {
    storedUser,
    isSeller,
    firstName,
    lastName,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
    isSaving,
    error,
    successMessage,
    addresses,
    isAddressLoading,
    editingAddress,
    isAddressModalOpen,
    addressForm,
    isAddressSaving,
    setFirstName,
    setLastName,
    setEmail,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    resetForm,
    submitProfile,
    openCreateAddress,
    openEditAddress,
    closeAddressModal,
    submitAddress,
    handleDeleteAddress,
    handleSetDefault,
    activeManageKey,
    selectManageItem,
  } = useAccount();

  const welcomeName = storedUser?.fullName ?? ACCOUNT_TEXT.welcomeName;

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: UI_TEXT.header.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: UI_TEXT.header.searchPlaceholder }}
      />

      <section className={styles.main}>
        <div className={styles.breadcrumbRow}>
          <div>
            {ACCOUNT_TEXT.breadcrumbPrefix}{" "}
            <strong>{ACCOUNT_TEXT.breadcrumbCurrent}</strong>
          </div>
          <div className={styles.welcome}>
            {ACCOUNT_TEXT.welcomePrefix} <span>{welcomeName}</span>
          </div>
        </div>

        <div className={styles.content}>
          <aside className={styles.sideMenu}>
            <h3>{ACCOUNT_MENU.manageTitle}</h3>
            {ACCOUNT_MANAGE_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                disabled={item.disabled}
                onClick={() => selectManageItem(item)}
                className={
                  item.disabled
                    ? styles.menuDisabled
                    : item.key === activeManageKey
                      ? styles.menuActive
                      : ""
                }
              >
                {item.label}
              </button>
            ))}

            <h4>{ACCOUNT_MENU.orderTitle}</h4>
            <Link to="/orders" className={styles.menuLink}>
              {ta.myOrders}
            </Link>

            <h4>{ACCOUNT_MENU.wishlistTitle}</h4>
          </aside>

          <section className={styles.panel}>
            <div className={styles.sellerCard}>
              <div>
                <h3>{ta.sellerHubTitle}</h3>
                <p>
                  {isSeller ? ta.sellerActiveDesc : ta.sellerInactiveDesc}
                </p>
              </div>
              {isSeller ? (
                <Link className={styles.sellerLink} to="/seller">
                  {ta.openSellerHub}
                </Link>
              ) : (
                <Link className={styles.sellerLink} to="/seller/apply">
                  {ta.becomeSeller}
                </Link>
              )}
            </div>

            <section
              id={ACCOUNT_SECTION_IDS.address}
              className={styles.addressSection}
            >
              <header>
                <h3>{ta.myAddresses}</h3>
                <Button type="primary" onClick={openCreateAddress}>
                  {ta.addAddress}
                </Button>
              </header>

              {isAddressLoading ? (
                <Skeleton active paragraph={{ rows: 2 }} />
              ) : addresses.length === 0 ? (
                <Empty description={ta.noAddresses} />
              ) : (
                <div className={styles.addressList}>
                  {addresses.map((address) => (
                    <article key={address.id} className={styles.addressRow}>
                      <div>
                        <div className={styles.addressTitle}>
                          <strong>{address.addressLine}</strong>
                          {address.isDefault ? (
                            <Tag color="blue">{ta.isDefault}</Tag>
                          ) : null}
                        </div>
                        <div className={styles.addressMeta}>
                          {address.district}, {address.city}
                        </div>
                      </div>
                      <div className={styles.addressActions}>
                        {!address.isDefault ? (
                          <Button
                            size="small"
                            onClick={() => {
                              void handleSetDefault(address.id);
                            }}
                          >
                            {ta.setDefault}
                          </Button>
                        ) : null}
                        <Button
                          size="small"
                          onClick={() => openEditAddress(address)}
                        >
                          {ta.editAddress}
                        </Button>
                        <Popconfirm
                          title={ta.removeAddressConfirm}
                          okText={ta.removeAddressOk}
                          okButtonProps={{ danger: true }}
                          onConfirm={() => {
                            void handleDeleteAddress(address.id);
                          }}
                        >
                          <Button size="small" danger>
                            {ta.removeAddress}
                          </Button>
                        </Popconfirm>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <h2 id={ACCOUNT_SECTION_IDS.profile}>
              {ACCOUNT_TEXT.profileTitle}
            </h2>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="firstName">
                  {PROFILE_FIELDS.firstNameLabel}
                </label>
                <SharedInput
                  id="firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder={PROFILE_FIELDS.firstNameLabel}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName">
                  {PROFILE_FIELDS.lastNameLabel}
                </label>
                <SharedInput
                  id="lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder={PROFILE_FIELDS.lastNameLabel}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">{PROFILE_FIELDS.emailLabel}</label>
                <SharedInput
                  id="email"
                  kind="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={PROFILE_FIELDS.emailLabel}
                />
              </div>
            </div>

            <div className={styles.passwordSection}>
              <h3>{ACCOUNT_TEXT.passwordTitle}</h3>
              <SharedInput
                kind="password"
                placeholder={ACCOUNT_TEXT.currentPasswordPlaceholder}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <SharedInput
                kind="password"
                placeholder={ACCOUNT_TEXT.newPasswordPlaceholder}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <SharedInput
                kind="password"
                placeholder={ACCOUNT_TEXT.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <div className={styles.actions}>
              <SharedButton
                label={ACCOUNT_TEXT.cancelLabel}
                onClick={resetForm}
              />
              <SharedButton
                label={ACCOUNT_TEXT.saveLabel}
                variant="primary"
                className={styles.saveBtn}
                disabled={isSaving}
                onClick={() => {
                  void submitProfile();
                }}
              />
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}
            {successMessage ? (
              <p className={styles.success}>{successMessage}</p>
            ) : null}
          </section>
        </div>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />

      <Modal
        open={isAddressModalOpen}
        title={editingAddress ? ta.editAddressTitle : ta.addAddressTitle}
        okText={ta.saveAddressOk}
        onOk={() => addressForm.submit()}
        onCancel={closeAddressModal}
        confirmLoading={isAddressSaving}
        destroyOnHidden
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={(values) => {
            void submitAddress(values);
          }}
          initialValues={{ isDefault: false }}
        >
          <Form.Item
            label={ta.addressLineLabel}
            name="addressLine"
            rules={[{ required: true, message: ta.addressLineRequired }]}
          >
            <Input placeholder={ta.addressLinePlaceholder} />
          </Form.Item>
          <Form.Item
            label={ta.districtLabel}
            name="district"
            rules={[{ required: true, message: ta.districtRequired }]}
          >
            <Input placeholder={ta.districtPlaceholder} />
          </Form.Item>
          <Form.Item
            label={ta.cityLabel}
            name="city"
            rules={[{ required: true, message: ta.cityRequired }]}
          >
            <Input placeholder={ta.cityPlaceholder} />
          </Form.Item>
          <Form.Item
            label={ta.setAsDefault}
            name="isDefault"
            valuePropName="checked"
          >
            <input type="checkbox" />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};
