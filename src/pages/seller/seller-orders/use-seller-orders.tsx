import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import styles from "./seller-orders-page.module.scss";

import type { AppDispatch, RootState } from "@/app/app-store";
import { resolveImageUrl } from "@/app/utils/image-url";
import {
  SELLER_ORDER_STATUS_LABELS,
  SELLER_ROUTES,
  formatSellerCurrency,
  formatSellerDateTime,
} from "@/const/seller.const";
import { sellerOrdersActions } from "@/features/seller/seller-orders/seller-orders.slice";
import type { SellerOrderGroup } from "@/services/seller-service";

const DEFAULT_STATUS_FILTER = "ALL";

const STATUS_CLASS: Record<string, string> = {
  PENDING:   styles.statusPending,
  CONFIRMED: styles.statusConfirmed,
  SHIPPING:  styles.statusShipping,
  DELIVERED: styles.statusDelivered,
  CANCELLED: styles.statusCancelled,
};

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
    if (statusFilter === DEFAULT_STATUS_FILTER) return groups;
    return groups.filter((g) => g.status === statusFilter);
  }, [groups, statusFilter]);

  const columns: ColumnsType<SellerOrderGroup> = useMemo(
    () => [
      {
        title: "Đơn #",
        dataIndex: "id",
        width: 80,
        render: (id: number, record) => (
          <Link to={SELLER_ROUTES.orderDetail(record.id)} className={styles.orderBadge}>
            #{id}
          </Link>
        ),
      },
      {
        title: "Người mua",
        key: "buyer",
        render: (_, record) => {
          const initials = (record.buyer.fullName ?? "?")
            .split(" ")
            .map((w: string) => w[0])
            .slice(-2)
            .join("")
            .toUpperCase();
          return (
            <div className={styles.buyerCell}>
              <div className={styles.buyerAvatar}>{initials}</div>
              <div>
                <div className={styles.buyerName}>{record.buyer.fullName}</div>
                <div className={styles.buyerPhone}>{record.buyer.phone}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: "Sản phẩm",
        key: "items",
        render: (_, record) => {
          const first = record.items[0];
          const more = record.items.length - 1;
          if (!first) return <span className={styles.productMeta}>—</span>;
          return (
            <div className={styles.productCell}>
              <img
                src={resolveImageUrl(first.imageUrl)}
                alt={first.productName}
                className={styles.productThumb}
              />
              <div>
                <div className={styles.productName}>{first.productName}</div>
                <div className={styles.productMeta}>
                  x{first.quantity}
                  {more > 0 ? ` +${more} sản phẩm` : ""}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: "Tổng tiền",
        dataIndex: "subtotal",
        align: "right",
        render: (v: number) => (
          <span className={styles.subtotal}>{formatSellerCurrency(v)}</span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (status: string) => (
          <span className={`${styles.statusBadge} ${STATUS_CLASS[status] ?? styles.statusDefault}`}>
            {SELLER_ORDER_STATUS_LABELS[status] ?? status}
          </span>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        render: (v: string) => (
          <span className={styles.dateText}>{formatSellerDateTime(v)}</span>
        ),
      },
      {
        title: "",
        key: "action",
        align: "right",
        render: (_, record) => (
          <Link to={SELLER_ROUTES.orderDetail(record.id)} className={styles.viewBtn}>
            Xem →
          </Link>
        ),
      },
    ],
    [],
  );

  return { loading: isLoading, error, groups, filtered, statusFilter, setStatusFilter, columns };
};
