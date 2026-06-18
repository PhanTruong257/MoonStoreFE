import { Skeleton, Tag, Typography, message } from "antd";

import styles from "./qr-payment-card.module.scss";

import { formatMoney } from "@/app/utils/format";
import { PAYMENT_STATUS, PAYMENT_STATUS_LABELS } from "@/const/payment.const";
import type { QrPaymentInfo } from "@/services/payments-service";

type Props = {
  qrInfo: QrPaymentInfo | null;
  isLoading: boolean;
};

const copyText = (value: string, label: string): void => {
  void navigator.clipboard
    .writeText(value)
    .then(() => message.success(`Đã sao chép ${label}.`))
    .catch(() => message.error("Không thể sao chép."));
};

export const QrPaymentCard = ({ qrInfo, isLoading }: Props) => {
  if (isLoading) {
    return (
      <article className={styles.card}>
        <h3>Thanh toán QR</h3>
        <Skeleton active paragraph={{ rows: 4 }} />
      </article>
    );
  }
  if (!qrInfo) {
    return null;
  }

  const isPending = qrInfo.paymentStatus === PAYMENT_STATUS.PENDING;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3>Quét mã để thanh toán</h3>
        <Tag color={isPending ? "gold" : "green"}>
          {PAYMENT_STATUS_LABELS[qrInfo.paymentStatus] ?? qrInfo.paymentStatus}
        </Tag>
      </div>

      <div className={styles.qrWrap}>
        <img
          src={qrInfo.qrUrl}
          alt="Mã chuyển khoản VietQR"
          className={styles.qr}
        />
      </div>

      <p className={styles.hint}>
        Mở ứng dụng ngân hàng, quét mã này và số tiền cùng nội dung chuyển khoản
        sẽ được điền tự động. Người bán sẽ xác nhận đơn đã thanh toán sau khi
        nhận được tiền.
      </p>

      <ul className={styles.info}>
        <li>
          <span>Ngân hàng</span>
          <strong>{qrInfo.bankName}</strong>
        </li>
        <li>
          <span>Số tài khoản</span>
          <Typography.Text
            copyable={{
              text: qrInfo.accountNo,
              onCopy: () => copyText(qrInfo.accountNo, "số tài khoản"),
            }}
            className={styles.copyText}
          >
            {qrInfo.accountNo}
          </Typography.Text>
        </li>
        <li>
          <span>Chủ tài khoản</span>
          <strong>{qrInfo.accountName}</strong>
        </li>
        <li>
          <span>Số tiền</span>
          <strong className={styles.amount}>
            {formatMoney(qrInfo.amount)}
          </strong>
        </li>
        <li>
          <span>Nội dung chuyển khoản</span>
          <Typography.Text
            copyable={{
              text: qrInfo.transferContent,
              onCopy: () =>
                copyText(qrInfo.transferContent, "nội dung chuyển khoản"),
            }}
            className={styles.copyText}
          >
            {qrInfo.transferContent}
          </Typography.Text>
        </li>
      </ul>
    </article>
  );
};
