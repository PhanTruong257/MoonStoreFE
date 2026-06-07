import { Button, Popconfirm, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useMemo } from "react";
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
const STATUS_LABEL_LIVE = "Đang bán";
const STATUS_LABEL_DRAFT = "Nháp";
const STATUS_LABEL_DELETED = "Đã xoá";

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

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.categoryName) cats.add(p.categoryName);
    });
    return Array.from(cats).sort();
  }, [products]);

  // State for filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = products;

    // Filter by status
    if (statusFilter !== DEFAULT_STATUS_FILTER) {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((item) => item.categoryName === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.id.toString().includes(query)
      );
    }

    return result;
  }, [products, statusFilter, selectedCategory, searchQuery]);

  const columns: ColumnsType<SellerProductListItem> = useMemo(
    () => [
      {
        title: "Sản phẩm",
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
        title: "Giá",
        align: "right",
        render: (_, record) => formatSellerCurrency(record.basePrice),
      },
      {
        title: "Tồn kho",
        align: "right",
        render: (_, record) => `${record.stock} cái`,
      },
      {
        title: "Trạng thái",
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
              <Button size="small">Chỉnh sửa</Button>
            </Link>
            <Popconfirm
              title="Xoá sản phẩm này?"
              okText="Xoá"
              cancelText="Huỷ"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
              disabled={record.status === "deleted"}
            >
              <Button
                size="small"
                danger
                disabled={record.status === "deleted"}
              >
                Xoá
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
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    columns,
  };
};
