import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { AddToCartAction } from '@/features/product-detail/components/add-to-cart-action'
import { ImageGallery } from '@/features/product-detail/components/image-gallery'
import { VariantSelector } from '@/features/product-detail/components/variant-selector'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProductDetailThunk } from '@/store/thunks'
import { formatCurrency } from '@/utils/currency'

export const ProductDetailPage = () => {
  const { productId } = useParams()
  const dispatch = useAppDispatch()
  const product = useAppSelector((state) => state.product.selectedProduct)
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>()

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetailThunk(productId))
    }
  }, [dispatch, productId])

  if (!product) {
    return <p>Product not found.</p>
  }

  return (
    <section className="product-detail page-section">
      <ImageGallery images={product.gallery} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="price">{formatCurrency(product.price)}</p>
        <VariantSelector
          variants={product.variants}
          value={selectedVariant}
          onChange={setSelectedVariant}
        />
        <AddToCartAction product={product} selectedVariant={selectedVariant} />
      </div>
    </section>
  )
}
