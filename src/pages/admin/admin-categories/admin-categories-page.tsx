import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Tag,
} from "antd";
import { useMemo, useState } from "react";

import { useAdminCategories } from "./use-admin-categories";

import { UI_TEXT } from "@/const/ui-text";
import { AdminShell } from "@/features/admin/components/admin-shell";
import type { AdminCategory } from "@/services/admin-service";
import styles from "@/styles/admin-list.module.scss";

const t = UI_TEXT.admin.categories;

type FormValues = {
  name: string;
  parentId?: number | null;
};

export const AdminCategoriesPage = () => {
  const { items, isLoading, isSubmitting, create, update, remove } =
    useAdminCategories();

  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm<FormValues>();

  const parentOptions = useMemo(
    () => [
      { label: t.noParent, value: 0 },
      ...items.map((item) => ({
        label: item.parentId ? `↳ ${item.name}` : item.name,
        value: item.id,
      })),
    ],
    [items],
  );

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ name: "", parentId: 0 });
    setIsOpen(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setEditing(cat);
    form.setFieldsValue({
      name: cat.name,
      parentId: cat.parentId ?? 0,
    });
    setIsOpen(true);
  };

  const submit = (values: FormValues) => {
    const parentId =
      values.parentId === 0 || values.parentId === undefined
        ? null
        : Number(values.parentId);
    if (editing) {
      update(editing.id, { name: values.name, parentId });
    } else {
      create({ name: values.name, parentId });
    }
    setIsOpen(false);
  };

  return (
    <AdminShell
      title={t.title}
      subtitle={t.subtitle}
      actions={
        <Button type="primary" onClick={openCreate}>
          {t.newCategoryBtn}
        </Button>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className={styles.list}>
          {items.map((cat) => (
            <article key={cat.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <strong>
                    {cat.parentId ? "↳ " : ""}
                    {cat.name}
                  </strong>
                  <Tag>{t.productCount(cat.productCount)}</Tag>
                  {cat.childCount > 0 ? (
                    <Tag color="blue">{t.childCount(cat.childCount)}</Tag>
                  ) : null}
                </div>
                <div className={styles.meta}>
                  ID #{cat.id}
                  {cat.parentId ? ` · parent #${cat.parentId}` : ""}
                </div>
              </div>
              <div className={styles.actions}>
                <Button size="small" onClick={() => openEdit(cat)}>
                  {t.editBtn}
                </Button>
                <Popconfirm
                  title={t.deleteTitle}
                  okText={t.deleteOk}
                  okButtonProps={{ danger: true }}
                  onConfirm={() => remove(cat.id)}
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
          <Form.Item label={t.parentLabel} name="parentId">
            <Select
              options={parentOptions.filter(
                (opt) => !editing || opt.value !== editing.id,
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </AdminShell>
  );
};
