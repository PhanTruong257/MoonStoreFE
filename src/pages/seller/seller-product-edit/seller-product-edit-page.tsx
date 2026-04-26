import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Skeleton,
} from "antd";
import { Link } from "react-router-dom";

import styles from "./seller-product-edit-page.module.scss";
import { useSellerProductEdit } from "./use-seller-product-edit";

import { SELLER_ROUTES } from "@/const/seller.const";
import { SellerShell } from "@/features/seller/components/seller-shell";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
];

export const SellerProductEditPage = () => {
  const {
    form,
    loading,
    submitting,
    deleting,
    error,
    categories,
    handleSubmit,
    handleDelete,
  } = useSellerProductEdit();

  return (
    <SellerShell
      title="Edit product"
      subtitle="Update product details, stock, and option groups."
      actions={
        <Link to={SELLER_ROUTES.products} className={styles.backLink}>
          ← Back to products
        </Link>
      }
    >
      <div className={styles.card}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={submitting || deleting}
          >
            <Form.Item
              label="Product name"
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="iPhone 17 Pro Max" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true }]}
            >
              <Select options={STATUS_OPTIONS} />
            </Form.Item>

            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true }]}
            >
              <Select
                options={categories.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Brand id"
              name="brandId"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Base price"
              name="basePrice"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Stock"
              name="stock"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Image URL"
              name="imageUrl"
              rules={[{ required: true }]}
            >
              <Input placeholder="/images/products/..." />
            </Form.Item>

            <Form.Item
              label="Option groups (JSON, leave empty to keep current)"
              name="optionGroupsJson"
              extra={
                'Format: [{"name":"Size","required":true,"multiSelect":false,"options":[{"name":"S","priceDelta":0}]}]'
              }
            >
              <Input.TextArea rows={6} placeholder="[]" />
            </Form.Item>

            {error ? <p className={styles.errorText}>{error}</p> : null}

            <div className={styles.actions}>
              <Popconfirm
                title="Delete this product? It will be hidden from the storefront."
                okText="Delete"
                okButtonProps={{ danger: true }}
                onConfirm={handleDelete}
              >
                <Button danger loading={deleting}>
                  Delete product
                </Button>
              </Popconfirm>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Save changes
              </Button>
            </div>
          </Form>
        )}
      </div>
    </SellerShell>
  );
};
