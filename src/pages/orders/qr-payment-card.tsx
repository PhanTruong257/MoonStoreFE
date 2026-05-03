import { Skeleton, Tag, Typography, message } from "antd";

import styles from "./qr-payment-card.module.scss";

import { formatMoney } from "@/app/utils/format";
import { PAYMENT_STATUS } from "@/const/payment.const";
import type { QrPaymentInfo } from "@/services/payments-service";

type Props = {
  qrInfo: QrPaymentInfo | null;
  isLoading: boolean;
};

const copyText = (value: string, label: string): void => {
  void navigator.clipboard
    .writeText(value)
    .then(() => message.success(`${label} copied.`))
    .catch(() => message.error("Unable to copy."));
};

export const QrPaymentCard = ({ qrInfo, isLoading }: Props) => {
  if (isLoading) {
    return (
      <article className={styles.card}>
        <h3>QR payment</h3>
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
        <h3>Scan to pay</h3>
        <Tag color={isPending ? "gold" : "green"}>{qrInfo.paymentStatus}</Tag>
      </div>

      <div className={styles.qrWrap}>
        <img
          src={qrInfo.qrUrl}
          alt="VietQR transfer code"
          className={styles.qr}
        />
      </div>

      <p className={styles.hint}>
        Open your banking app, scan this code, and the amount + transfer note
        will be filled in automatically. The seller marks the order as paid
        after confirming the transfer.
      </p>

      <ul className={styles.info}>
        <li>
          <span>Bank</span>
          <strong>{qrInfo.bankName}</strong>
        </li>
        <li>
          <span>Account number</span>
          <Typography.Text
            copyable={{
              text: qrInfo.accountNo,
              onCopy: () => copyText(qrInfo.accountNo, "Account number"),
            }}
            className={styles.copyText}
          >
            {qrInfo.accountNo}
          </Typography.Text>
        </li>
        <li>
          <span>Account name</span>
          <strong>{qrInfo.accountName}</strong>
        </li>
        <li>
          <span>Amount</span>
          <strong className={styles.amount}>
            {formatMoney(qrInfo.amount)}
          </strong>
        </li>
        <li>
          <span>Transfer note</span>
          <Typography.Text
            copyable={{
              text: qrInfo.transferContent,
              onCopy: () =>
                copyText(qrInfo.transferContent, "Transfer note"),
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
