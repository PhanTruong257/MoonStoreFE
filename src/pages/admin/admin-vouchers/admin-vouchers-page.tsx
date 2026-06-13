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

import { useAdminVouchers } from "./use-admin-vouchers";

import { formatDate, formatMoneyShort } from "@/app/utils/format";
import {
  VOUCHER_DISCOUNT_TYPE,
  VOUCHER_DISCOUNT_TYPE_OPTIONS,
} from "@/const/voucher.const";
import { UI_TEXT } from "@/const/ui-text";
import { AdminShell } from "@/features/admin/components/admin-shell";
import type { AdminVoucher } from "@/services/admin-service";
import styles from "@/styles/admin-list.module.scss";

const t = UI_TEXT.admin.vouchers;

const DEFAULT_PERCENT_VALUE = 10;
const DEFAULT_EXPIRY_DAYS = 30;
const VOUCHER_CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const VOUCHER_CODE_LENGTH = 6;

const generateVoucherCode = () =>
  Array.from(
    { length: VOUCHER_CODE_LENGTH },
    () => VOUCHER_CODE_CHARS[Math.floor(Math.random() * VOUCHER_CODE_CHARS.length)],
  ).join("");

type FormValues = {
  code: string;
  discountType: string;
  value: number;
  maxDiscount?: number;
  expiredAt: Dayjs;
};

const formatDiscountValue = (voucher: AdminVoucher) =>
  voucher.discountType === VOUCHER_DISCOUNT_TYPE.PERCENT
    ? `${voucher.value}%`
    : `-${formatMoneyShort(voucher.value)}`;

export const AdminVouchersPage = () => {
  const { items, isLoading, isSubmitting, create, update, remove } =
    useAdminVouchers();

  const [editing, setEditing] = useState<AdminVoucher | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const [nowMs] = useState(() => Date.now());
  const isExpired = (iso: string) => new Date(iso).getTime() < nowMs;

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      code: generateVoucherCode(),
      discountType: VOUCHER_DISCOUNT_TYPE.PERCENT,
      value: DEFAULT_PERCENT_VALUE,
      expiredAt: dayjs().add(DEFAULT_EXPIRY_DAYS, "day"),
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

  return (
    <AdminShell
      title={t.title}
      subtitle={t.subtitle}
      actions={
        <Button type="primary" onClick={openCreate}>
          {t.newVoucherBtn}
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
                  <Tag
                    color={
                      voucher.discountType === VOUCHER_DISCOUNT_TYPE.PERCENT
                        ? "blue"
                        : "geekblue"
                    }
                  >
                    {formatDiscountValue(voucher)}
                  </Tag>
                  {isExpired(voucher.expiredAt) ? (
                    <Tag color="red">{t.expired}</Tag>
                  ) : (
                    <Tag color="green">{t.active}</Tag>
                  )}
                </div>
                <div className={styles.meta}>
                  {t.expires(formatDate(voucher.expiredAt))} · {t.usedCount(voucher.usageCount)}
                  {voucher.maxDiscount !== null
                    ? ` · ${t.maxDiscountMeta(formatMoneyShort(voucher.maxDiscount))}`
                    : ""}
                </div>
              </div>
              <div className={styles.actions}>
                <Button size="small" onClick={() => openEdit(voucher)}>
                  {t.editBtn}
                </Button>
                <Popconfirm
                  title={
                    voucher.usageCount > 0
                      ? t.deleteUsedTitle
                      : t.deleteTitle
                  }
                  okText={t.deleteOk}
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
                    {t.deleteBtn}
                  </Button>
                </Popconfirm>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={isOpen}
        title={editing ? t.editModalTitle : t.newModalTitle}
        okText={t.saveOk}
        onOk={() => form.submit()}
        onCancel={() => setIsOpen(false)}
        confirmLoading={isSubmitting}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item
            label={t.codeLabel}
            name="code"
            rules={[{ required: true, message: t.codeRequired }]}
          >
            <Input
              placeholder={t.codePlaceholder}
              addonAfter={
                editing ? null : (
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() =>
                      form.setFieldsValue({ code: generateVoucherCode() })
                    }
                  >
                    {t.generateCodeBtn}
                  </Button>
                )
              }
            />
          </Form.Item>
          <Form.Item
            label={t.discountTypeLabel}
            name="discountType"
            rules={[{ required: true }]}
          >
            <Select options={VOUCHER_DISCOUNT_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item
            label={t.valueLabel}
            name="value"
            rules={[{ required: true, message: t.valueRequired }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label={t.maxDiscountLabel} name="maxDiscount">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label={t.expiredAtLabel}
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
