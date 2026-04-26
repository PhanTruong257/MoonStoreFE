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

import { AdminShell } from "@/features/admin/components/admin-shell";
import type { AdminCategory } from "@/services/admin-service";
import styles from "@/styles/admin-list.module.scss";

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
      { label: "(no parent)", value: 0 },
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
      title="Categories"
      subtitle="Manage product categories tree."
      actions={
        <Button type="primary" onClick={openCreate}>
          New category
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
                  <Tag>{cat.productCount} products</Tag>
                  {cat.childCount > 0 ? (
                    <Tag color="blue">{cat.childCount} children</Tag>
                  ) : null}
                </div>
                <div className={styles.meta}>
                  ID #{cat.id}
                  {cat.parentId ? ` · parent #${cat.parentId}` : ""}
                </div>
              </div>
              <div className={styles.actions}>
                <Button size="small" onClick={() => openEdit(cat)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete category?"
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => remove(cat.id)}
                >
                  <Button size="small" danger>
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
        title={editing ? "Edit category" : "New category"}
        okText="Save"
        onOk={() => form.submit()}
        onCancel={() => setIsOpen(false)}
        confirmLoading={isSubmitting}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Phones" />
          </Form.Item>
          <Form.Item label="Parent" name="parentId">
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
