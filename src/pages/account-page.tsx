import { Button } from 'antd'
import { useEffect } from 'react'

import { OrderDetail } from '@/features/order/components/order-detail'
import { OrderHistory } from '@/features/order/components/order-history'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/auth-slice'
import { fetchOrderHistoryThunk } from '@/store/thunks'

export const AccountPage = () => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const orders = useAppSelector((state) => state.order.orders)
  const latestOrder = useAppSelector((state) => state.order.latestOrder)

  useEffect(() => {
    dispatch(fetchOrderHistoryThunk())
  }, [dispatch])

  return (
    <section className="page-section">
      <h1>My Account</h1>
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <Button onClick={() => dispatch(logout())}>Logout</Button>
      <OrderDetail order={latestOrder} />
      <h2>Order history</h2>
      <OrderHistory orders={orders} />
    </section>
  )
}
