import { useEffect, useState } from 'react'

import { ProductFilter } from '@/features/catalog/components/product-filter'
import { ProductList } from '@/features/catalog/components/product-list'
import type { ProductFilterRequest } from '@/global-types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProductsThunk } from '@/store/thunks'

export const HomePage = () => {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector((state) => state.product)
  const [filter, setFilter] = useState<ProductFilterRequest>({ sortBy: 'rating-desc' })

  useEffect(() => {
    dispatch(fetchProductsThunk(filter))
  }, [dispatch, filter])

  return (
    <section className="page-section">
      <div className="page-title-wrap">
        <h1>Fresh picks for your everyday life</h1>
        <p>Built for modern shopping experiences with speed and confidence.</p>
      </div>
      <ProductFilter onChange={(next) => setFilter((prev) => ({ ...prev, ...next }))} />
      {loading ? <p>Loading products...</p> : <ProductList products={products} />}
    </section>
  )
}
