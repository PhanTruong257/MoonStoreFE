import { Result } from 'antd'
import { Link } from 'react-router-dom'

import { useAppSelector } from '@/store/hooks'

export const OrderSuccessPage = () => {
  const latestOrder = useAppSelector((state) => state.order.latestOrder)

  return (
    <section className="page-section">
      <Result
        status="success"
        title="Order placed successfully"
        subTitle={
          latestOrder ? `Your order code is ${latestOrder.code}. We will contact you soon.` : undefined
        }
        extra={<Link to="/account">View account orders</Link>}
      />
    </section>
  )
}
