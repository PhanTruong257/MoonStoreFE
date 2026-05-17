import { Button, Form, Input, InputNumber, Modal, Skeleton, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { SellerShell } from "@/features/seller/components/seller-shell";
import {
  formatSellerCurrency,
  formatSellerDateTime,
  WITHDRAWAL_STATUS_COLORS,
} from "@/const/seller.const";
import type { WalletTransaction, WithdrawalRequest } from "@/services/wallet-service";
import styles from "./seller-wallet-page.module.scss";
import { useSellerWallet } from "./use-seller-wallet";

const txColumns: ColumnsType<WalletTransaction> = [
  { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (v) => formatSellerDateTime(v) },
  { title: "Type", dataIndex: "type", key: "type" },
  { title: "Gross", dataIndex: "amount", key: "amount", render: (v) => formatSellerCurrency(v) },
  { title: "Fee", dataIndex: "fee", key: "fee", render: (v) => formatSellerCurrency(v) },
  { title: "Net", dataIndex: "net", key: "net", render: (v) => formatSellerCurrency(v) },
  { title: "Description", dataIndex: "description", key: "description" },
];

const withdrawalColumns: ColumnsType<WithdrawalRequest> = [
  { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (v) => formatSellerDateTime(v) },
  { title: "Amount", dataIndex: "amount", key: "amount", render: (v) => formatSellerCurrency(v) },
  { title: "Bank", dataIndex: "bankName", key: "bankName" },
  { title: "Account", dataIndex: "bankAccount", key: "bankAccount" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (v: string) => <Tag color={WITHDRAWAL_STATUS_COLORS[v] ?? "default"}>{v}</Tag>,
  },
  { title: "Note", dataIndex: "note", key: "note", render: (v) => v ?? "—" },
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

  return (
    <SellerShell
      title="Wallet"
      subtitle="Track your earnings and manage withdrawals."
      actions={
        <Button type="primary" onClick={openWithdrawModal} disabled={!wallet || wallet.balance <= 0}>
          Withdraw
        </Button>
      }
    >
      {error ? <p className={styles.errorText}>{error}</p> : null}

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <>
          <div className={styles.summary}>
            <div className={`${styles.statCard} ${styles.accent}`}>
              <span className={styles.statLabel}>Available balance</span>
              <strong className={styles.statValue}>
                {formatSellerCurrency(wallet?.balance ?? 0)}
              </strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total earned</span>
              <strong className={styles.statValue}>
                {formatSellerCurrency(wallet?.totalEarned ?? 0)}
              </strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total withdrawn</span>
              <strong className={styles.statValue}>
                {formatSellerCurrency(wallet?.totalWithdrawn ?? 0)}
              </strong>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Transaction history</h3>
            <Table
              columns={txColumns}
              dataSource={transactions}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 10 }}
            />
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Withdrawal requests</h3>
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
        title="Request withdrawal"
        open={withdrawModalOpen}
        onCancel={closeWithdrawModal}
        onOk={() => form.submit()}
        okText="Submit"
        confirmLoading={isWithdrawing}
      >
        {withdrawError ? <p className={styles.errorText}>{withdrawError}</p> : null}
        <Form form={form} layout="vertical" onFinish={submitWithdrawal}>
          <Form.Item
            label="Amount (VND)"
            name="amount"
            rules={[
              { required: true, message: "Enter amount" },
              {
                validator: (_, value) => {
                  if (wallet && value > wallet.balance) {
                    return Promise.reject("Amount exceeds available balance");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Bank name" name="bankName" rules={[{ required: true }]}>
            <Input placeholder="e.g. Vietcombank" />
          </Form.Item>
          <Form.Item label="Account number" name="bankAccount" rules={[{ required: true }]}>
            <Input placeholder="Account number" />
          </Form.Item>
          <Form.Item label="Account holder" name="bankHolder" rules={[{ required: true }]}>
            <Input placeholder="Full name on account" />
          </Form.Item>
        </Form>
      </Modal>
    </SellerShell>
  );
};
