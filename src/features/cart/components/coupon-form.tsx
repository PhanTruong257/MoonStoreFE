import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch } from '@/store/hooks'
import { applyCoupon } from '@/store/slices/cart-slice'

export const CouponForm = () => {
  const dispatch = useAppDispatch()
  const [coupon, setCoupon] = useState('')

  return (
    <div className="coupon-form">
      <Input placeholder="Coupon code (try SAVE10)" value={coupon} onChange={(event) => setCoupon(event.target.value)} />
      <Button onClick={() => dispatch(applyCoupon(coupon))}>Apply</Button>
    </div>
  )
}
