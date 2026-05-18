import { Button, Form, Input, Modal, Popconfirm, Skeleton, Tag } from "antd";
import { useState } from "react";

import { useAdminBrands } from "./use-admin-brands";

import { UI_TEXT } from "@/const/ui-text";
import { AdminShell } from "@/features/admin/components/admin-shell";
import type { AdminBrand } from "@/services/admin-service";
import styles from "@/styles/admin-list.module.scss";

const t = UI_TEXT.admin.brands;

type FormValues = { name: string };

export const AdminBrandsPage = () => {
  const { items, isLoading, isSubmitting, create, update, remove } =
    useAdminBrands();

  const [editing, setEditing] = useState<AdminBrand | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm<FormValues>();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setIsOpen(true);
  };

  const openEdit = (brand: AdminBrand) => {
    setEditing(brand);
    form.setFieldsValue({ name: brand.name });
    setIsOpen(true);
  };

  const submit = (values: FormValues) => {
    if (editing) {
      update(editing.id, values.name);
    } else {
      create(values.name);
    }
    setIsOpen(false);
  };

  return (
    <AdminShell
      title={t.title}
      subtitle={t.subtitle}
      actions={
        <Button type="primary" onClick={openCreate}>
          {t.newBrandBtn}
        </Button>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <div className={styles.list}>
          {items.map((brand) => (
            <article key={brand.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <strong>{brand.name}</strong>
                  <Tag>{t.productCount(brand.productCount)}</Tag>
                </div>
                <div className={styles.meta}>ID #{brand.id}</div>
              </div>
              <div className={styles.actions}>
                <Button size="small" onClick={() => openEdit(brand)}>
                  {t.editBtn}
                </Button>
                <Popconfirm
                  title={t.deleteTitle}
                  okText={t.deleteOk}
                  okButtonProps={{ danger: true }}
                  onConfirm={() => remove(brand.id)}
                >
                  <Button size="small" danger>
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
            label={t.nameLabel}
            name="name"
            rules={[{ required: true, message: t.nameRequired }]}
          >
            <Input placeholder={t.namePlaceholder} />
          </Form.Item>
        </Form>
      </Modal>
    </AdminShell>
  );
};
