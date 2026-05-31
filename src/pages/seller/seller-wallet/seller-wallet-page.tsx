import { Button, Form, Input, InputNumber, Modal, Skeleton, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useSetSellerShell } from "@/features/seller/components/seller-shell-context";
import {
  formatSellerCurrency,
  formatSellerDateTime,
  WITHDRAWAL_STATUS_COLORS,
} from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import type { WalletTransaction, WithdrawalRequest } from "@/services/wallet-service";
import styles from "./seller-wallet-page.module.scss";
import { useSellerWallet } from "./use-seller-wallet";

const t = UI_TEXT.seller.wallet;

const txColumns: ColumnsType<WalletTransaction> = [
  { title: t.tableDate, dataIndex: "createdAt", key: "createdAt", render: (v) => formatSellerDateTime(v) },
  { title: t.tableType, dataIndex: "type", key: "type" },
  { title: t.tableGross, dataIndex: "amount", key: "amount", render: (v) => formatSellerCurrency(v) },
  { title: t.tableFee, dataIndex: "fee", key: "fee", render: (v) => formatSellerCurrency(v) },
  { title: t.tableNet, dataIndex: "net", key: "net", render: (v) => formatSellerCurrency(v) },
  { title: t.tableDesc, dataIndex: "description", key: "description" },
];

const withdrawalColumns: ColumnsType<WithdrawalRequest> = [
  { title: t.tableDate, dataIndex: "createdAt", key: "createdAt", render: (v) => formatSellerDateTime(v) },
  { title: t.tableAmount, dataIndex: "amount", key: "amount", render: (v) => formatSellerCurrency(v) },
  { title: t.tableBank, dataIndex: "bankName", key: "bankName" },
  { title: t.tableAccount, dataIndex: "bankAccount", key: "bankAccount" },
  {
    title: t.tableStatus,
    dataIndex: "status",
    key: "status",
    render: (v: string) => <Tag color={WITHDRAWAL_STATUS_COLORS[v] ?? "default"}>{v}</Tag>,
  },
  { title: t.tableNote, dataIndex: "note", key: "note", render: (v) => v ?? "—" },
];

export const SellerWalletPage = () => {
  const [form] = Form.useForm();
  const {
    wallet,
    transactions,
    withdrawals,
    isLoading,
    error,
    isWithdrawing,
    withdrawError,
    withdrawModalOpen,
    openWithdrawModal,
    closeWithdrawModal,
    submitWithdrawal,
  } = useSellerWallet(form);

  useSetSellerShell({
    title: t.title,
    subtitle: t.subtitle,
    actions: (
      <Button type="primary" onClick={openWithdrawModal} disabled={!wallet || wallet.balance <= 0}>
        {t.withdrawBtn}
      </Button>
    ),
  });

  return (
    <>
      {error ? <p className={styles.errorText}>{error}</p> : null}

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <>
          <div className={styles.summary}>
            <div className={`${styles.statCard} ${styles.accent}`}>
              <span className={styles.statLabel}>{t.availableBalance}</span>
              <strong className={styles.statValue}>
                {formatSellerCurrency(wallet?.balance ?? 0)}
              </strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>{t.totalEarned}</span>
              <strong className={styles.statValue}>
                {formatSellerCurrency(wallet?.totalEarned ?? 0)}
              </strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>{t.totalWithdrawn}</span>
              <strong className={styles.statValue}>
                {formatSellerCurrency(wallet?.totalWithdrawn ?? 0)}
              </strong>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.txHistory}</h3>
            <Table
              columns={txColumns}
              dataSource={transactions}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 10 }}
            />
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.withdrawalRequests}</h3>
            <Table
              columns={withdrawalColumns}
              dataSource={withdrawals}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 10 }}
            />
          </div>
        </>
      )}

      <Modal
        title={t.withdrawModalTitle}
        open={withdrawModalOpen}
        onCancel={closeWithdrawModal}
        onOk={() => form.submit()}
        okText={t.withdrawOk}
        confirmLoading={isWithdrawing}
      >
        {withdrawError ? <p className={styles.errorText}>{withdrawError}</p> : null}
        <Form form={form} layout="vertical" onFinish={submitWithdrawal}>
          <Form.Item
            label={t.amountLabel}
            name="amount"
            rules={[
              { required: true, message: t.amountRequired },
              {
                validator: (_, value) => {
                  if (wallet && value > wallet.balance) {
                    return Promise.reject(t.amountExceeds);
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label={t.bankNameLabel} name="bankName" rules={[{ required: true }]}>
            <Input placeholder={t.bankNamePlaceholder} />
          </Form.Item>
          <Form.Item label={t.accountNumberLabel} name="bankAccount" rules={[{ required: true }]}>
            <Input placeholder={t.accountNumberPlaceholder} />
          </Form.Item>
          <Form.Item label={t.accountHolderLabel} name="bankHolder" rules={[{ required: true }]}>
            <Input placeholder={t.accountHolderPlaceholder} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
