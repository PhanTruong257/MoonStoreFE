import {
  Button,
  Checkbox,
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

import { ImageUploader } from "@/component/image-uploader/image-uploader";
import { SELLER_ROUTES } from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import { SellerShell } from "@/features/seller/components/seller-shell";

const t = UI_TEXT.seller.productEdit;

const STATUS_OPTIONS = [
  { label: t.statusActive, value: "active" },
  { label: t.statusDraft, value: "draft" },
];

type ImageUploaderFieldProps = {
  value?: string;
  onChange?: (url: string) => void;
  disabled?: boolean;
};

const ImageUploaderField = ({
  value,
  onChange,
  disabled,
}: ImageUploaderFieldProps) => (
  <ImageUploader
    value={value ?? ""}
    onChange={(url) => onChange?.(url)}
    disabled={disabled}
  />
);

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
      title={t.title}
      subtitle={t.subtitle}
      actions={
        <Link to={SELLER_ROUTES.products} className={styles.backLink}>
          {t.backToProducts}
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
              label={t.nameField}
              name="name"
              rules={[{ required: true, message: t.nameRequired }]}
            >
              <Input placeholder={t.namePlaceholder} />
            </Form.Item>

            <Form.Item label={t.descField} name="description">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label={t.statusField}
              name="status"
              rules={[{ required: true }]}
            >
              <Select options={STATUS_OPTIONS} />
            </Form.Item>

            <Form.Item
              label={t.categoryField}
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
              label={t.brandField}
              name="brandId"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={t.priceField}
              name="basePrice"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={t.stockField}
              name="stock"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={t.imageField}
              name="imageUrl"
              rules={[{ required: true, message: t.imageField }]}
              getValueFromEvent={(value: string) => value}
              trigger="onChange"
            >
              <ImageUploaderField disabled={submitting || deleting} />
            </Form.Item>

            <div className={styles.optionGroupsLabel}>{t.optionGroupsLabel}</div>
            <p className={styles.optionGroupsHint}>{t.optionGroupsHint}</p>

            <Form.List name="optionGroups">
              {(groupFields, groupOps) => (
                <div className={styles.groupList}>
                  {groupFields.map((groupField) => (
                    <div key={groupField.key} className={styles.groupCard}>
                      <div className={styles.groupHeader}>
                        <Form.Item
                          label={t.groupNameLabel}
                          name={[groupField.name, "name"]}
                          rules={[
                            { required: true, message: t.groupNameRequired },
                          ]}
                          className={styles.groupNameItem}
                        >
                          <Input placeholder={t.groupNamePlaceholder} />
                        </Form.Item>
                        <Button
                          danger
                          type="text"
                          onClick={() => groupOps.remove(groupField.name)}
                        >
                          {t.removeGroupBtn}
                        </Button>
                      </div>

                      <div className={styles.groupFlags}>
                        <Form.Item
                          name={[groupField.name, "required"]}
                          valuePropName="checked"
                          noStyle
                        >
                          <Checkbox>{t.requiredLabel}</Checkbox>
                        </Form.Item>
                        <Form.Item
                          name={[groupField.name, "multiSelect"]}
                          valuePropName="checked"
                          noStyle
                        >
                          <Checkbox>{t.multiSelectLabel}</Checkbox>
                        </Form.Item>
                      </div>

                      <Form.List name={[groupField.name, "options"]}>
                        {(optionFields, optionOps) => (
                          <div className={styles.optionList}>
                            {optionFields.map((optionField) => (
                              <div
                                key={optionField.key}
                                className={styles.optionRow}
                              >
                                <Form.Item
                                  name={[optionField.name, "name"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: t.optionNameRequired,
                                    },
                                  ]}
                                  className={styles.optionNameItem}
                                >
                                  <Input placeholder={t.optionNamePlaceholder} />
                                </Form.Item>
                                <Form.Item
                                  name={[optionField.name, "priceDelta"]}
                                  initialValue={0}
                                  className={styles.optionPriceItem}
                                >
                                  <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder={t.priceDeltaPlaceholder}
                                  />
                                </Form.Item>
                                <Button
                                  danger
                                  type="text"
                                  onClick={() =>
                                    optionOps.remove(optionField.name)
                                  }
                                >
                                  {t.removeOptionBtn}
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="dashed"
                              onClick={() =>
                                optionOps.add({ name: "", priceDelta: 0 })
                              }
                              block
                            >
                              {t.addOptionBtn}
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() =>
                      groupOps.add({
                        name: "",
                        required: false,
                        multiSelect: false,
                        options: [],
                      })
                    }
                    block
                  >
                    {t.addGroupBtn}
                  </Button>
                </div>
              )}
            </Form.List>

            {error ? <p className={styles.errorText}>{error}</p> : null}

            <div className={styles.actions}>
              <Popconfirm
                title={t.deleteConfirm}
                okText={UI_TEXT.common.delete}
                okButtonProps={{ danger: true }}
                onConfirm={handleDelete}
              >
                <Button danger loading={deleting}>
                  {t.deleteBtn}
                </Button>
              </Popconfirm>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {t.saveBtn}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </SellerShell>
  );
};
