import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { ProductList } from '@/features/catalog/components/product-list'
import { useAppSelector } from '@/store/hooks'

export const CategoryPage = () => {
  const { categoryId } = useParams()
  const products = useAppSelector((state) => state.product.products)

  const filteredProducts = useMemo(() => {
    if (!categoryId || categoryId === 'all') {
      return products
    }

    return products.filter((product) => product.category === categoryId)
  }, [categoryId, products])

  return (
    <section className="page-section">
      <h1>Category: {categoryId}</h1>
      <ProductList products={filteredProducts} />
    </section>
  )
}
