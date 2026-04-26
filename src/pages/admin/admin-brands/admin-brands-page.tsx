import { useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Skeleton, Tag } from "antd";

import styles from "./admin-brands-page.module.scss";
import { useAdminBrands } from "./use-admin-brands";

import { AdminShell } from "@/features/admin/components/admin-shell";
import type { AdminBrand } from "@/services/admin-service";

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
      title="Brands"
      subtitle="Manage product brands."
      actions={
        <Button type="primary" onClick={openCreate}>
          New brand
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
                <strong>{brand.name}</strong>
                <Tag>{brand.productCount} products</Tag>
              </div>
              <div className={styles.actions}>
                <Button size="small" onClick={() => openEdit(brand)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete brand?"
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => remove(brand.id)}
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
        title={editing ? "Edit brand" : "New brand"}
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
            <Input placeholder="Nova" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminShell>
  );
};
