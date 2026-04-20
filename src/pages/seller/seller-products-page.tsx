import { useMemo, useState } from "react";

import { getStoredUser } from "@/features/auth/auth-storage";
import { SellerProductsActions } from "@/features/seller/components/seller-products-actions";
import { SellerProductsTable } from "@/features/seller/components/seller-products-table";
import { SellerProductsToolbar } from "@/features/seller/components/seller-products-toolbar";
import { SellerShell } from "@/features/seller/components/seller-shell";
import { loadSellerProducts } from "@/features/seller/seller-storage";

export const SellerProductsPage = () => {
  const user = getStoredUser();
  const [filter, setFilter] = useState("all");
  const products = user ? loadSellerProducts(user.id) : [];

  const filtered = useMemo(() => {
    if (filter === "all") {
      return products;
    }
    return products.filter((item) => item.status === filter);
  }, [filter, products]);

  return (
    <SellerShell
      title="Manage products"
      subtitle="Review, refine, and keep every listing fresh for buyers."
      actions={<SellerProductsActions />}
    >
      <SellerProductsToolbar filter={filter} onFilterChange={setFilter} />
      <SellerProductsTable items={filtered} />
    </SellerShell>
  );
};
