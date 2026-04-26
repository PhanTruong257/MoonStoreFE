import { Button, Popconfirm, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import styles from "./seller-products-page.module.scss";

import type { AppDispatch, RootState } from "@/app/app-store";
import {
  SELLER_PRODUCT_STATUS,
  SELLER_ROUTES,
  formatSellerCurrency,
} from "@/const/seller.const";
import { sellerProductsActions } from "@/features/seller/seller-products/seller-products.slice";
import type { SellerProductListItem } from "@/services/seller-service";

const DEFAULT_STATUS_FILTER = "ALL";
const STATUS_LABEL_LIVE = "Live";
const STATUS_LABEL_DRAFT = "Draft";
const STATUS_LABEL_DELETED = "Deleted";

const getStatusTag = (status: string) => {
  if (status === SELLER_PRODUCT_STATUS.ACTIVE) {
    return { color: "green", label: STATUS_LABEL_LIVE };
  }
  if (status === "deleted") {
    return { color: "red", label: STATUS_LABEL_DELETED };
  }
  return { color: "default", label: STATUS_LABEL_DRAFT };
};

export const useSellerProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, isDeleting, error, statusFilter } = useSelector(
    (state: RootState) => state.sellerProducts,
  );

  useEffect(() => {
    dispatch(sellerProductsActions.sellerProductsRequested());
  }, [dispatch]);

  const setStatusFilter = (value: string) => {
    dispatch(sellerProductsActions.sellerProductsStatusFilterChanged(value));
  };

  const handleDelete = (productId: number) => {
    dispatch(sellerProductsActions.sellerProductDeleteRequested(productId));
  };

  const filtered = useMemo(() => {
    if (statusFilter === DEFAULT_STATUS_FILTER) {
      return products;
    }
    return products.filter((item) => item.status === statusFilter);
  }, [products, statusFilter]);

  const columns: ColumnsType<SellerProductListItem> = useMemo(
    () => [
      {
        title: "Product",
        key: "product",
        render: (_, record) => (
          <div className={styles.productCell}>
            <img
              src={record.imageUrl}
              alt={record.name}
              className={styles.productThumb}
            />
            <div>
              <div className={styles.productName}>{record.name}</div>
              <div className={styles.productMeta}>ID: {record.id}</div>
            </div>
          </div>
        ),
      },
      {
        title: "Price",
        align: "right",
        render: (_, record) => formatSellerCurrency(record.basePrice),
      },
      {
        title: "Stock",
        align: "right",
        render: (_, record) => `${record.stock} units`,
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status: string) => {
          const tag = getStatusTag(status);
          return <Tag color={tag.color}>{tag.label}</Tag>;
        },
      },
      {
        title: "",
        key: "actions",
        align: "right",
        render: (_, record) => (
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Link to={`${SELLER_ROUTES.products}/${record.id}/edit`}>
              <Button size="small">Edit</Button>
            </Link>
            <Popconfirm
              title="Delete this product?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
              disabled={record.status === "deleted"}
            >
              <Button
                size="small"
                danger
                disabled={record.status === "deleted"}
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    loading: isLoading,
    deleting: isDeleting,
    error,
    products,
    filtered,
    statusFilter,
    setStatusFilter,
    columns,
  };
};
