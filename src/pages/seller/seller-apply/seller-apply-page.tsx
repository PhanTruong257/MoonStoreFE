import { Alert, Button, Form, Input, Skeleton, Tag } from "antd";
import { Link } from "react-router-dom";

import styles from "./seller-apply-page.module.scss";
import { useSellerApply } from "./use-seller-apply";

import {
  SELLER_APPLICATION_STATUS,
  SELLER_APPLICATION_STATUS_COLORS,
} from "@/const/seller-status.const";
import { UI_TEXT } from "@/const/ui-text";
import { SellerShell } from "@/features/seller/components/seller-shell";

const t = UI_TEXT.seller.apply;

export const SellerApplyPage = () => {
  const {
    profile,
    shopName,
    description,
    isLoading,
    isSubmitting,
    isAlreadyActive,
    setShopName,
    setDescription,
    submit,
  } = useSellerApply();

  if (isLoading) {
    return (
      <SellerShell title={t.loadingTitle} subtitle={t.loadingSubtitle}>
        <div className={styles.card}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </SellerShell>
    );
  }

  if (isAlreadyActive) {
    return (
      <SellerShell title={t.activeTitle} subtitle={t.activeSubtitle}>
        <div className={styles.card}>
          <p>{t.alreadyActive}</p>
          <Link to="/seller">{t.goToDashboard}</Link>
        </div>
      </SellerShell>
    );
  }

  const isPending = profile?.status === SELLER_APPLICATION_STATUS.PENDING;

  return (
    <SellerShell title={t.title} subtitle={t.subtitle}>
      <div className={styles.card}>
        {profile ? (
          <div className={styles.statusRow}>
            <strong>{t.statusLabel}</strong>
            <Tag
              color={
                SELLER_APPLICATION_STATUS_COLORS[profile.status] ?? "default"
              }
            >
              {profile.status.toUpperCase()}
            </Tag>
          </div>
        ) : null}

        {profile?.status === SELLER_APPLICATION_STATUS.REJECTED &&
        profile.rejectReason ? (
          <Alert
            type="error"
            showIcon
            message={t.rejectedAlert}
            description={profile.rejectReason}
            className={styles.rejectAlert}
          />
        ) : null}

        {isPending ? (
          <Alert
            type="info"
            showIcon
            message={t.pendingAlert}
            className={styles.rejectAlert}
          />
        ) : null}

        <Form
          layout="vertical"
          onFinish={() => {
            void submit();
          }}
          disabled={isSubmitting || isPending}
        >
          <Form.Item label={t.shopNameLabel} required>
            <Input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
              placeholder={t.shopNamePlaceholder}
            />
          </Form.Item>
          <Form.Item label={t.descriptionLabel}>
            <Input.TextArea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder={t.descriptionPlaceholder}
            />
          </Form.Item>
          <div className={styles.actions}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isPending}
            >
              {profile?.status === SELLER_APPLICATION_STATUS.REJECTED
                ? t.resubmitLabel
                : profile
                  ? t.updateLabel
                  : t.submitLabel}
            </Button>
            <Link to="/account" className={styles.secondaryLink}>
              {t.backToAccount}
            </Link>
          </div>
        </Form>
      </div>
    </SellerShell>
  );
};
