import { Alert, Button, Form, Input, Skeleton, Tag } from "antd";
import { Link } from "react-router-dom";

import styles from "./seller-apply-page.module.scss";
import { useSellerApply } from "./use-seller-apply";

import {
  SELLER_APPLICATION_STATUS,
  SELLER_APPLICATION_STATUS_COLORS,
} from "@/const/seller-status.const";
import { SellerShell } from "@/features/seller/components/seller-shell";

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
      <SellerShell title="Become a seller" subtitle="Loading...">
        <div className={styles.card}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </SellerShell>
    );
  }

  if (isAlreadyActive) {
    return (
      <SellerShell
        title="Seller account active"
        subtitle="Your shop is approved."
      >
        <div className={styles.card}>
          <p>You are already an active seller.</p>
          <Link to="/seller">Go to seller dashboard</Link>
        </div>
      </SellerShell>
    );
  }

  const isPending = profile?.status === SELLER_APPLICATION_STATUS.PENDING;

  return (
    <SellerShell
      title="Become a seller"
      subtitle="Submit your shop info. Admin will review and approve."
    >
      <div className={styles.card}>
        {profile ? (
          <div className={styles.statusRow}>
            <strong>Status:</strong>
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
            message="Application rejected"
            description={profile.rejectReason}
            className={styles.rejectAlert}
          />
        ) : null}

        {isPending ? (
          <Alert
            type="info"
            showIcon
            message="Application is being reviewed by admin."
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
          <Form.Item label="Shop name" required>
            <Input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
              placeholder="Moon Store"
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Fast delivery, authentic devices"
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
                ? "Resubmit application"
                : profile
                  ? "Update application"
                  : "Submit application"}
            </Button>
            <Link to="/account" className={styles.secondaryLink}>
              Back to account
            </Link>
          </div>
        </Form>
      </div>
    </SellerShell>
  );
};
