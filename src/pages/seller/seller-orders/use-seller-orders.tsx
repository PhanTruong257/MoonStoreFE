import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import styles from "./seller-orders-page.module.scss";

import type { AppDispatch, RootState } from "@/app/app-store";
import {
  SELLER_ORDER_STATUS_COLORS,
  SELLER_ROUTES,
  formatSellerCurrency,
  formatSellerDateTime,
} from "@/const/seller.const";
import { sellerOrdersActions } from "@/features/seller/seller-orders/seller-orders.slice";
import type { SellerOrderGroup } from "@/services/seller-service";

const DEFAULT_STATUS_FILTER = "ALL";

export const useSellerOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, isLoading, error, statusFilter } = useSelector(
    (state: RootState) => state.sellerOrders,
  );

  useEffect(() => {
    dispatch(sellerOrdersActions.sellerOrdersRequested());
  }, [dispatch]);

  const setStatusFilter = (value: string) => {
    dispatch(sellerOrdersActions.sellerOrdersStatusFilterChanged(value));
  };

  const filtered = useMemo(() => {
    if (statusFilter === DEFAULT_STATUS_FILTER) {
      return groups;
    }
    return groups.filter((g) => g.status === statusFilter);
  }, [groups, statusFilter]);

  const columns: ColumnsType<SellerOrderGroup> = useMemo(
    () => [
      {
        title: "Order #",
        dataIndex: "id",
        width: 100,
        render: (id: number, record) => (
          <Link to={SELLER_ROUTES.orderDetail(record.id)}>#{id}</Link>
        ),
      },
      {
        title: "Buyer",
        key: "buyer",
        render: (_, record) => (
          <div>
            <div className={styles.productName}>{record.buyer.fullName}</div>
            <div className={styles.productMeta}>{record.buyer.phone}</div>
          </div>
        ),
      },
      {
        title: "Items",
        key: "items",
        render: (_, record) => {
          const first = record.items[0];
          const more = record.items.length - 1;
          if (!first) {
            return <span className={styles.productMeta}>No items</span>;
          }
          return (
            <div className={styles.productCell}>
              <img
                src={first.imageUrl ?? ""}
                alt={first.productName}
                className={styles.productThumb}
              />
              <div>
                <div className={styles.productName}>{first.productName}</div>
                <div className={styles.productMeta}>
                  x{first.quantity}
                  {more > 0 ? ` +${more} more` : ""}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: "Subtotal",
        dataIndex: "subtotal",
        align: "right",
        render: (v: number) => formatSellerCurrency(v),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status: string) => (
          <Tag color={SELLER_ORDER_STATUS_COLORS[status] ?? "default"}>
            {status}
          </Tag>
        ),
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        render: (v: string) => formatSellerDateTime(v),
      },
      {
        title: "",
        key: "action",
        align: "right",
        render: (_, record) => (
          <Link to={SELLER_ROUTES.orderDetail(record.id)}>View</Link>
        ),
      },
    ],
    [],
  );

  return {
    loading: isLoading,
    error,
    groups,
    filtered,
    statusFilter,
    setStatusFilter,
    columns,
  };
};
