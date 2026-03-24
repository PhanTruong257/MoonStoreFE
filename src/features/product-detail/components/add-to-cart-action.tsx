import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type { Product } from '@/global-types'
import { useAppDispatch } from '@/store/hooks'
import { addToCartThunk } from '@/store/thunks'

interface AddToCartActionProps {
  product: Product
  selectedVariant?: string
}

export const AddToCartAction = ({ product, selectedVariant }: AddToCartActionProps) => {
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="add-to-cart-action">
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      />
      <Button
        type="primary"
        onClick={() =>
          dispatch(
            addToCartThunk({
              productId: product.id,
              quantity,
              selectedVariant,
            }),
          )
        }
      >
        Add to cart
      </Button>
    </div>
  )
}
