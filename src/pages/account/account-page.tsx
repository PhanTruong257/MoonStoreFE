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
  ACCOUNT_MENU,
  ACCOUNT_TEXT,
  PROFILE_FIELDS,
} from "@/const/account.const";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

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
  } = useAccount();

  const welcomeName = storedUser?.fullName ?? ACCOUNT_TEXT.welcomeName;

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={homeHeaderLinks}
        promo={{
          message:
            "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!",
          linkLabel: "ShopNow",
          to: "/",
        }}
        search={{ placeholder: "What are you looking for?" }}
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
            {ACCOUNT_MENU.manageItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={index === 0 ? styles.menuActive : ""}
              >
                {item}
              </button>
            ))}

            <h4>{ACCOUNT_MENU.orderTitle}</h4>
            <Link to="/orders" className={styles.menuLink}>
              My orders
            </Link>

            <h4>{ACCOUNT_MENU.wishlistTitle}</h4>
          </aside>

          <section className={styles.panel}>
            <div className={styles.sellerCard}>
              <div>
                <h3>Seller hub</h3>
                <p>
                  {isSeller
                    ? "Manage your product catalog and launch new items."
                    : "Submit an application to become a seller. Admin will review."}
                </p>
              </div>
              {isSeller ? (
                <Link className={styles.sellerLink} to="/seller">
                  Open seller hub
                </Link>
              ) : (
                <Link className={styles.sellerLink} to="/seller/apply">
                  Become a seller
                </Link>
              )}
            </div>

            <section className={styles.addressSection}>
              <header>
                <h3>My addresses</h3>
                <Button type="primary" onClick={openCreateAddress}>
                  Add address
                </Button>
              </header>

              {isAddressLoading ? (
                <Skeleton active paragraph={{ rows: 2 }} />
              ) : addresses.length === 0 ? (
                <Empty description="No saved addresses" />
              ) : (
                <div className={styles.addressList}>
                  {addresses.map((address) => (
                    <article key={address.id} className={styles.addressRow}>
                      <div>
                        <div className={styles.addressTitle}>
                          <strong>{address.addressLine}</strong>
                          {address.isDefault ? (
                            <Tag color="blue">Default</Tag>
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
                            Set default
                          </Button>
                        ) : null}
                        <Button
                          size="small"
                          onClick={() => openEditAddress(address)}
                        >
                          Edit
                        </Button>
                        <Popconfirm
                          title="Remove this address?"
                          okText="Remove"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => {
                            void handleDeleteAddress(address.id);
                          }}
                        >
                          <Button size="small" danger>
                            Remove
                          </Button>
                        </Popconfirm>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <h2>{ACCOUNT_TEXT.profileTitle}</h2>

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
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />

      <Modal
        open={isAddressModalOpen}
        title={editingAddress ? "Edit address" : "Add address"}
        okText="Save"
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
            label="Address line"
            name="addressLine"
            rules={[{ required: true, message: "Address line is required" }]}
          >
            <Input placeholder="123 Le Loi street" />
          </Form.Item>
          <Form.Item
            label="District"
            name="district"
            rules={[{ required: true, message: "District is required" }]}
          >
            <Input placeholder="District 1" />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "City is required" }]}
          >
            <Input placeholder="Ho Chi Minh" />
          </Form.Item>
          <Form.Item
            label="Set as default"
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
