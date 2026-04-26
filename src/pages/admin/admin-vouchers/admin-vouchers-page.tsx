import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Tag,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";

import styles from "./admin-vouchers-page.module.scss";
import { useAdminVouchers } from "./use-admin-vouchers";

import { AdminShell } from "@/features/admin/components/admin-shell";
import type { AdminVoucher } from "@/services/admin-service";

const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percent (%)", value: "percent" },
  { label: "Fixed amount", value: "fixed" },
];

type FormValues = {
  code: string;
  discountType: string;
  value: number;
  maxDiscount?: number;
  expiredAt: Dayjs;
};

const formatExpiry = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString();
};

export const AdminVouchersPage = () => {
  const { items, isLoading, isSubmitting, create, update, remove } =
    useAdminVouchers();

  const [editing, setEditing] = useState<AdminVoucher | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm<FormValues>();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      discountType: "percent",
      value: 10,
      expiredAt: dayjs().add(30, "day"),
    });
    setIsOpen(true);
  };

  const openEdit = (voucher: AdminVoucher) => {
    setEditing(voucher);
    form.setFieldsValue({
      code: voucher.code,
      discountType: voucher.discountType,
      value: voucher.value,
      maxDiscount: voucher.maxDiscount ?? undefined,
      expiredAt: dayjs(voucher.expiredAt),
    });
    setIsOpen(true);
  };

  const submit = (values: FormValues) => {
    const payload = {
      code: values.code,
      discountType: values.discountType,
      value: Number(values.value),
      maxDiscount:
        values.maxDiscount !== undefined && values.maxDiscount !== null
          ? Number(values.maxDiscount)
          : null,
      expiredAt: values.expiredAt.toISOString(),
    };
    if (editing) {
      update(editing.id, payload);
    } else {
      create(payload);
    }
    setIsOpen(false);
  };

  const [nowMs] = useState(() => Date.now());
  const isExpired = (iso: string) => new Date(iso).getTime() < nowMs;

  return (
    <AdminShell
      title="Vouchers"
      subtitle="Create and manage discount vouchers."
      actions={
        <Button type="primary" onClick={openCreate}>
          New voucher
        </Button>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <div className={styles.list}>
          {items.map((voucher) => (
            <article key={voucher.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <strong>{voucher.code}</strong>
                  <Tag color={voucher.discountType === "percent" ? "blue" : "geekblue"}>
                    {voucher.discountType === "percent"
                      ? `${voucher.value}%`
                      : `-$${voucher.value}`}
                  </Tag>
                  {isExpired(voucher.expiredAt) ? (
                    <Tag color="red">EXPIRED</Tag>
                  ) : (
                    <Tag color="green">ACTIVE</Tag>
                  )}
                </div>
                <div className={styles.meta}>
                  Expires {formatExpiry(voucher.expiredAt)} · Used{" "}
                  {voucher.usageCount} time(s)
                  {voucher.maxDiscount !== null
                    ? ` · max -$${voucher.maxDiscount}`
                    : ""}
                </div>
              </div>
              <div className={styles.actions}>
                <Button size="small" onClick={() => openEdit(voucher)}>
                  Edit
                </Button>
                <Popconfirm
                  title={
                    voucher.usageCount > 0
                      ? "Voucher already used; cannot delete."
                      : "Delete voucher?"
                  }
                  okText="Delete"
                  okButtonProps={{
                    danger: true,
                    disabled: voucher.usageCount > 0,
                  }}
                  onConfirm={() => remove(voucher.id)}
                  disabled={voucher.usageCount > 0}
                >
                  <Button
                    size="small"
                    danger
                    disabled={voucher.usageCount > 0}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={isOpen}
        title={editing ? "Edit voucher" : "New voucher"}
        okText="Save"
        onOk={() => form.submit()}
        onCancel={() => setIsOpen(false)}
        confirmLoading={isSubmitting}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Code is required" }]}
          >
            <Input placeholder="SUMMER10" />
          </Form.Item>
          <Form.Item
            label="Discount type"
            name="discountType"
            rules={[{ required: true }]}
          >
            <Select options={DISCOUNT_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item
            label="Value"
            name="value"
            rules={[{ required: true, message: "Value is required" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Max discount (optional)" name="maxDiscount">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Expired at"
            name="expiredAt"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} showTime />
          </Form.Item>
        </Form>
      </Modal>
    </AdminShell>
  );
};
