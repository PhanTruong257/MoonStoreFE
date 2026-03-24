import { EmptyState } from '@/components/ui/empty-state'
import { ProductGrid } from '@/components/grid/product-grid'
import type { Product } from '@/global-types'

interface ProductListProps {
  products: Product[]
}

export const ProductList = ({ products }: ProductListProps) => {
  if (products.length === 0) {
    return <EmptyState description="No product matched your filter." />
  }

  return <ProductGrid products={products} />
}
