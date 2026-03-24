import { Button, InputNumber } from 'antd'

import { EmptyState } from '@/components/ui/empty-state'
import type { CartItem } from '@/global-types'
import { useAppDispatch } from '@/store/hooks'
import { removeCartItem, updateCartQuantity } from '@/store/slices/cart-slice'
import { formatCurrency } from '@/utils/currency'

interface CartListProps {
  items: CartItem[]
}

export const CartList = ({ items }: CartListProps) => {
  const dispatch = useAppDispatch()

  if (items.length === 0) {
    return <EmptyState description="Your cart is empty." />
  }

  return (
    <div className="cart-list">
      {items.map((item) => (
        <article key={`${item.productId}-${item.selectedVariant ?? 'default'}`} className="cart-item">
          <img src={item.imageUrl} alt={item.name} />
          <div>
            <h3>{item.name}</h3>
            <p>{formatCurrency(item.price)}</p>
          </div>
          <InputNumber
            min={1}
            value={item.quantity}
            onChange={(value) =>
              dispatch(
                updateCartQuantity({
                  productId: item.productId,
                  selectedVariant: item.selectedVariant,
                  quantity: Number(value ?? 1),
                }),
              )
            }
          />
          <Button
            danger
            onClick={() =>
              dispatch(
                removeCartItem({
                  productId: item.productId,
                  selectedVariant: item.selectedVariant,
                }),
              )
            }
          >
            Remove
          </Button>
        </article>
      ))}
    </div>
  )
}
