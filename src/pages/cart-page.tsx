import { Card } from 'antd'
import { Link } from 'react-router-dom'

import { CouponForm } from '@/features/cart/components/coupon-form'
import { CartList } from '@/features/cart/components/cart-list'
import { useAppSelector } from '@/store/hooks'
import {
  calculateDiscount,
  calculateGrandTotal,
  calculateShippingFee,
  calculateSubtotal,
} from '@/utils/cart-calculations'
import { formatCurrency } from '@/utils/currency'

export const CartPage = () => {
  const cart = useAppSelector((state) => state.cart)
  const subtotal = calculateSubtotal(cart.items)
  const shippingFee = calculateShippingFee(subtotal, 'standard')
  const discount = calculateDiscount(subtotal, cart.couponCode)
  const total = calculateGrandTotal(subtotal, shippingFee, discount)

  return (
    <section className="page-section cart-layout">
      <div>
        <h1>Shopping Cart</h1>
        <CartList items={cart.items} />
        <CouponForm />
      </div>
      <Card title="Order Summary">
        <p>Subtotal: {formatCurrency(subtotal)}</p>
        <p>Shipping: {formatCurrency(shippingFee)}</p>
        <p>Discount: -{formatCurrency(discount)}</p>
        <p className="price">Total: {formatCurrency(total)}</p>
        <Link to="/checkout">Proceed to checkout</Link>
      </Card>
    </section>
  )
}
